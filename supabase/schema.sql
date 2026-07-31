-- Betalight Enterprises Ltd — Supabase schema
-- Applied manually via the Supabase SQL editor. RLS is enabled on every
-- table with no policies defined: only the service_role key (used
-- server-side in src/lib/supabase/server-client.ts) can read or write.
-- The anon key has no access at all, so there is nothing to lock down on
-- the client side.

create extension if not exists "pgcrypto";

-- ── Leads ────────────────────────────────────────────────────────────────

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null
);
alter table contact_messages enable row level security;

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service_category text not null,
  product_interest text,
  county text not null,
  message text
);
alter table quote_requests enable row level security;

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);
alter table newsletter_subscribers enable row level security;

-- ── Catalog / content ────────────────────────────────────────────────────

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  name text not null,
  category text not null,
  brand text,
  short_description text not null,
  description text not null,
  image_path text not null,
  specs jsonb not null default '{}'::jsonb,
  featured boolean not null default false
);
alter table products enable row level security;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  location text not null,
  image_path text not null,
  completed_date date
);
alter table projects enable row level security;

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_path text,
  category text not null,
  seo_description text not null,
  published_at timestamptz not null default now()
);
alter table blog_posts enable row level security;

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author_name text not null,
  role_or_company text not null,
  quote text not null,
  rating integer not null default 5,
  photo_path text
);
alter table testimonials enable row level security;

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  question text not null,
  answer text not null,
  category text not null,
  sort_order integer not null default 0
);
alter table faqs enable row level security;

-- ── Site settings (contacts & socials) ──────────────────────────────────
-- Singleton row (id is always 1) holding the contact details and social
-- links shown across the header, footer and SEO schema. Edited from
-- /admin/settings; src/lib/data/settings.ts falls back to the static
-- defaults in src/lib/site-config.ts if this table is empty or missing.

create table if not exists site_settings (
  id smallint primary key default 1,
  updated_at timestamptz not null default now(),
  phone_primary text not null default '',
  phone_shop1 text not null default '',
  phone_shop2 text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  address_city text not null default '',
  address_country text not null default '',
  hours jsonb not null default '[]'::jsonb,
  service_areas jsonb not null default '[]'::jsonb,
  social_facebook text not null default '',
  social_instagram text not null default '',
  social_tiktok text not null default '',
  social_twitter text not null default '',
  social_linkedin text not null default '',
  constraint site_settings_singleton check (id = 1)
);
alter table site_settings enable row level security;
