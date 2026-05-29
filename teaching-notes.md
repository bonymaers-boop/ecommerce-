# MAISON Frontend — Tutor Notes (2026-03-29)

Use these notes to walk students through the project from markup to styling to the vanilla-JS logic that powers both the storefront and the admin dashboard.

## 0) High-Level Architecture
- Static HTML entry points: `e-commerce/FRONTEND/index.html` (storefront SPA shell) and `e-commerce/FRONTEND/admin.html` (admin shell).
- Styling: `e-commerce/FRONTEND/styles.css` for the public site + shared tokens; `e-commerce/FRONTEND/admin.css` extends those tokens for dashboard UI.
- Data + persistence: `e-commerce/FRONTEND/store-data.js` seeds products, orders, reviews into `localStorage` and exposes getters/setters globally.
- Behavior: `e-commerce/FRONTEND/app.js` renders the storefront as a single-page experience; `e-commerce/FRONTEND/admin.js` powers admin CRUD against the same `localStorage`.
- No build step or backend; everything runs in-browser.

## 1) HTML Walkthrough
- **index.html**
  - Top bar + sticky header with desktop nav, icon buttons, and a toggled search bar.
  - Mobile drawer (`#mobileNav`) opened by the burger button and closed via overlay/button.
  - `<main id="app"></main>` is the SPA mount; all pages are injected here by `render()` in `app.js`.
  - Footer includes social links (SVG icons), newsletter form, and legal links.
  - Scripts loaded at the end: `store-data.js` (data layer) then `app.js` (render + logic).
- **admin.html**
  - Two-column shell: sidebar navigation and main content area (`#adminApp`).
  - Reuses theme fonts + tokens from `styles.css`, then overrides via `admin.css`.
  - Toast (`#adminToast`) and modal scaffold (`#adminModalOverlay`) are pre-defined; `admin.js` fills bodies dynamically.

## 2) Styling System
- **Design tokens**: declared in `:root` (`styles.css`) — background, text, accent, border, radius, etc. Teach students how changing tokens cascades through components.
- **Global reset**: universal box-sizing, margin/padding reset, smooth scroll.
- **Component blocks** (key selectors to show):
  - Header/nav: `.header`, `.nav-desktop`, `.icon-btn`, `.badge`, mobile `.mobile-nav-overlay`.
  - Hero + carousel: `.hero`, `.hero-slide`, `.hero-dot`, `.hero-arrows`.
  - Product grid/cards: `.product-grid`, `.product-card`, `.product-badges`, `.product-price`, `.product-rating`.
  - Layouts: `.section`, `.shop-layout`, `.cart-layout`, `.checkout-layout`, `.account-layout`.
  - Reviews: `.review-grid`, `.review-summary`, `.rating-bar`, `.review-card`.
  - Checkout + cart controls: `.qty-control`, `.delivery-option`, `.checkout-step`.
  - Toast: `.toast.show` transition.
- **Responsive strategy**: Two breakpoints (max-width 1024px and 768px, then 480px) collapse grids, hide desktop nav, open filter drawer, adjust hero height.
- **Admin styling** (`admin.css`):
  - Sidebar + nav pills: `.admin-sidebar`, `.admin-nav-item.active`.
  - Metrics cards/grids: `.admin-grid-4`, `.admin-metric-label/value`.
  - Tables: `.admin-table`, `.admin-thumb`, `.admin-chip` status colors.
  - Modal/form system: `.admin-modal`, `.admin-form`, `.admin-image-picker` (local previews).

## 3) Data Layer (`store-data.js`)
- Seeds `localStorage` keys `maison_products`, `maison_orders`, `maison_reviews` if missing.
- **Normalization helpers**: `normalizeProduct`, `parseColors`, `parseSizes`, `parseNumber` keep data consistent (e.g., recomputes discounts, fills default images, clamps stock).
- **Public API (globals)**:
  - Products: `getProducts`, `setProducts`, `upsertProduct(product)`, `deleteProduct(id)`.
  - Orders: `getOrders`, `setOrders`, `createOrder(order)`, `updateOrderStatus(orderNum, nextStatus)`.
  - Reviews: `getReviews(productId)`, `addReview(review)`, `getCustomerSummaries()`, `hasDeliveredPurchase(productId, email)`.
- Shared `maisonCategories` array is also exposed for dropdowns.
- Teaching angle: show how both storefront and admin call the same functions to stay in sync without a backend.

## 4) Storefront Logic (`app.js`)
- **State**: `products` from `getProducts()`, `cart`, `wishlist`, `currentPage`, `shopFilter`, hero slider state, review UI state.
- **Persistence & cross-tab sync**:
  - `saveState()` writes cart/wishlist to `localStorage`; `syncProductsAndCart()` prunes invalid items after admin edits.
  - `window.addEventListener('storage', ...)` rerenders when another tab updates products.
- **Navigation**: `navigate(page, filter)` updates `currentPage` and triggers `render()`. Mobile nav + search toggles are simple DOM show/hide.
- **Hero carousel**: `goSlide(i)` updates slides/dots/text; auto-advances every 5s when on home.
- **Rendering pipeline**:
  - `render()` decides which page renderer to call, injects HTML into `#app`, restarts hero interval, and updates badges.
  - Page-specific renderers:
    - `renderHome()` builds hero, categories, featured/new/best grids, promo banner, newsletter.
    - `renderShop()` filters by category/search/sale; brand filter checkboxes call `filterByBrand`. Sort dropdown calls `sortProducts`.
    - `renderProductDetail()` shows gallery, swatches (`selectColor`), sizes (`selectSize`), quantity controls, stock badge, related items, and embeds `renderReviewsSection`.
    - `renderCart()` shows line items with qty controls (`updateCartQty`), subtotal/shipping, coupon stub, checkout CTA.
    - `renderCheckout()` is a 4-step wizard controlled by `checkoutStep(step)`, collecting shipping → delivery → payment (M-Pesa demo) → review. `placeOrder()` decrements stock, writes an order via `createOrder`, and shows confirmation.
    - `renderWishlist()` and `renderAccount()` are simpler grids/forms; account buttons currently just toast “connect backend”.
- **Cart & wishlist mechanics**:
  - `addToCart(productId, size, color, qty)` enforces stock, merges same variant, shows toast.
  - `toggleWishlist(id)` and badge updates mirror cart behavior.
- **Reviews**:
  - `renderReviewsSection(p)` pulls stored reviews, draws rating distribution, limits to 3 unless toggled.
  - `submitReview(productId)` enforces email + rating + delivered-order check via `hasDeliveredPurchase`, then `addReview`.
- **Utilities**: `stars()`, `formatDateShort()`, `escapeHtml()`, `showToast()`, `applyCoupon()`, `startMpesaStub()` (UI-only).

## 5) Admin Dashboard Logic (`admin.js`)
- IIFE keeps scope clean; exposes only required globals (`navigateAdmin`, `signOut`, order/product modal actions).
- **Navigation + titles**: `syncAdminNavActive()` updates sidebar selection and page titles/subtitles.
- **Render entry**: `renderAdmin()` fetches `products` and `orders`, then dispatches to:
  - `renderDashboard()` — revenue/orders/products/customers metrics, recent orders list, low/out-of-stock alerts.
  - `renderOrders()` — sortable table; actions from `renderOrderActions()` promote status (pending → confirmed → shipped → delivered). Status updates call `updateOrderStatus` from data layer.
  - `renderProducts()` — CRUD table with stock chips; buttons open modals or delete.
  - `renderCustomers()` — uses `getCustomerSummaries()` (rollup from orders).
- **Order modal**: `openOrderModal(orderNum)` shows items, customer info, totals inside the shared modal shell (`openModal`).
- **Product modal & saving**:
  - `openAddProductModal()` vs `openProductModal(id)` set mode and populate form.
  - Inputs captured and validated in `saveProductFromModal()`, then `upsertProduct(payload)` writes through `store-data.js`; images can be mixed from URLs + uploaded Data URLs (kept in `localStorage`).
  - `deleteProductModal(id)` confirms, then `deleteProduct` prunes product and related cart/wishlist entries.
- **Image picker teaching point**: `FileReader` to Data URL, previews shown via `pendingImageDataUrls` and `productModalBaseImages`.

## 6) Suggested Teaching Flow
1. **Scaffold tour (HTML)**: Show how `#app` is the only changing region; demonstrate toggling mobile nav/search.
2. **Design tokens → components**: Change `--accent` or `--radius` live and observe effects on product cards and admin chips.
3. **Data seed + persistence**: Clear `localStorage` in DevTools, reload to see seeding; edit a product in admin and watch storefront update (storage event).
4. **Rendering cycle**: Set breakpoints in `render()` and `renderShop()` to trace page generation and state-driven filtering.
5. **Cart/stock guardrails**: Add more items than stock allows to see `addToCart` clamp behavior; place an order to watch stock decrement and order creation.
6. **Reviews gating**: Try submitting a review with/without a delivered order email to illustrate business rule enforcement.
7. **Checkout wizard**: Walk through `checkoutStep` DOM replacement pattern; discuss pros/cons vs router libs.
8. **Admin CRUD**: Add a new product with uploaded image, mark as Featured/New Arrival, then verify it appears on home sections.

## 7) Extension Ideas for Students
- Swap `localStorage` for a lightweight backend (e.g., Firebase or Supabase); replace `showToast` placeholders for auth/payment.
- Replace inline HTML strings with template literals -> small component functions; or migrate to a framework to compare patterns.
- Add form validation and error states (checkout + admin product modal).
- Introduce pagination or search highlighting in `renderShop`.
- Implement real discount application and order totals derived from cart contents instead of static demo items in `store-data.js`.

## 8) Quick File Map
- Markup: `index.html`, `admin.html`
- Styling: `styles.css`, `admin.css`
- Data layer: `store-data.js`
- Storefront behavior: `app.js`
- Admin behavior: `admin.js`

Use these notes as a lecture spine; demo frequently from DevTools so students see how state, DOM, and storage stay in sync without a backend.
