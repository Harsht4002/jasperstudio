# 🛍️ Jasper Studio — Full-Stack E-Commerce Platform

Jasper Studio is an e-commerce platform built as a clean multi-project monorepo. It features a responsive customer-facing storefront, an isolated administration portal, and a RESTful backend microservice.

---

## 🏗️ Repository Architecture

The codebase is organized into two primary applications:

```text
jasper/
├── jasper-frontend/      # Customer storefront & Admin Portal (Next.js 15, React 19, Tailwind CSS)
├── jasper-services/      # RESTful Backend Microservices (NestJS, Prisma ORM, Supabase, Stripe)
└── README.md             # Project documentation
```

### Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/).
- **Backend**: [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), [Prisma ORM](https://www.prisma.io/).
- **Database & Storage**: [PostgreSQL on Supabase](https://supabase.com/), Supabase Object Storage (`product-images` bucket).
- **Payment Processing**: [Stripe Checkout API](https://stripe.com/) & Webhook Handler.
- **Authentication**: JWT Access & Refresh Token strategy with Bcrypt hashing via Passport.js.

---

## ✨ Features

### 🛒 Customer Storefront
- **Home & Brand Landing Page**: Hero section, featured categories, hand-picked featured products, and artisan story.
- **Interactive Catalog**: Search by keyword (name & description), category filtering, price range filter (`minPrice`/`maxPrice`), sorting (newest, price asc/desc), and pagination.
- **Product Details & Variant Selector**: Rich product detail pages with variant-specific price adjustments and stock verification.
- **Tokenized Guest Cart**: Guest cart sessions persisted via `X-Cart-Token` headers and local storage (`jasper.cartToken`).
- **Stripe Checkout & Order Processing**: Instant Stripe checkout session creation with standard shipping calculations, webhook signature verification, atomic database transactions for order creation, stock decrements, inventory logging, and guest cart clearing.

### 🔐 Admin Management Portal (`/admin`)
- **Single-Owner Bootstrapping**: First admin registers as `OWNER`. Once an active admin exists, public registration automatically locks (`409 Conflict`).
- **Secure Authentication**: Dual JWT tokens (Access + Refresh) with hashed refresh token storage in PostgreSQL and silent automatic token refresh on 401 client errors.
- **Catalog CMS**: Full CRUD for products, variants, and image uploads using Supabase Storage signed URLs (`/storage/signed-upload-url`).
- **Category CMS**: Display order sorting, active status toggling, and slug management.
- **Fulfillment Dashboard**: Order listing, status transitions (`PENDING_PAYMENT` ➔ `PAID` ➔ `READY_FOR_PICKUP` ➔ `COLLECTED`, `CANCELLED`, `REFUNDED`), and stock movement logs (`ORDER_PAID`, `MANUAL_ADJUSTMENT`, `REFUND_RESTOCK`).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ or v20+
- **npm**: v9+
- **PostgreSQL Database** (e.g., Supabase instance)
- **Stripe Account** (for API keys & Webhook secret)

---

### 1. Environment Setup

#### Backend Environment (`jasper-services/.env`)

Copy `jasper-services/.env.example` to `jasper-services/.env` and update the values:

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000

# PostgreSQL / Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SUPABASE-SERVICE-ROLE-KEY]"
SUPABASE_PRODUCT_IMAGES_BUCKET="product-images"

# Authentication Secrets
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

# Stripe Credentials
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Frontend Environment (`jasper-frontend/.env.local`)

Create `jasper-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 2. Database Migration & Seeding

Navigate to `jasper-services` and run Prisma database migrations:

```bash
cd jasper-services

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed initial categories & sample products
npm run db:seed
```

---

### 3. Running Locally

#### Start the Backend API Server

```bash
cd jasper-services
npm run start:dev
```

The NestJS API will start on `http://localhost:3001`.

#### Start the Frontend Storefront & Admin App

```bash
cd jasper-frontend
npm install
npm run dev
```

The Next.js storefront will be available at `http://localhost:3000`.

---

## 📌 Key API Endpoints Reference

### Public API
| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/products` | List published products (supports `page`, `limit`, `search`, `categorySlug`, `minPrice`, `maxPrice`, `sortBy`) |
| `GET` | `/products/:slug` | Get single product by slug with variants and images |
| `GET` | `/categories` | List active categories |
| `GET` | `/cart` | Fetch guest cart by `X-Cart-Token` |
| `POST` | `/cart/items` | Add item to cart |
| `PATCH` | `/cart/items/:id` | Update cart item quantity |
| `DELETE` | `/cart/items/:id` | Remove item from cart |
| `POST` | `/checkout/session` | Create Stripe Checkout payment session |
| `POST` | `/payments/webhook` | Stripe payment completion webhook handler |

### Admin API (`Bearer <token>` required)
| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/admin/auth/login` | Admin login |
| `POST` | `/admin/auth/register` | Initial admin registration (locked after 1 admin exists) |
| `POST` | `/admin/auth/refresh` | Refresh JWT access token |
| `GET` | `/admin/products` | Admin product management list |
| `POST` | `/admin/products` | Create product |
| `PATCH` | `/admin/products/:id` | Update product |
| `DELETE` | `/admin/products/:id` | Delete product |
| `GET` | `/admin/orders` | List customer orders |
| `PATCH` | `/admin/orders/:id/status` | Update order fulfillment status |
| `POST` | `/storage/signed-upload-url` | Generate pre-signed Supabase image upload URL |

---

## 🧪 Testing & Building

### Backend Tests & Verification

```bash
cd jasper-services

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Build production bundle
npm run build
```

### Frontend Typecheck & Build

```bash
cd jasper-frontend

# Typecheck TypeScript files
npm run typecheck

# Build Next.js production app
npm run build
```

---

## 📜 Documentation & Reports

- **[Architecture & Scalability Audit Report](file:///C:/Users/Harshu/.gemini/antigravity/brain/624b9eea-9adb-4ba2-b8dd-c7da5d6a30de/jasper_architecture_and_scalability_report.md)**: In-depth analysis of system guards, tech debt, and scaling strategies.
- **[Component API Map](file:///e:/jasper/jasper-frontend/docs/component-api-map.md)**: Storefront UI component to API endpoint mapping.
- **[Supabase Setup Guide](file:///e:/jasper/jasper-services/docs/supabase-setup.md)**: Guide for setting up PostgreSQL tables and storage bucket policies.

---

## 📄 License

This repository is private and proprietary.
