# app.js walkthrough (beginner friendly)

This file is the entire front-end logic for the fashion storefront. It builds every page in JavaScript and swaps the HTML inside `#app` instead of doing full page loads.

## Data sources
- Products come from `getProducts()` (stored in localStorage by `store-data.js`). The `initialProducts` array is only a legacy sample.
- Orders, reviews, and product updates rely on helper functions defined elsewhere: `setProducts`, `createOrder`, `getReviews`, `addReview`, `hasDeliveredPurchase`.

## State kept in memory
- `products`: current catalog from storage.
- `cart`, `wishlist`: arrays saved to localStorage keys `maison_cart` and `maison_wishlist`.
- `currentPage`: which pseudo-page to show (`home`, `shop`, `product`, `cart`, `checkout`, `wishlist`, `account`).
- `shopFilter`: current search/filter term or selected category/id.
- `currentSlide`, `heroInterval`: hero carousel position and timer.
- Checkout form fields and review UI toggles (`reviewExpanded`, `reviewSelections`).

## Navigation and rendering flow
1) `navigate(page, filter)` updates `currentPage` and optional filter, scrolls to top, then calls `render()`.
2) `render()` decides which page builder to run (home/shop/product/cart/checkout/wishlist/account), injects the returned HTML into `#app`, and restarts the hero autoplay when on the home page.
3) On load, a single `render()` bootstraps the app.

## Home page
- Built by `renderHome()`: hero slider, category tiles, featured products, promo banner, new arrivals, best sellers, and a newsletter form.
- Hero slides advance every 5 seconds via `goSlide()`; dots and arrows also call `goSlide()`.

## Shop (product listing)
- `renderShop()` filters products by category, sale status, or text search stored in `shopFilter`.
- Sidebar checkboxes call `navigate()` to apply filters; brand checkboxes use `filterByBrand()`.
- Sorting dropdown triggers `sortProducts()` (price, rating, newest) and rewrites the grid.
- Each product card is produced by `productCardHTML()`, which shows badges, price (with struck-out original on sale), stars, and wishlist heart.

## Product detail
- `renderProductDetail()` finds the product whose id equals `shopFilter`.
- Gallery thumbnails call `changePdImg()`; color swatches and size buttons toggle an `active` class.
- Quantity control uses `changeQty()`; add-to-cart uses `addToCartFromDetail()` which forwards size/color/qty into `addToCart()`.
- Shows related items from the same category and a full reviews section.

## Cart and wishlist
- `addToCart(productId, size, color, qty)` validates stock, defaults first size/color, caps by remaining stock, merges identical line items, saves to localStorage, and toasts success/failure.
- Cart page (`renderCart()`) lists items, qty +/- buttons (`updateCartQty()`), remove buttons (`removeFromCart()`), and order summary (free shipping over 200, else 15). Coupon handling is placeholder only.
- Wishlist is toggled by `toggleWishlist(id)` and rendered by `renderWishlist()`.

## Reviews
- `renderReviewsSection(p)` pulls reviews via `getReviews()`, shows an average, distribution bars, and a short list (first 3 unless expanded).
- `submitReview()` validates name/email/message/rating and checks `hasDeliveredPurchase()` before saving with `addReview()`. Success resets selection and re-renders.

## Checkout flow
- Four steps inside one container (`renderCheckout()` + `checkoutStep()`): Shipping -> Delivery method -> Payment (card fields + M-Pesa placeholder) -> Review.
- `selectDelivery()` saves chosen method and price; totals include it.
- `placeOrder()` re-syncs data, blocks out-of-stock, decrements product stock, writes updates with `setProducts()`, creates an order via `createOrder()`, clears cart, and shows a thank-you screen with an order number (`MSN-` + timestamp tail).

## Utility helpers
- `showToast(msg)`: brief notification.
- `updateBadges()`: updates cart and wishlist counts in the header.
- Formatting helpers: `stars()`, `formatDateShort()`, `escapeHtml()`.
- `syncProductsAndCart()`: refreshes product list and cleans cart/wishlist if products were removed by an admin (also wired to the `storage` event).

## Lifecycle summary
- LocalStorage is the single source of truth for catalog, cart, and wishlist.
- UI is regenerated on every navigation or state change by rebuilding HTML strings and replacing `#app`.
- Hero autoplay is restarted whenever the home page is rendered.
