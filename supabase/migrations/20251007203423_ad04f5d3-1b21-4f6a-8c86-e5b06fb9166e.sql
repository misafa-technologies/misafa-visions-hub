-- Create contact_information table for dynamic contact details
CREATE TABLE public.contact_information (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create services_offered table for dynamic services management
CREATE TABLE public.services_offered (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  features text[],
  visible boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create workers table for contributors managed by admin
CREATE TABLE public.workers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  skills text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create chat_fellow_requests table for client submissions
CREATE TABLE public.chat_fellow_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  project_type text NOT NULL,
  description text NOT NULL,
  target_audience text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'rejected')),
  assigned_worker_id uuid REFERENCES public.workers(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create student_assignments table for student submissions
CREATE TABLE public.student_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL,
  student_email text NOT NULL,
  student_phone text,
  assignment_title text NOT NULL,
  assignment_description text NOT NULL,
  login_credentials text,
  deadline timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'rejected')),
  assigned_worker_id uuid REFERENCES public.workers(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create work_applications table for people applying to become contributors
CREATE TABLE public.work_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  skills text[],
  experience text,
  portfolio_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contact_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_fellow_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_information
CREATE POLICY "Anyone can view contact information"
  ON public.contact_information FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage contact information"
  ON public.contact_information FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services_offered
CREATE POLICY "Anyone can view visible services"
  ON public.services_offered FOR SELECT
  USING (visible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage services"
  ON public.services_offered FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workers
CREATE POLICY "Workers can view their own profile"
  ON public.workers FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage workers"
  ON public.workers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chat_fellow_requests
CREATE POLICY "Anyone can submit chat fellow requests"
  ON public.chat_fellow_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and assigned workers can view requests"
  ON public.chat_fellow_requests FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage chat fellow requests"
  ON public.chat_fellow_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Assigned workers can update request status"
  ON public.chat_fellow_requests FOR UPDATE
  USING (assigned_worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

-- RLS Policies for student_assignments
CREATE POLICY "Anyone can submit student assignments"
  ON public.student_assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and assigned workers can view assignments"
  ON public.student_assignments FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    assigned_worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage student assignments"
  ON public.student_assignments FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Assigned workers can update assignment status"
  ON public.student_assignments FOR UPDATE
  USING (assigned_worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid()));

-- RLS Policies for work_applications
CREATE POLICY "Anyone can submit work applications"
  ON public.work_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage work applications"
  ON public.work_applications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_contact_information_updated_at
  BEFORE UPDATE ON public.contact_information
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_offered_updated_at
  BEFORE UPDATE ON public.services_offered
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON public.workers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_fellow_requests_updated_at
  BEFORE UPDATE ON public.chat_fellow_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_assignments_updated_at
  BEFORE UPDATE ON public.student_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_applications_updated_at
  BEFORE UPDATE ON public.work_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default contact information
INSERT INTO public.contact_information (key, value, label, category) VALUES
  ('email', 'contact@misafa.com', 'Email Address', 'contact'),
  ('phone', '+1234567890', 'Phone Number', 'contact'),
  ('address', '123 Business St, City, Country', 'Office Address', 'contact'),
  ('facebook', 'https://facebook.com/misafa', 'Facebook', 'social'),
  ('twitter', 'https://twitter.com/misafa', 'Twitter', 'social'),
  ('instagram', 'https://instagram.com/misafa', 'Instagram', 'social'),
  ('linkedin', 'https://linkedin.com/company/misafa', 'LinkedIn', 'social');