-- Fix the handle_new_user function to create company during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id UUID;
BEGIN
  -- Check if company_name is provided (new signup)
  IF NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    -- Create the company
    INSERT INTO public.companies (name, default_currency)
    VALUES (
      NEW.raw_user_meta_data->>'company_name',
      COALESCE(NEW.raw_user_meta_data->>'default_currency', 'USD')
    )
    RETURNING id INTO new_company_id;
    
    -- Create profile with new company_id
    INSERT INTO public.profiles (id, full_name, company_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      new_company_id
    );
    
    -- Assign company_admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'company_admin');
  ELSE
    -- Existing user flow (invited users)
    INSERT INTO public.profiles (id, full_name, company_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      (NEW.raw_user_meta_data->>'company_id')::UUID
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create audit_logs table for tracking all changes
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID,
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit logs
CREATE POLICY "Company admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    company_id = get_user_company(auth.uid()) AND
    has_role(auth.uid(), 'company_admin')
  );

CREATE POLICY "System can create audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_audit_logs_company_id ON public.audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

-- Create reports table for saved reports
CREATE TABLE public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL, -- 'sales', 'inventory', 'finance', 'hr', 'custom'
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  schedule TEXT, -- 'daily', 'weekly', 'monthly', null for manual
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports in their company"
  ON public.saved_reports
  FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create reports in their company"
  ON public.saved_reports
  FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update reports in their company"
  ON public.saved_reports
  FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete reports"
  ON public.saved_reports
  FOR DELETE
  USING (
    company_id = get_user_company(auth.uid()) AND
    has_role(auth.uid(), 'company_admin')
  );

-- Create email_queue table for outgoing emails
CREATE TABLE public.email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_name TEXT,
  template_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company admins can view email queue"
  ON public.email_queue
  FOR SELECT
  USING (
    company_id = get_user_company(auth.uid()) AND
    has_role(auth.uid(), 'company_admin')
  );

CREATE POLICY "System can manage email queue"
  ON public.email_queue
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_email_queue_status ON public.email_queue(status, scheduled_for);

-- Add email_notifications preference to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "low_stock": true,
  "leave_requests": true,
  "new_orders": true,
  "payment_reminders": true
}'::jsonb;