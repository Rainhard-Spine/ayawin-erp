-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  employee_number TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  hire_date DATE NOT NULL,
  employment_status TEXT NOT NULL DEFAULT 'active',
  salary NUMERIC NOT NULL DEFAULT 0,
  salary_type TEXT NOT NULL DEFAULT 'monthly',
  avatar_url TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, employee_number)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payroll table
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  bonuses NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees
CREATE POLICY "Users can view employees in their company"
  ON public.employees FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can manage employees"
  ON public.employees FOR ALL
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for attendance
CREATE POLICY "Users can view attendance in their company"
  ON public.attendance FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Users can create attendance records"
  ON public.attendance FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can update attendance"
  ON public.attendance FOR UPDATE
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

CREATE POLICY "Company admins can delete attendance"
  ON public.attendance FOR DELETE
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for leave_requests
CREATE POLICY "Users can view leave requests in their company"
  ON public.leave_requests FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Employees can create leave requests"
  ON public.leave_requests FOR INSERT
  WITH CHECK (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can update leave requests"
  ON public.leave_requests FOR UPDATE
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

-- RLS Policies for payroll
CREATE POLICY "Users can view payroll in their company"
  ON public.payroll FOR SELECT
  USING (company_id = get_user_company(auth.uid()));

CREATE POLICY "Company admins can manage payroll"
  ON public.payroll FOR ALL
  USING (
    company_id = get_user_company(auth.uid()) 
    AND has_role(auth.uid(), 'company_admin')
  );

-- Triggers for updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();