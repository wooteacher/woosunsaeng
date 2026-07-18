-- 우선생 인터넷 상품/요금 관리 테이블
-- Supabase SQL Editor에서 이 파일의 전체 내용을 붙여넣고 한 번 실행하세요.

create table if not exists public.internet_carriers (
  id text primary key,
  label text not null,
  logo text not null,
  max_card_discount integer not null default 0 check (max_card_discount >= 0),
  price_verified_at text,
  pricing_basis text,
  equipment_note text,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internet_plans (
  id text primary key,
  carrier_id text not null references public.internet_carriers(id) on delete cascade,
  speed text not null check (speed in ('100M', '500M', '1G')),
  name text not null,
  description text,
  monthly_price integer not null default 0 check (monthly_price >= 0),
  mobile_discount integer not null default 0 check (mobile_discount >= 0),
  reward_amount integer not null default 0 check (reward_amount >= 0),
  reward_extra_benefit text,
  recommended boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internet_tv_plans (
  id text primary key,
  carrier_id text not null references public.internet_carriers(id) on delete cascade,
  name text not null,
  channels integer not null default 0 check (channels >= 0),
  description text,
  monthly_price integer not null default 0 check (monthly_price >= 0),
  recommended boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internet_bundle_rules (
  id text primary key,
  carrier_id text not null references public.internet_carriers(id) on delete cascade,
  speed text not null check (speed in ('100M', '500M', '1G')),
  tv_plan_id text not null references public.internet_tv_plans(id) on delete cascade,
  bundle_monthly_price integer not null default 0 check (bundle_monthly_price >= 0),
  mobile_discount integer not null default 0 check (mobile_discount >= 0),
  reward_amount integer not null default 0 check (reward_amount >= 0),
  reward_extra_benefit text,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (carrier_id, speed, tv_plan_id)
);

create index if not exists internet_carriers_active_order_idx
  on public.internet_carriers (active, display_order);
create index if not exists internet_plans_carrier_order_idx
  on public.internet_plans (carrier_id, active, display_order);
create index if not exists internet_tv_plans_carrier_order_idx
  on public.internet_tv_plans (carrier_id, active, display_order);
create index if not exists internet_bundle_rules_carrier_order_idx
  on public.internet_bundle_rules (carrier_id, active, display_order);

create or replace function public.set_internet_catalog_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_internet_carriers_updated_at on public.internet_carriers;
create trigger set_internet_carriers_updated_at
before update on public.internet_carriers
for each row execute function public.set_internet_catalog_updated_at();

drop trigger if exists set_internet_plans_updated_at on public.internet_plans;
create trigger set_internet_plans_updated_at
before update on public.internet_plans
for each row execute function public.set_internet_catalog_updated_at();

drop trigger if exists set_internet_tv_plans_updated_at on public.internet_tv_plans;
create trigger set_internet_tv_plans_updated_at
before update on public.internet_tv_plans
for each row execute function public.set_internet_catalog_updated_at();

drop trigger if exists set_internet_bundle_rules_updated_at on public.internet_bundle_rules;
create trigger set_internet_bundle_rules_updated_at
before update on public.internet_bundle_rules
for each row execute function public.set_internet_catalog_updated_at();

alter table public.internet_carriers enable row level security;
alter table public.internet_plans enable row level security;
alter table public.internet_tv_plans enable row level security;
alter table public.internet_bundle_rules enable row level security;

drop policy if exists "Public can read active internet carriers" on public.internet_carriers;
create policy "Public can read active internet carriers"
on public.internet_carriers for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active internet plans" on public.internet_plans;
create policy "Public can read active internet plans"
on public.internet_plans for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active internet tv plans" on public.internet_tv_plans;
create policy "Public can read active internet tv plans"
on public.internet_tv_plans for select
to anon, authenticated
using (active = true);

drop policy if exists "Public can read active internet bundle rules" on public.internet_bundle_rules;
create policy "Public can read active internet bundle rules"
on public.internet_bundle_rules for select
to anon, authenticated
using (active = true);

grant select on public.internet_carriers to anon, authenticated;
grant select on public.internet_plans to anon, authenticated;
grant select on public.internet_tv_plans to anon, authenticated;
grant select on public.internet_bundle_rules to anon, authenticated;
