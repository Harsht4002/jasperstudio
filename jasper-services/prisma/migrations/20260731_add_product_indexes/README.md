Migration: add indexes to products

This migration adds an index on slug and keeps existing indexes on categoryId and status.

Run:
  pnpm --filter jasper-services run db:migrate

Note: For production, consider adding trigram or full-text indexes for the `name` and `description` columns depending on DB support.