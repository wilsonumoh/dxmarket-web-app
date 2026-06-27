# DXMARKET Enterprise Multi-Vendor Marketplace Platform
## Comprehensive Backend Architecture, Database Schema, & Namecheap Node.js Deployment Guide

This document specifies the database relationships, firestore collection schemas, security architectures, REST API routes, and cPanel/Namecheap hosting production instructions for the enterprise-grade **DXMARKET** ecosystem.

---

## 1. FIRESTORE DATABASE SCHEMA (34 COLLECTIONS)

Below is the structured data schema for the 34 critical collections required by the enterprise DXMARKET multi-vendor logistics engine.

### Collection: `users`
*   `uid` (string, Document ID): Unique system authentication identifier.
*   `email` (string): Primary communication email.
*   `displayName` (string): Full name of the user.
*   `role` (string): RBAC role (`superadmin`, `admin`, `regional_manager`, `merchant`, `merchant_staff`, `supplier`, `salesperson`, `customer`, `delivery_agent`, `support_agent`).
*   `status` (string): (`active`, `suspended`, `pending_verification`).
*   `storeId` (string, optional): Foreign link to `stores` if merchant or staff.
*   `mfaEnabled` (boolean): Two-Factor status.
*   `joinedDate` (timestamp): Date of initial registration.

### Collection: `roles`
*   `id` (string): Unique role identifier.
*   `name` (string): Readable role title.
*   `permissions` (array of strings): Linked capability nodes (e.g. `['create:product', 'approve:merchant']`).

### Collection: `permissions`
*   `id` (string): Unique authorization node.
*   `module` (string): Target department (e.g., `inventory`, `payments`, `compliance`).
*   `action` (string): Allowed operations (`create`, `read`, `update`, `delete`, `approve`, `reject`, `suspend`, `restore`).

### Collection: `products`
*   `id` (string): Document ID.
*   `title` (string): Product catalog name.
*   `price` (number): Active sales price.
*   `originalPrice` (number): Manufacturer suggested retail price (MSRP).
*   `description` (string): Comprehensive marketing overview.
*   `category` (string): Parent classification link.
*   `brand` (string): Creator/manufacturer identification.
*   `image` (string): Hero banner preview URL.
*   `gallery` (array of strings): High-definition auxiliary preview images.
*   `specifications` (map): Key-value technical specifications.
*   `variants` (array of maps): Options like Size, Color, etc.
*   `stock` (number): Active physical stock count.
*   `merchantId` (string): Linked storefront developer.
*   `isApproved` (boolean): Compliance status.
*   `isFeatured` (boolean): Promotion placement flag.
*   `seoTags` (map): Metadescription and keywords.

### Collection: `categories`
*   `id` (string): Category slug.
*   `name` (string): Friendly display title.
*   `icon` (string): Lucide-react identifier.
*   `parentCategory` (string, nullable): Parent mapping for multi-tiered catalog hierarchies.

### Collection: `brands`
*   `id` (string): Brand slug.
*   `name` (string): Official trademark name.
*   `logoUrl` (string): Logo asset.

### Collection: `stores` & `merchants`
*   `id` (string): Store identification code.
*   `name` (string): Storefront trade name.
*   `ownerId` (string): Link to `users.uid`.
*   `isApproved` (boolean): Registry certification compliance.
*   `balance` (number): Active wallet escrow balance.
*   `joinedDate` (string): Onboarding verification date.

### Collection: `suppliers`
*   `id` (string): Supplier UID.
*   `name` (string): Supply enterprise name.
*   `supplyCategory` (string): Factory products focus.
*   `status` (string): (`Approved`, `Pending`, `Suspended`).

### Collection: `orders` & `order_items`
*   `id` (string): Unique order reference.
*   `customerId` (string): Link to purchasing buyer profile.
*   `items` (array of maps): Sub-records mapping `productId`, `quantity`, `price`, and selected variants.
*   `total` (number): Financial gross total.
*   `status` (string): (`Pending`, `Paid`, `Shipped`, `Delivered`, `Cancelled`).
*   `escrowLocked` (boolean): Funds protection flag.

### Collection: `payments` & `transactions`
*   `id` (string): Receipt reference code.
*   `orderId` (string): Link to source contract order.
*   `amount` (number): Settled gross ledger total.
*   `gateway` (string): Integration endpoint (`Stripe`, `Paystack`, `Flutterwave`, `PayPal`).
*   `status` (string): (`Success`, `Escrow_Held`, `Released`, `Refunded`).

### Collection: `wallets`
*   `id` (string): Wallet identifier.
*   `ownerId` (string): Owner user UID or merchant storefront code.
*   `balance` (number): Available withdrawable funds.
*   `ledgerCurrency` (string): Native settlement standard (e.g. `USD`, `NGN`, `EUR`).

---

## 2. RELATIONSHIP ENTITY DIAGRAM (TEXTUAL)

```
 [Users] (1) ------ (1) [Wallets]
    |
    +--- (1) [Stores] (1) --- (N) [Products] (1) --- (N) [Inventory]
    |       |                     |
    |       +--- (N) [Coupons]    +--- (N) [Reviews]
    |
 [Customers] (1) --- (N) [Orders] (1) --- (N) [Order_Items]
                            |
                            +--- (1) [Payments] (1) --- (1) [Escrow]
                            |
                            +--- (1) [Shipments] (1) --- (N) [Stock_Movements]
```

---

## 3. SECURITY DESIGN RULES

For secure production execution, deploy the verified `firestore.rules` file containing RBAC queries. This restricts user documents strictly to authorized sessions and requires `superadmin` or `admin` claims for modifying the core system configuration parameters.

---

## 4. REST API ROUTES DOCUMENTATION

The Express server (`server.ts`) includes production ready endpoints designed to route cross-border logistics traffic:

| Route Path | Method | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | Returns system metrics, database links, and latency stats. |
| `/api/auth/login` | POST | Public | Validates credentials, sets user session, and issues a dummy JWT. |
| `/api/auth/verify-otp` | POST | Public/User | Confirms multi-factor OTP codes for 2FA validation. |
| `/api/products` | GET | Public | Searches and filters the multi-vendor catalogue. |
| `/api/products` | POST | Merchant/Admin | Publishes new physical/digital goods to the catalog. |
| `/api/orders` | POST | Customer | Places checkout order, binds funds to escrow locks automatically. |
| `/api/payments/webhook` | POST | Gateways | Secure callback webhook to reconcile Stripe/Paystack payments. |
| `/api/ai/recommendations` | POST | Customer | Generates semantic product recommendations via Gemini API. |
| `/api/ai/search` | GET | Public | Refines user query strings with semantic relevance via Gemini. |

---

## 5. NAMECHEAP / CPANEL DEPLOYMENT RUNBOOK

### Step 1: Create the Node.js Application in cPanel
1. Log in to your Namecheap cPanel account.
2. Search for **Setup Node.js App** in the software section and click it.
3. Click the **Create Application** button.
4. Select the Node.js Version: **20.x or 22.x** is recommended.
5. Set Application Mode: **Production**.
6. Set Application Root: `dxmarket` (the subdirectory where your files reside).
7. Set Application URL: Enter your domain or subdomain (e.g., `dxmarket.com`).
8. Application Startup File: Set to `dist/server.cjs` (our compiled esbuild server file).
9. Click **Create** to launch the application virtual environment.

### Step 2: Build the Production Bundle
DXMARKET uses Vite to build the React application and `esbuild` to compile the Express TS server into a single standalone file. Run the build script in the terminal:
```bash
npm run build
```
This script runs:
1. `vite build` — producing client bundle in `dist/`.
2. `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` — generating the standalone server bundle.

### Step 3: Copy Files and Install Dependencies
Upload the following files to your Namecheap `dxmarket` app root folder using cPanel File Manager:
- `dist/` (contains client and server.cjs)
- `package.json`
- `firebase-applet-config.json`
- `.env` (your production secrets)

Click the **Run JS Build** and **npm install** buttons inside the cPanel Node.js app interface to install the dependencies in production.

### Step 4: PM2 Integration (Optional Automation)
If your Namecheap hosting includes SSH command access, launch your server with PM2 to ensure auto-restart on system updates:
```bash
pm2 start dist/server.cjs --name "dxmarket-prod"
pm2 save
```
