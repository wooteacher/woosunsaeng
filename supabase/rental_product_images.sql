-- 우선생 렌탈 상품 이미지 Storage 설정
-- Supabase SQL Editor에서 이 파일의 SQL 전체를 한 번 실행하세요.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'rental-product-images',
  'rental-product-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view rental product images" on storage.objects;
create policy "Public can view rental product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'rental-product-images');
