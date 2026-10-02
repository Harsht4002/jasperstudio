# Storage Conventions

Supabase is used for product images only. Business data lives in Supabase
Postgres and is accessed by Prisma through `DATABASE_URL`.

## Bucket

- `product-images`: public read, admin write through the backend service role.

## Paths

Product images are written as:

```text
products/YYYY-MM-DD/{uuid}-{safe-file-name}
```

The backend stores both the storage `path` and public `url` on `product_images`.
Clients should render image URLs from the API response and should not write
directly to Supabase.
