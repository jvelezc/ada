-- Drop existing types
DROP TYPE IF EXISTS public.accessibility_level CASCADE;
DROP TYPE IF EXISTS public.moderation_status CASCADE;
DROP TYPE IF EXISTS public.door_width CASCADE;
DROP TYPE IF EXISTS public.door_type CASCADE;
DROP TYPE IF EXISTS public.floor_type CASCADE;
DROP TYPE IF EXISTS public.parking_type CASCADE;

-- Create enum types
CREATE TYPE public.accessibility_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.door_width AS ENUM ('wide', 'standard', 'narrow');
CREATE TYPE public.door_type AS ENUM ('automatic', 'manual_easy', 'manual_heavy');
CREATE TYPE public.floor_type AS ENUM ('smooth', 'carpet', 'uneven');
CREATE TYPE public.parking_type AS ENUM ('dedicated', 'street', 'none');