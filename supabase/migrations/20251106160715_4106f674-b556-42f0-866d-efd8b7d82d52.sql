-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cost DECIMAL(10, 2) DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  image_url TEXT,
  barcode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sku)
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Users can view products in their company"
ON public.products
FOR SELECT
USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create products in their company"
ON public.products
FOR INSERT
WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update products in their company"
ON public.products
FOR UPDATE
USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can delete products in their company"
ON public.products
FOR DELETE
USING (company_id = get_user_company(auth.uid()) AND has_role(auth.uid(), 'company_admin'::app_role));

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for product images
CREATE POLICY "Users can view product images in their company"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies WHERE id = get_user_company(auth.uid())
  )
);

CREATE POLICY "Users can upload product images for their company"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = get_user_company(auth.uid())::text
);

CREATE POLICY "Users can update product images for their company"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = get_user_company(auth.uid())::text
);

CREATE POLICY "Users can delete product images for their company"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = get_user_company(auth.uid())::text
);