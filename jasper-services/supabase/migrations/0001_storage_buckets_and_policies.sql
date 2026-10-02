insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Service role can insert product images"
on storage.objects for insert
with check (bucket_id = 'product-images');

create policy "Service role can update product images"
on storage.objects for update
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "Service role can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images');
