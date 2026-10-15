# Backend Audit & Implementation Report — Bharat Bazaar
Updated: 2026-10-15

## 1. Architecture

**Stack**: Next.js 16.2.12 (Turbopack), React 19, TypeScript strict, Supabase (PostgreSQL 14.5), Zustand 5, Tailwind CSS 4, Zod 3.x

**Supabase clients**: client.ts (browser), server.ts (RSC), action.ts (server actions), admin.ts (service role, server-only)

**52 migrations applied** (including `20260911000011_dashboard_stats_rpc.sql` and `20260911000012_storage_buckets.sql`)

**Key tables**: profiles, roles, user_roles, sellers, seller_documents, bank_accounts, shops, categories, products, product_variants, product_images, inventory, carts, cart_items, orders, order_items, payments, refunds, returns, reviews, coupons, coupon_usages, commissions, settlements, delivery_partners, delivery_assignments, addresses, platform_settings, audit_logs, admin_audit_logs, notifications, sa_admins, sa_panel_access_grants, sa_trusted_devices

**Key RPCs**: create_order_from_cart, process_eligible_settlements, handle_new_user (auth trigger), get_dashboard_stats

---

## 2. Security & Role Authorization Fixes (Completed)

| Issue | Status | Resolution |
|---|---|---|
| **S1**: `requireRole()` reading from untrusted `user_metadata` | **FIXED** | Rewrote `src/actions/auth/session.ts` to query database `user_roles` joined with `roles` table. Implemented role hierarchy verification, alias normalization (`user`<->`customer`, `super admin`<->`super_admin`), and token verification via `getUser()`. |
| **S2**: Checkout placed mock client-side order | **FIXED** | Rewrote checkout flow in `src/app/(storefront)/checkout/page.tsx` to authenticate customer, synchronize cart to database, persist address to `addresses` table, call `create_order_from_cart` RPC via `createOrder()`, process payment, and return verified order ID. |
| **S3 / D7**: `processPayment` trusted client-submitted amount | **FIXED** | Updated `src/actions/payments/actions.ts` to fetch and verify the order from the database, compare and enforce the database `total_amount`, correctly map payment table columns (`amount`, `currency`, `gateway`, `order_id`, `status`), and support Cash on Delivery (COD) as pending payment. |
| **S4**: `updateSellerKycStatus` and `getPendingKycSellers` had no admin guard | **FIXED** | Added `requireRole(['super admin', 'admin'])` authorization guard in `src/actions/super-admin/kyc.ts` before creating or executing admin client operations. |
| **S5**: `updateOrderStatus` had no ownership check | **FIXED** | Updated `src/actions/orders/actions.ts` so sellers can only query and update order items for products they own, and customers cannot arbitrarily alter order states. |

---

## 3. Data Integrity & Wiring (Completed)

| Issue | Status | Resolution |
|---|---|---|
| **D1 & N2**: Cart actions used wrong table schema | **FIXED** | Updated `src/actions/cart/actions.ts` to properly resolve `carts` by `user_id` and relate `cart_items` through `cart_id`. Added `syncCartItems` server action for synchronizing items prior to checkout. |
| **D6**: Seller orders query unimplemented | **FIXED** | Implemented seller-specific order queries in `getOrders()` by resolving seller ID via `user.id`, filtering `order_items` by `seller_id`, and scoping returned orders to the seller's catalog. |
| **N4**: Customer addresses not persisted | **FIXED** | Created `src/actions/address/validations.ts` and `src/actions/address/actions.ts` (`createAddress`, `getAddresses`, `deleteAddress`) and wired into checkout page. |
| **A3**: Storage buckets missing from migrations | **FIXED** | Added `supabase/migrations/20260911000012_storage_buckets.sql` provisioning `product-images`, `avatars`, and `seller-documents` with RLS policies. |
| **A4**: `get_dashboard_stats` RPC missing | **FIXED** | Added `supabase/migrations/20260911000011_dashboard_stats_rpc.sql` calculating GMV, active sellers, pending KYC, and active orders. |
| **Scripts**: `npm run seed` missing script file | **FIXED** | Created `scripts/seed.ts` connecting via Supabase service role key and seeding initial roles and artisan categories. |

---

## 4. Verification

- `npm run typecheck`: **PASSED** (0 errors)
- `npm run build`: **PASSED** (86 static & dynamic pages successfully generated with Turbopack)
