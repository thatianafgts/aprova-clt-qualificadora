-- Create admin_settings table for password protection
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings
CREATE POLICY "Anyone can read admin_settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert admin_settings" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update admin_settings" 
ON public.admin_settings 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();