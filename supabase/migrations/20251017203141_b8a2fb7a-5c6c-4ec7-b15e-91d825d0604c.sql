-- Add pricing and link fields to services_offered table
ALTER TABLE services_offered
ADD COLUMN pricing jsonb DEFAULT '[]'::jsonb,
ADD COLUMN link_url text;