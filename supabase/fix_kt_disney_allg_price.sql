-- KT 지니TV 디즈니+ 모든G 요금 긴급 교정
-- Supabase SQL Editor에 이 파일의 전체 SQL을 붙여넣고 실행하세요.
-- 기준: 모든G 대비 디즈니+ 모든G 월 1,700원 차이

begin;

update public.internet_tv_plans
set
  monthly_price = 25900,
  description = '모든G와 디즈니+ 결합',
  updated_at = now()
where id = 'kt-tv-disney-allg'
  and carrier_id = 'KT';

update public.internet_bundle_rules
set
  bundle_monthly_price = case speed
    when '100M' then 47900
    when '500M' then 53400
    when '1G' then 58900
    else bundle_monthly_price
  end,
  mobile_discount = case speed
    when '100M' then 3300
    when '500M' then 5500
    when '1G' then 5500
    else mobile_discount
  end,
  updated_at = now()
where carrier_id = 'KT'
  and tv_plan_id = 'kt-tv-disney-allg'
  and speed in ('100M', '500M', '1G');

commit;

-- 실행 후 확인용
select id, carrier_id, name, monthly_price
from public.internet_tv_plans
where id in ('kt-tv-allg', 'kt-tv-disney-allg')
order by id;

select speed, tv_plan_id, bundle_monthly_price, mobile_discount
from public.internet_bundle_rules
where carrier_id = 'KT'
  and tv_plan_id in ('kt-tv-allg', 'kt-tv-disney-allg')
order by speed, tv_plan_id;
