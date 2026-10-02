# Component API Map

This file records which UI pieces own backend calls today.

## Shared Layout

| Component | API | Method | When |
| --- | --- | --- | --- |
| `Navbar` | `/cart` | `GET` | On layout mount and after `jasper:cart-updated` |
| `Footer` | None | - | Static |

## Home Page

| Component | API | Method | When |
| --- | --- | --- | --- |
| `Hero` | None | - | Static |
| `FeaturedCategories` | `/categories` | `GET` | On component mount |
| `FeaturedProducts` | `/products?limit=4&sortBy=newest` | `GET` | On component mount |
| `ProductCard` | `/cart/items` | `POST` | User clicks Add To Cart |
| `ArtisanStory` | None | - | Static |

## Shop Page

| Component | API | Method | When |
| --- | --- | --- | --- |
| `ShopPage` | `/categories` | `GET` | On page mount |
| `ShopPage` | `/products` | `GET` | On page mount and filter/search/sort/page changes |
| `ProductsHero` | None | - | Static |
| `ProductsToolbar` | None | - | Emits search, category, price, and sort changes to `ShopPage` |
| `ProductGrid` | None | - | Renders state from `ShopPage` |
| `ProductCard` | `/cart/items` | `POST` | User clicks Add To Cart |
| `Pagination` | None | - | Emits page changes to `ShopPage` |

`ShopPage` maps filters to `/products` query params:

```text
page
limit
search
categorySlug
minPrice
maxPrice
sortBy
```

## Product Details Page

| Component | API | Method | When |
| --- | --- | --- | --- |
| `ProductDetailsPage` | `/products/:slug` | `GET` | On page mount |
| `ProductDetailsPage` | `/cart/items` | `POST` | User clicks Add To Cart |

The product details UI sends product-based cart requests:

```json
{
  "productId": "...",
  "quantity": 1
}
```

## Cart Token

All cart requests use `X-Cart-Token` when available. The backend exposes and returns this header, and the frontend persists it in `localStorage` under `jasper.cartToken`.

## Admin Authentication

Customer storefront pages do not use authentication. Admin authentication is isolated under `/admin`.

| Component / Layer | API | Method | When |
| --- | --- | --- | --- |
| `AdminLoginPage` | `/admin/auth/login` | `POST` | Admin submits email/password |
| `AdminAuthStore.login()` | `/admin/auth/me` | `GET` | After login succeeds, to validate and store the current admin |
| `AdminAuthProvider` | `/admin/auth/me` | `GET` | When the admin app boots with a stored access token |
| `AdminAuthStore.refresh()` | `/admin/auth/refresh` | `POST` | When a stored access token is rejected or an admin request receives `401` |
| `AdminLayout` | `/admin/auth/logout` | `POST` | Admin clicks Logout |
| `ProtectedRoute` | None | - | Reads auth store and redirects to `/admin/login` when unauthenticated |
| `adminApiRequest()` | `/admin/auth/refresh` | `POST` | Automatically refreshes and retries authenticated admin requests after `401` |

Admin tokens are stored by `admin-auth-tokens.ts`.

- `accessToken`: localStorage/sessionStorage for MVP, based on Remember Me
- `refreshToken`: localStorage/sessionStorage for MVP, based on Remember Me
- `admin`: localStorage/sessionStorage for MVP, based on Remember Me

All authenticated admin API requests send:

```text
Authorization: Bearer <accessToken>
```
