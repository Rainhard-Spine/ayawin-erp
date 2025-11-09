-- Advanced Permissions System
CREATE TABLE public.module_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  module TEXT NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT false,
  can_create BOOLEAN NOT NULL DEFAULT false,
  can_edit BOOLEAN NOT NULL DEFAULT false,
  can_delete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role, module)
);

-- Notifications System
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  priority TEXT NOT NULL DEFAULT 'normal',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Currency Support
CREATE TABLE public.currencies (
  code TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate NUMERIC NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add currency columns to existing tables
ALTER TABLE public.sales ADD COLUMN currency_code TEXT DEFAULT 'USD' REFERENCES public.currencies(code);
ALTER TABLE public.expenses ADD COLUMN currency_code TEXT DEFAULT 'USD' REFERENCES public.currencies(code);
ALTER TABLE public.products ADD COLUMN currency_code TEXT DEFAULT 'USD' REFERENCES public.currencies(code);
ALTER TABLE public.companies ADD COLUMN default_currency TEXT DEFAULT 'USD' REFERENCES public.currencies(code);

-- Data Export Logs
CREATE TABLE public.export_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  export_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Module Permissions
CREATE POLICY "Users can view permissions"
  ON public.module_permissions FOR SELECT
  USING (true);

CREATE POLICY "Company admins can manage permissions"
  ON public.module_permissions FOR ALL
  USING (has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL AND company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

-- RLS Policies for Currencies
CREATE POLICY "Everyone can view active currencies"
  ON public.currencies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Company admins can manage currencies"
  ON public.currencies FOR ALL
  USING (has_role(auth.uid(), 'company_admin'));

-- RLS Policies for Export Logs
CREATE POLICY "Users can view export logs in their company"
  ON public.export_logs FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create export logs in their company"
  ON public.export_logs FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

-- Insert default currencies
INSERT INTO public.currencies (code, name, symbol, exchange_rate) VALUES
  ('USD', 'US Dollar', '$', 1.0),
  ('EUR', 'Euro', '€', 0.92),
  ('GBP', 'British Pound', '£', 0.79),
  ('JPY', 'Japanese Yen', '¥', 149.50),
  ('CNY', 'Chinese Yuan', '¥', 7.24),
  ('INR', 'Indian Rupee', '₹', 83.12),
  ('AUD', 'Australian Dollar', 'A$', 1.52),
  ('CAD', 'Canadian Dollar', 'C$', 1.36);

-- Insert default module permissions for company_admin
INSERT INTO public.module_permissions (role, module, can_view, can_create, can_edit, can_delete) VALUES
  ('company_admin', 'inventory', true, true, true, true),
  ('company_admin', 'sales', true, true, true, true),
  ('company_admin', 'finance', true, true, true, true),
  ('company_admin', 'hr', true, true, true, true),
  ('company_admin', 'crm', true, true, true, true),
  ('company_admin', 'suppliers', true, true, true, true),
  ('company_admin', 'analytics', true, true, true, true),
  ('company_admin', 'settings', true, true, true, true);

-- Function to check module permissions
CREATE OR REPLACE FUNCTION public.has_module_permission(
  _user_id UUID,
  _module TEXT,
  _permission TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.module_permissions mp ON ur.role = mp.role
    WHERE ur.user_id = _user_id
      AND mp.module = _module
      AND (
        (_permission = 'view' AND mp.can_view = true) OR
        (_permission = 'create' AND mp.can_create = true) OR
        (_permission = 'edit' AND mp.can_edit = true) OR
        (_permission = 'delete' AND mp.can_delete = true)
      )
  )
$$;

-- Function to create low stock notifications
CREATE OR REPLACE FUNCTION public.check_low_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.quantity <= NEW.min_stock_level AND NEW.is_active = true THEN
    INSERT INTO public.notifications (company_id, title, message, type, priority, link)
    VALUES (
      NEW.company_id,
      'Low Stock Alert',
      'Product "' || NEW.name || '" is running low. Current stock: ' || NEW.quantity || ', Minimum: ' || NEW.min_stock_level,
      'warning',
      'high',
      '/dashboard/inventory'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for low stock notifications
CREATE TRIGGER trigger_low_stock_notification
  AFTER UPDATE OF quantity ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.check_low_stock();

-- Function to notify on leave request
CREATE OR REPLACE FUNCTION public.notify_leave_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO public.notifications (company_id, title, message, type, priority, link)
    VALUES (
      NEW.company_id,
      'New Leave Request',
      'A new leave request has been submitted and requires approval',
      'info',
      'normal',
      '/dashboard/hr'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for leave request notifications
CREATE TRIGGER trigger_leave_request_notification
  AFTER INSERT ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_leave_request();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger for currency updates
CREATE TRIGGER update_currencies_updated_at
  BEFORE UPDATE ON public.currencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();