-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses in their company"
  ON public.expenses
  FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create expenses in their company"
  ON public.expenses
  FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can update expenses in their company"
  ON public.expenses
  FOR UPDATE
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can delete expenses"
  ON public.expenses
  FOR DELETE
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

-- Trigger for updated_at
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();