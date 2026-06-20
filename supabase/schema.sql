-- SQL migration code to run in your Supabase SQL Editor

-- NOTE: If you already had a "projects" table, "CREATE TABLE IF NOT EXISTS"
-- did not add the new layout columns (like aspect, col_span, gradient, etc.).
-- 
-- CHOOSE ONE OF THE OPTIONS BELOW TO RUN IN YOUR SUPABASE SQL EDITOR:

-- =============================================================================
-- OPTION A: CLEAN RESET (Recommended for fresh setups / dev)
-- This drops the old table and rebuilds it with all required columns.
-- =============================================================================

DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    thumbnail_url TEXT,
    vertical BOOLEAN NOT NULL DEFAULT true,
    col_span TEXT NOT NULL DEFAULT 'col-span-4',
    aspect TEXT NOT NULL DEFAULT 'aspect-[9/16]',
    gradient TEXT NOT NULL DEFAULT 'from-[#0a001a] via-[#1a0033] to-[#0a0010]',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- OPTION B: PRESERVE DATA (Use this if you already have custom projects entered)
-- This adds only the new columns to your existing table safely.
-- =============================================================================
/*
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS vertical BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS col_span TEXT NOT NULL DEFAULT 'col-span-4';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS aspect TEXT NOT NULL DEFAULT 'aspect-[9/16]';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gradient TEXT NOT NULL DEFAULT 'from-[#0a001a] via-[#1a0033] to-[#0a0010]';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
*/

-- -------------------------------------------------------------
-- 2. Configure Row Level Security (RLS)
-- -------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop policy if already exists to prevent duplicate errors during rerun
DROP POLICY IF EXISTS "Allow public read of published projects" ON public.projects;

-- Policy to allow anonymous read-only access to published projects
CREATE POLICY "Allow public read of published projects" 
ON public.projects 
FOR SELECT 
USING (published = true);

-- Note: No separate admin policies are required because admin dashboard
-- operations run server-side using the service role key, which
-- automatically bypasses Row Level Security.

-- -------------------------------------------------------------
-- 3. Seed original static portfolio projects
-- -------------------------------------------------------------
INSERT INTO public.projects (title, type, embed_url, thumbnail_url, vertical, col_span, aspect, gradient, sort_order, published)
VALUES
(
    'iPhone 15',
    'Product Ad',
    'https://www.youtube.com/embed/7dGbQm-wbq8?rel=0',
    'https://img.youtube.com/vi/7dGbQm-wbq8/maxresdefault.jpg',
    true,
    'col-span-4',
    'aspect-[9/16]',
    'from-[#0a001a] via-[#1a0033] to-[#0a0010]',
    1,
    true
),
(
    'world cup 2026',
    'Showreel',
    'https://www.youtube.com/embed/FVwhrK4512o?rel=0',
    'https://img.youtube.com/vi/FVwhrK4512o/maxresdefault.jpg',
    true,
    'col-span-4',
    'aspect-[9/16]',
    'from-[#1a0a00] via-[#3d1500] to-[#1a0000]',
    2,
    true
),
(
    'Top Techniques 2026',
    'Short Film',
    'https://www.youtube.com/embed/axvIreuGjq0?rel=0',
    'https://img.youtube.com/vi/axvIreuGjq0/maxresdefault.jpg',
    true,
    'col-span-4',
    'aspect-[9/16]',
    'from-[#000d1a] via-[#001533] to-[#000a1a]',
    3,
    true
),
(
    'Real Estate',
    'Commercial',
    'https://www.youtube.com/embed/zQ4OZPWqdFo?si=IS9BuyPp2BA0yjjM&controls=0',
    'https://img.youtube.com/vi/zQ4OZPWqdFo/maxresdefault.jpg',
    false,
    'col-span-6',
    'aspect-video',
    'from-[#000d1a] via-[#001020] to-[#00080f]',
    4,
    true
),
(
    'Real Estate',
    'Commercial',
    'https://www.youtube.com/embed/8e2LqAGaisw?rel=0',
    'https://img.youtube.com/vi/8e2LqAGaisw/maxresdefault.jpg',
    false,
    'col-span-6',
    'aspect-video',
    'from-[#000d1a] via-[#001020] to-[#00080f]',
    5,
    true
),
(
    'YouTube Short',
    'Social Content',
    'https://www.youtube.com/embed/kWzbYZjMoSk?rel=0',
    'https://img.youtube.com/vi/kWzbYZjMoSk/maxresdefault.jpg',
    true,
    'col-span-4',
    'aspect-[9/16]',
    'from-[#160600] via-[#2a0d00] to-[#120500]',
    6,
    true
);
