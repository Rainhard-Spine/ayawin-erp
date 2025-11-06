-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sale_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sale_number)
);

-- Create sale_items table
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales
CREATE POLICY "Users can view sales in their company"
ON public.sales
FOR SELECT
USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create sales in their company"
ON public.sales
FOR INSERT
WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update sales in their company"
ON public.sales
FOR UPDATE
USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete sales"
ON public.sales
FOR DELETE
USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'::app_role));

-- RLS Policies for sale_items
CREATE POLICY "Users can view sale items in their company"
ON public.sale_items
FOR SELECT
USING (
  sale_id IN (
    SELECT id FROM public.sales WHERE company_id = get_user_company(auth.uid())
  )
);

CREATE POLICY "Users can create sale items in their company"
ON public.sale_items
FOR INSERT
WITH CHECK (
  sale_id IN (
    SELECT id FROM public.sales WHERE company_id = get_user_company(auth.uid())
  )
);

CREATE POLICY "Users can update sale items in their company"
ON public.sale_items
FOR UPDATE
USING (
  sale_id IN (
    SELECT id FROM public.sales WHERE company_id = get_user_company(auth.uid())
  )
);

CREATE POLICY "Users can delete sale items in their company"
ON public.sale_items
FOR DELETE
USING (
  sale_id IN (
    SELECT id FROM public.sales WHERE company_id = get_user_company(auth.uid())
  )
);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate sale number
CREATE OR REPLACE FUNCTION public.generate_sale_number(company_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  sale_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(sale_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.sales
  WHERE company_id = company_uuid;
  
  sale_num := 'SALE-' || LPAD(next_number::TEXT, 6, '0');
  RETURN sale_num;
END;
$$;

-- Function to update product inventory after sale
CREATE OR REPLACE FUNCTION public.update_inventory_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET quantity = quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update inventory when sale item is created
CREATE TRIGGER update_inventory_after_sale
AFTER INSERT ON public.sale_items
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_on_sale();