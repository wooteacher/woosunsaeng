-- 우선생 인터넷 요금 검수 2차 안전 보정
-- Supabase SQL Editor에 이 파일의 전체 내용을 붙여넣고 실행하세요.
-- 조회문 없이 UPDATE 문만 포함되어 있어 반복 실행해도 안전합니다.

update public.internet_carriers
set equipment_note = '기가지니A 기준 · 설치비 별도',
    price_verified_at = '2026.07.18',
    updated_at = now()
where id = 'KT';

update public.internet_carriers
set price_verified_at = '2026.07.18',
    updated_at = now()
where id in ('LG U+', 'SK');

update public.internet_carriers
set label = 'B tv pop',
    updated_at = now()
where id = 'SKB';

update public.internet_tv_plans
set channels = 217,
    updated_at = now()
where carrier_id = 'LG U+'
  and id = 'lg-tv-value';

update public.internet_tv_plans
set channels = 223,
    updated_at = now()
where carrier_id = 'LG U+'
  and id = 'lg-tv-basic';

update public.internet_tv_plans
set channels = 252,
    updated_at = now()
where carrier_id = 'LG U+'
  and id = 'lg-tv-premium';

update public.internet_tv_plans
set channels = 257,
    updated_at = now()
where carrier_id = 'LG U+'
  and id in ('lg-tv-disney', 'lg-tv-netflix');

update public.internet_tv_plans
set monthly_price = 25900,
    channels = 250,
    description = '모든G와 디즈니+ 결합',
    updated_at = now()
where carrier_id = 'KT'
  and id = 'kt-tv-disney-allg';

update public.internet_bundle_rules
set bundle_monthly_price = case speed
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
