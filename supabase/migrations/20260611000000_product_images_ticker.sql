-- Add gallery images array to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb;
