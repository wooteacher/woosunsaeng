-- 우선생 렌탈 상품 관리 테이블
-- Supabase SQL Editor에서 한 번 실행하세요.

create table if not exists public.rental_products (
  id text primary key,
  category text not null check (
    category in ('정수기', '공기청정기', '비데', '안마의자', '세탁·건조', '주방가전', '생활가전')
  ),
  brand text not null,
  name text not null,
  model_name text not null default '옵션 상담',
  image_url text,
  monthly_price integer check (monthly_price is null or monthly_price >= 0),
  max_card_discount integer check (max_card_discount is null or max_card_discount >= 0),
  final_price integer check (final_price is null or final_price >= 0),
  contracts text[] not null default '{}',
  management text[] not null default '{}',
  features text[] not null default '{}',
  purposes text[] not null default '{}',
  recommended boolean not null default false,
  popular boolean not null default false,
  source_url text,
  verified_at date,
  data_status text not null default 'catalog' check (data_status in ('verified', 'catalog')),
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rental_products_active_order_idx
  on public.rental_products (active, display_order, created_at);

create index if not exists rental_products_category_idx
  on public.rental_products (category);

create index if not exists rental_products_brand_idx
  on public.rental_products (brand);

alter table public.rental_products enable row level security;

drop policy if exists "Public can read active rental products" on public.rental_products;
create policy "Public can read active rental products"
  on public.rental_products
  for select
  to anon, authenticated
  using (active = true);

create or replace function public.set_rental_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_rental_products_updated_at on public.rental_products;
create trigger set_rental_products_updated_at
before update on public.rental_products
for each row
execute function public.set_rental_products_updated_at();
