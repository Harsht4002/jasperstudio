# Supabase Setup

This backend uses Supabase in two ways:

- Supabase Postgres stores products, categories, carts, orders, payments, and admin users through Prisma.
- Supabase Storage stores public product images in the `product-images` bucket.

## 1. Backend Environment

Fill in `jasper-services/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-SUPABASE-DB-PASSWORD]@db.zicgakdjxfmdtvitjmok.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

Find these in Supabase:

- Database password: Project Settings -> Database -> Connection string.
- Service-role key: Project Settings -> API -> Project API keys.

Keep the service-role key server-side only. Do not add it to the frontend.

## 2. Create Database Tables

After `DATABASE_URL` is valid:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

The initial migration is in:

```text
prisma/migrations/20260730002000_init/migration.sql
```

It creates the full MVP commerce/admin schema:

| Table | Purpose |
| --- | --- |
| `categories` | Public category browsing and admin category management. |
| `products` | Product catalog records, pricing, publishing status, and category assignment. |
| `product_variants` | Sellable product units with SKU/options, price adjustments, stock, and cart/order links. |
| `product_images` | Product image metadata and Supabase Storage paths/URLs. |
| `carts` | Anonymous cart sessions tracked by cart token. |
| `cart_items` | Cart line items tied to product variants and price snapshots. |
| `orders` | Checkout orders, customer contact, order status, totals, Stripe payment intent, and `order_number`. |
| `order_items` | Immutable product/variant line snapshots for each order. |
| `payments` | Stripe payment records and payment state. |
| `inventory_logs` | Stock movement history for paid orders and future manual/refund adjustments. |
| `admin_users` | Admin login/register users, roles, active flag, and refresh-token hash. |

## 3. Create Storage Bucket And Policies

Run this SQL in Supabase SQL Editor:

```text
supabase/migrations/0001_storage_buckets_and_policies.sql
```

It creates/updates the public `product-images` bucket and policies used by the backend signed upload flow.

## 4. Run The App

Backend:

```bash
cd jasper-services
npm run start:dev
```

Frontend:

```bash
cd jasper-frontend
npm run dev
```

Open:

```text
http://localhost:3000/admin/login
```

The first admin can register from the admin page. After one active admin exists, public admin registration closes.
