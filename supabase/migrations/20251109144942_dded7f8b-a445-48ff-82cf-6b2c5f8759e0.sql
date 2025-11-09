-- CRM Module Tables
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  company_name TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  stage TEXT NOT NULL DEFAULT 'lead',
  expected_close_date DATE,
  actual_close_date DATE,
  probability INTEGER DEFAULT 50,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'email',
  subject TEXT,
  notes TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Supplier Management Tables
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  contact_person TEXT,
  payment_terms TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  po_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  actual_delivery DATE,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, po_number)
);

CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Customers
CREATE POLICY "Users can view customers in their company"
  ON public.customers FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create customers in their company"
  ON public.customers FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update customers in their company"
  ON public.customers FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete customers"
  ON public.customers FOR DELETE
  USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Deals
CREATE POLICY "Users can view deals in their company"
  ON public.deals FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create deals in their company"
  ON public.deals FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update deals in their company"
  ON public.deals FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete deals"
  ON public.deals FOR DELETE
  USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Communications
CREATE POLICY "Users can view communications in their company"
  ON public.communications FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create communications in their company"
  ON public.communications FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update communications in their company"
  ON public.communications FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete communications"
  ON public.communications FOR DELETE
  USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Suppliers
CREATE POLICY "Users can view suppliers in their company"
  ON public.suppliers FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create suppliers in their company"
  ON public.suppliers FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update suppliers in their company"
  ON public.suppliers FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete suppliers"
  ON public.suppliers FOR DELETE
  USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Purchase Orders
CREATE POLICY "Users can view purchase orders in their company"
  ON public.purchase_orders FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create purchase orders in their company"
  ON public.purchase_orders FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update purchase orders in their company"
  ON public.purchase_orders FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete purchase orders"
  ON public.purchase_orders FOR DELETE
  USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Purchase Order Items
CREATE POLICY "Users can view PO items in their company"
  ON public.purchase_order_items FOR SELECT
  USING (po_id IN (SELECT id FROM public.purchase_orders WHERE company_id = get_user_company(auth.uid())));

CREATE POLICY "Users can create PO items in their company"
  ON public.purchase_order_items FOR INSERT
  WITH CHECK (po_id IN (SELECT id FROM public.purchase_orders WHERE company_id = get_user_company(auth.uid())));

CREATE POLICY "Users can update PO items in their company"
  ON public.purchase_order_items FOR UPDATE
  USING (po_id IN (SELECT id FROM public.purchase_orders WHERE company_id = get_user_company(auth.uid())));

CREATE POLICY "Users can delete PO items in their company"
  ON public.purchase_order_items FOR DELETE
  USING (po_id IN (SELECT id FROM public.purchase_orders WHERE company_id = get_user_company(auth.uid())));

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate PO numbers
CREATE OR REPLACE FUNCTION public.generate_po_number(company_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  next_number INTEGER;
  po_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.purchase_orders
  WHERE company_id = company_uuid;
  
  po_num := 'PO-' || LPAD(next_number::TEXT, 6, '0');
  RETURN po_num;
END;
$$;