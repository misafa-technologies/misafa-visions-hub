-- Add pricing field to products table
ALTER TABLE public.products
ADD COLUMN pricing jsonb DEFAULT '[]'::jsonb;

-- Insert shared hosting product
INSERT INTO public.products (title, description, icon, features, pricing, visible, display_order)
VALUES (
  'Shared Hosting',
  'Reliable and affordable web hosting solutions for your websites and applications',
  'Server',
  ARRAY[
    'cPanel Control Panel',
    '99.9% Uptime Guarantee',
    'Free SSL Certificate',
    'Daily Backups',
    '24/7 Technical Support',
    'One-Click App Installer',
    'Email Accounts Included'
  ],
  '[
    {"name": "Basic", "price": "4.99", "period": "month", "features": ["1 Website", "10 GB SSD Storage", "Unmetered Bandwidth", "10 Email Accounts"]},
    {"name": "Professional", "price": "8.99", "period": "month", "features": ["5 Websites", "50 GB SSD Storage", "Unmetered Bandwidth", "50 Email Accounts", "Free Domain 1 Year"]},
    {"name": "Business", "price": "14.99", "period": "month", "features": ["Unlimited Websites", "100 GB SSD Storage", "Unmetered Bandwidth", "Unlimited Email Accounts", "Free Domain 1 Year", "Priority Support"]}
  ]'::jsonb,
  true,
  100
);

-- Insert domain registration product
INSERT INTO public.products (title, description, icon, features, pricing, visible, display_order)
VALUES (
  'Domain Registration',
  'Secure your perfect domain name with competitive pricing and easy management',
  'Globe',
  ARRAY[
    'Wide Range of TLDs Available',
    'Free WHOIS Privacy Protection',
    'Easy DNS Management',
    'Domain Transfer Support',
    'Auto-Renewal Options',
    'Email Forwarding',
    'Domain Forwarding'
  ],
  '[
    {"name": ".com", "price": "12.99", "period": "year", "features": ["Most Popular", "Professional Image", "Global Recognition"]},
    {"name": ".net", "price": "13.99", "period": "year", "features": ["Tech-Focused", "Network Services", "Alternative to .com"]},
    {"name": ".org", "price": "13.99", "period": "year", "features": ["Organizations", "Non-Profits", "Communities"]},
    {"name": ".io", "price": "39.99", "period": "year", "features": ["Tech Startups", "Modern Image", "Developer Favorite"]},
    {"name": ".co", "price": "24.99", "period": "year", "features": ["Business Focused", "Short & Memorable", "Global Appeal"]}
  ]'::jsonb,
  true,
  101
);

-- Insert professional email product
INSERT INTO public.products (title, description, icon, features, pricing, visible, display_order)
VALUES (
  'Professional Email',
  'Custom email addresses with your domain name for a professional business presence',
  'Mail',
  ARRAY[
    'Custom Domain Email (@yourdomain.com)',
    'Ad-Free Experience',
    'Advanced Spam Protection',
    'Mobile & Desktop Access',
    'Calendar & Contacts Sync',
    '99.9% Uptime SLA',
    'Secure Encryption (TLS/SSL)',
    'Large Storage Capacity'
  ],
  '[
    {"name": "Starter", "price": "2.99", "period": "month/mailbox", "features": ["5 GB Storage", "Webmail Access", "IMAP/POP3 Support", "Mobile App Access"]},
    {"name": "Business", "price": "5.99", "period": "month/mailbox", "features": ["25 GB Storage", "Calendar & Contacts", "Advanced Security", "Priority Support", "Email Aliases"]},
    {"name": "Enterprise", "price": "9.99", "period": "month/mailbox", "features": ["50 GB Storage", "Advanced Collaboration", "Enhanced Security", "Dedicated Support", "Archiving & Compliance", "Custom Integrations"]}
  ]'::jsonb,
  true,
  102
);