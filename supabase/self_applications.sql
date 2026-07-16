-- Supabase SQL Editor에서 실행하세요.
-- 민감정보 원문은 payment_info_encrypted / payout_info_encrypted에 암호화되어 저장됩니다.

create table if not exists public.self_applications (
  id uuid primary key default gen_random_uuid(),
  receipt_code text not null,
  source text not null default 'self_apply',
  status text not null default '신규접수',

  product_summary text not null,
  base_monthly_price integer not null default 0,
  estimated_monthly_price integer not null default 0,
  mobile_discount integer not null default 0,
  card_discount integer not null default 0,
  use_mobile_discount boolean not null default false,
  use_card_discount boolean not null default false,

  install_fee integer not null default 0,
  gift_card_amount integer not null default 0,
  cash_benefit_amount integer not null default 0,

  applicant_name text not null,
  applicant_birth_date text not null,
  applicant_phone text not null,
  applicant_email text,

  postcode text,
  installation_address text not null,
  installation_address_detail text not null,

  payment_method text not null check (payment_method in ('account', 'card')),
  payment_summary_masked text not null,
  payment_info_encrypted text not null,

  payout_account_masked text not null,
  payout_info_encrypted text not null,

  privacy_agreed boolean not null default false,
  third_party_agreed boolean not null default false,
  marketing_agreed boolean not null default false,
  agreed_at timestamptz not null default now(),

  assigned_to uuid,
  crm_memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists self_applications_receipt_code_idx
  on public.self_applications (receipt_code);

create index if not exists self_applications_phone_idx
  on public.self_applications (applicant_phone);

create index if not exists self_applications_status_created_idx
  on public.self_applications (status, created_at desc);

alter table public.self_applications enable row level security;

-- 브라우저 anon key로 직접 조회/저장하지 않습니다.
-- 서버 API의 service role만 접근하도록 공개 정책을 만들지 않습니다.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists self_applications_set_updated_at
  on public.self_applications;

create trigger self_applications_set_updated_at
before update on public.self_applications
for each row
execute function public.set_updated_at();
