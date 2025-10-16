-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view visible products"
  ON public.products
  FOR SELECT
  USING (visible = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (title, description, icon, features, display_order) VALUES
('POS System', 'Modern point-of-sale solution for retail and restaurants with real-time inventory tracking, sales analytics, and payment processing integration.', 'ShoppingCart', ARRAY['Real-time inventory tracking', 'Multiple payment methods', 'Sales analytics & reporting', 'Employee management', 'Receipt printing & email'], 1),
('Inventory Management System', 'Comprehensive inventory control system with automated stock alerts, barcode scanning, and multi-location support for businesses of any size.', 'Package', ARRAY['Automated stock alerts', 'Barcode scanning', 'Multi-location support', 'Supplier management', 'Purchase order automation'], 2),
('CRM Software', 'Customer relationship management platform to track leads, manage contacts, automate follow-ups, and increase customer retention.', 'Users', ARRAY['Lead tracking & conversion', 'Contact management', 'Email automation', 'Sales pipeline visualization', 'Customer history tracking'], 3),
('Booking & Scheduling System', 'Online appointment and booking system with calendar integration, automated reminders, and payment collection for service-based businesses.', 'Calendar', ARRAY['Online appointment booking', 'Calendar synchronization', 'Automated SMS/email reminders', 'Payment integration', 'Staff scheduling'], 4),
('E-commerce Platform', 'Full-featured online store solution with product catalog, shopping cart, payment gateway integration, and order management capabilities.', 'Store', ARRAY['Product catalog management', 'Shopping cart & checkout', 'Payment gateway integration', 'Order tracking', 'Customer accounts'], 5);