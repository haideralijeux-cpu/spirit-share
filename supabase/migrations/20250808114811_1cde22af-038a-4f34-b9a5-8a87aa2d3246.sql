-- Add additional fields to profiles table for editing
ALTER TABLE public.profiles 
ADD COLUMN display_name TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN avatar_url TEXT;

-- Create index for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);