# Implemented UI Flow Analysis

This document analyzes the storefront and admin dashboard strictly from the implemented HTML/CSS/JavaScript in:

- `e-commerce/FRONTEND/index.html`
- `e-commerce/FRONTEND/app.js`
- `e-commerce/FRONTEND/admin.html`
- `e-commerce/FRONTEND/admin.js`
- `e-commerce/FRONTEND/store-data.js`

It does not describe an ideal backend. It describes the behavior the current UI actually implies or enforces.

## Global System Model

Before the individual flows, the current system behavior is shaped by these shared rules:

- Storefront and admin share the same browser-side data source: `localStorage`.
- Product catalog is stored under `maison_products`.
- Orders are stored under `maison_orders`.
- Reviews are stored under `maison_reviews`.
- Storefront cart is stored under `maison_cart`.
- Storefront wishlist is stored under `maison_wishlist`.
- Admin auth state is stored under `maison_admin_token`.
- `store-data.js` seeds products, orders, and reviews if the keys do not already exist.
- There is no real backend API, no user session for customers, and no persisted customer login state.
- The storefront is a single-page app controlled by `navigate(page, filter)` and `render()`.
- Admin and storefront synchronize product changes through shared `localStorage`; storefront also listens to the `storage` event and re-renders when `maison_products` changes in another tab.

## Flow 1: Customer Registration / Login

### What is actually implemented

- Customer auth UI exists on the `Account` page only.
- No real login, signup, session creation, or profile persistence happens.
- Buttons only show toast messages.

### Step-by-step breakdown

#### Step 1: User opens account screen

- User action:
  - Clicks the account icon in the storefront header.
  - This calls `navigate('account')`.
- System response:
  - `currentPage` becomes `account`.
  - `render()` replaces `#app` with `renderAccount()`.
  - Default visible tab is `Sign In`.
- Data read:
  - No account/user record is read.
- Data created:
  - None.
- Data updated:
  - In-memory `currentPage`.
- Data deleted:
  - None.

#### Step 2: User switches between Sign In and Sign Up

- User action:
  - Clicks `Sign In` or `Sign Up` tab.
- System response:
  - `switchAuthTab(el, type)` swaps the HTML inside `#authContent`.
  - For signup, fields shown are full name, email, password.
  - For login, fields shown are email, password.
- Data read:
  - DOM tab state.
- Data created:
  - New form DOM nodes only.
- Data updated:
  - Active tab CSS classes.
  - Inner HTML of `#authContent`.
- Data deleted:
  - Previous form DOM is replaced.

#### Step 3: User submits login or signup

- User action:
  - Clicks `Sign In` or `Create Account`.
- System response:
  - No input values are read by JavaScript.
  - No validation runs.
  - No account is created.
  - No login session is created.
  - A toast is shown:
    - Login: `Login functionality — connect to your backend!`
    - Signup: `Signup — connect to your backend!`
- Data read:
  - None from form fields.
- Data created:
  - None.
- Data updated:
  - Toast DOM text/state only.
- Data deleted:
  - None.

### Hidden or implied logic

- Customer authentication is not implemented.
- There is no auth gate for cart, checkout, reviews page access, or browsing.
- Checkout uses entered shipping email, not a logged-in user identity.

### Edge cases

- Empty, invalid, or malformed login/signup input is accepted because no validation occurs.
- Reloading the page does not preserve any customer auth state because none exists.

### Observations / assumptions

- Assumption: customer account flow is intentionally a placeholder.
- Backend implication: there is currently no user table or customer session model represented by the UI.

## Flow 2: Product Browsing

### What is actually implemented

- Browsing starts from home sections, header nav, mobile nav, category cards, search, wishlist, and shop filters.
- Product listing is built from `products = getProducts()`.

### Step-by-step breakdown

#### Step 1: App loads initial catalog

- User action:
  - Opens `index.html`.
- System response:
  - `store-data.js` seeds products/orders/reviews if missing.
  - `app.js` loads `products` from `getProducts()`.
  - `cart` and `wishlist` are loaded from `localStorage`.
  - `render()` draws the `home` page.
- Data read:
  - `maison_products`
  - `maison_orders`
  - `maison_reviews`
  - `maison_cart`
  - `maison_wishlist`
- Data created:
  - Seed data in localStorage, if keys were missing.
- Data updated:
  - In-memory `products`, `cart`, `wishlist`.
- Data deleted:
  - None.

#### Step 2: User browses from home page sections

- User action:
  - Clicks hero CTA, `View All`, category cards, or header category links.
- System response:
  - `navigate('shop', filter)` sets page and optional filter.
  - `renderShop()` builds listing based on `shopFilter`.
- Data read:
  - In-memory `products`.
  - `shopFilter`.
- Data created:
  - Shop DOM.
- Data updated:
  - `currentPage`
  - `shopFilter`
- Data deleted:
  - Previous page DOM replaced.

#### Step 3: User searches

- User action:
  - Clicks search icon.
  - Types in `#searchInput`.
  - Presses `Enter`.
- System response:
  - `toggleSearch()` opens search chip.
  - `handleSearch(e)` reads the query and calls `navigate('shop', q)`.
  - `renderShop()` filters products where name, brand, or category contains the text.
  - Search chip closes.
- Data read:
  - Search input value.
  - In-memory `products`.
- Data created:
  - None beyond rendered DOM.
- Data updated:
  - `shopFilter`
  - Search chip open/closed state.
- Data deleted:
  - None.

#### Step 4: User filters in shop sidebar

- User action:
  - Uses category checkboxes.
  - Uses brand checkboxes.
  - Uses `Sale items only`.
- System response:
  - Category and sale filters call `navigate('shop', ...)`.
  - Brand filter calls `filterByBrand(cb, brand)`, which also maps to `navigate('shop', brand)` when checked.
  - `renderShop()` re-renders the grid.
- Data read:
  - Checkbox states.
  - In-memory `products`.
- Data created:
  - None beyond rendered DOM.
- Data updated:
  - `shopFilter`.
- Data deleted:
  - Previous listing DOM replaced.

#### Step 5: User sorts products

- User action:
  - Changes the sort dropdown.
- System response:
  - `sortProducts(val)` rebuilds `#productGrid` in place.
  - Supported sorts: `price-asc`, `price-desc`, `rating`, `newest`.
- Data read:
  - Dropdown value.
  - In-memory `products`.
  - `shopFilter`.
- Data created:
  - Rebuilt grid HTML.
- Data updated:
  - `#productGrid.innerHTML`.
- Data deleted:
  - Previous grid DOM contents replaced.

### Hidden or implied logic

- Listing data source is always current `maison_products`.
- `syncProductsAndCart()` runs before every render, so removed products disappear from customer-facing views.
- Search is substring-based on name, brand, or category only.

### Edge cases

- If filters produce no results, an empty-state block is shown.
- Brand filters are not cumulative; checking one brand just navigates using that brand name as text filter.
- Sorting does not preserve arbitrary text filters correctly:
  - `sortProducts()` only re-applies sale/category filters.
  - If `shopFilter` is a search term or brand text, sorting falls back to all products.

### Observations / assumptions

- The UI exposes only one active filter token through `shopFilter`; this is why filters are mutually overwriting rather than composable.

## Flow 3: Product Detail View

### What is actually implemented

- Product detail is reached by clicking any product card.
- Detail page supports gallery switching, size/color selection, quantity selection, add to cart, wishlist, reviews, and related items.

### Step-by-step breakdown

#### Step 1: User opens a product

- User action:
  - Clicks any `.product-card`.
- System response:
  - Card calls `navigate('product', productId)`.
  - `renderProductDetail()` looks up product by `products.find(x => x.id === shopFilter)`.
  - If found, detail page renders.
  - If not found, UI shows `Product not found`.
- Data read:
  - In-memory `products`.
  - `shopFilter` as product ID.
  - `wishlist` for button state.
- Data created:
  - Product detail DOM.
- Data updated:
  - `currentPage`
  - `shopFilter`
- Data deleted:
  - Previous page DOM replaced.

#### Step 2: User browses product media and options

- User action:
  - Clicks thumbnail image.
  - Clicks a color swatch.
  - Clicks a size button.
  - Clicks quantity `+` / `-`.
- System response:
  - `changePdImg(src, thumb)` swaps main image and active thumbnail.
  - `selectColor(el)` updates active color swatch class.
  - `selectSize(el)` updates active size class.
  - `changeQty(d)` updates `pdQty`, but never below 1.
- Data read:
  - Product `images`, `colors`, `sizes`.
  - Current DOM active states.
- Data created:
  - None.
- Data updated:
  - DOM classes for selected image/color/size.
  - In-memory `pdQty`.
  - Main image `src`.
- Data deleted:
  - None.

#### Step 3: System shows stock and related products

- User action:
  - Passive view only.
- System response:
  - Stock badge text is derived from `stockCount`:
    - `< 15`: `Only X left`
    - otherwise `In Stock`
  - Related products are same-category products excluding current product, limited to 4.
- Data read:
  - Product `stockCount`, `category`.
  - In-memory `products`.
- Data created:
  - Related products section DOM.
- Data updated:
  - None persisted.
- Data deleted:
  - None.

#### Step 4: User views reviews from detail page

- User action:
  - Reads the review summary.
  - Optionally clicks `View all`.
- System response:
  - `renderReviewsSection(p)` pulls reviews with `getReviews(p.id)`.
  - Average rating and rating distribution are recalculated from stored reviews.
  - If more than 3 reviews exist, `goToReviews(productId)` navigates to paginated reviews page.
- Data read:
  - `maison_reviews` via `getReviews`.
  - Product fallback `rating` and `reviewCount`.
- Data created:
  - Reviews summary/list DOM.
- Data updated:
  - `reviewProductId`, `reviewPage`, navigation state if `View all` is clicked.
- Data deleted:
  - Previous page DOM if navigating.

### Hidden or implied logic

- Product detail relies on `shopFilter` as product ID, not a separate route parameter.
- Review summary uses stored reviews if present; otherwise it falls back to product seed metadata.
- No server fetch happens; everything is local.

### Edge cases

- Deleted product IDs in URL-like state render `Product not found`.
- Low stock label can show `Only 0 left` if a zero-stock product is opened directly.

### Observations / assumptions

- Size and color selections are purely UI state until add-to-cart happens.
- There is no variant-specific stock; stock belongs to the product as a whole.

## Flow 4: Add to Cart

### What is actually implemented

- Add to cart is available from product detail only.
- It enforces product-level stock checks and merges duplicate product+size+color combinations.

### Step-by-step breakdown

#### Step 1: User chooses variant and quantity

- User action:
  - On product detail page, leaves default or changes size/color.
  - Adjusts quantity with `+` / `-`.
- System response:
  - Active DOM state identifies chosen size/color.
  - `pdQty` tracks quantity.
- Data read:
  - Product `sizes`, `colors`.
  - Active selected DOM nodes.
- Data created:
  - None.
- Data updated:
  - `pdQty`
  - DOM active classes.
- Data deleted:
  - None.

#### Step 2: User clicks `Add to Cart`

- User action:
  - Clicks `Add to Cart`.
- System response:
  - `addToCartFromDetail(id)` reads:
    - active size text
    - active color title
    - `pdQty`
  - Then calls `addToCart(productId, size, color, qty)`.
- Data read:
  - DOM active size/color.
  - `pdQty`.
- Data created:
  - None yet.
- Data updated:
  - None yet.
- Data deleted:
  - None.

#### Step 3: System validates product and stock

- User action:
  - None, system-side.
- System response:
  - Looks up product in `products`.
  - If product missing, returns silently.
  - If `!p.inStock` or `p.stockCount <= 0`, shows `This item is out of stock`.
  - Defaults missing size/color to first available option.
  - Calculates `requestedQty = max(1, qty)`.
  - Finds existing matching cart line by `id + size + color`.
  - Calculates total quantity already in cart for the same product across all variants.
  - Calculates `remainingStock = p.stockCount - totalQtyForProduct`.
  - Calculates `addQty = min(requestedQty, remainingStock)`.
  - If `addQty <= 0`, shows `Not enough stock available`.
- Data read:
  - In-memory `products`.
  - In-memory `cart`.
  - Product `inStock`, `stockCount`, `sizes`, `colors`.
- Data created:
  - None yet.
- Data updated:
  - None yet.
- Data deleted:
  - None.

#### Step 4: System writes cart

- User action:
  - None, system-side.
- System response:
  - If matching line exists, increments `existing.qty += addQty`.
  - Otherwise pushes new cart line:
    - `{ id, size, color, qty: addQty, price: p.price }`
  - `saveState()` writes `maison_cart` and `maison_wishlist`.
  - Header badge updates.
  - Toast shows `<product name> added to cart`.
  - `pdQty` resets to `1` in `addToCartFromDetail`.
- Data read:
  - Existing cart contents.
- Data created:
  - New cart line, when variant not already present.
- Data updated:
  - Existing cart line quantity, or entire cart array.
  - `maison_cart` in localStorage.
  - Badge counts in DOM.
  - `pdQty`.
- Data deleted:
  - None.

### Hidden or implied logic

- Cart persistence is browser-local only.
- Cart lines store product ID and unit price snapshot, not full product details.
- Stock is enforced across the whole product, not per size/color combination.

### Edge cases

- Adding the same product with the same size and color merges into one line.
- Adding the same product with different size/color creates separate lines, but all still consume the same stock pool.
- Requesting more than remaining stock does not fail completely; it clamps to available quantity.
- Missing product ID silently does nothing.

### Observations / assumptions

- Backend implication: the UI expects cart line uniqueness by `(productId, size, color)`.
- Backend implication: unit price is captured at add time; cart does not automatically reprice if product price later changes.

## Flow 5: Cart Management

### What is actually implemented

- Cart page allows quantity increment/decrement, item removal, coupon entry, and navigation to checkout.
- No real coupon discount is applied.

### Step-by-step breakdown

#### Step 1: User opens cart

- User action:
  - Clicks cart icon in header.
- System response:
  - `navigate('cart')`.
  - `renderCart()` reads the cart.
  - If empty, shows empty-state with `Continue Shopping`.
  - If not empty, renders line items and summary.
- Data read:
  - In-memory `cart`.
  - In-memory `products` to resolve names/images/brands.
- Data created:
  - Cart page DOM.
- Data updated:
  - `currentPage`.
- Data deleted:
  - Previous page DOM replaced.

#### Step 2: System calculates totals

- User action:
  - Passive view only.
- System response:
  - `subtotal = sum(item.price * item.qty)`.
  - `shipping = 0` if subtotal > `200`, else `15`.
  - `total = subtotal + shipping`.
- Data read:
  - Cart line `price`, `qty`.
- Data created:
  - Computed totals only.
- Data updated:
  - Summary DOM.
- Data deleted:
  - None.

#### Step 3: User increases or decreases quantity

- User action:
  - Clicks item `+` or `-`.
- System response:
  - `updateCartQty(idx, delta)` updates `cart[idx].qty = max(1, qty + delta)`.
  - Saves state and re-renders cart.
- Data read:
  - Cart line by index.
- Data created:
  - None.
- Data updated:
  - Cart line quantity.
  - `maison_cart`.
  - Cart badge.
- Data deleted:
  - None.

#### Step 4: User removes an item

- User action:
  - Clicks `Remove`.
- System response:
  - `removeFromCart(idx)` performs `cart.splice(idx, 1)`.
  - Saves state and re-renders.
- Data read:
  - Cart line index.
- Data created:
  - None.
- Data updated:
  - Cart array.
  - `maison_cart`.
  - Cart badge.
- Data deleted:
  - One cart line.

#### Step 5: User applies coupon

- User action:
  - Enters coupon code and clicks `Apply`.
- System response:
  - `applyCoupon()` uppercases the input.
  - `SAVE10` or `SAVE20` show success toast only.
  - Any other code shows `Invalid coupon code`.
  - Totals do not change.
- Data read:
  - `#couponInput` value.
- Data created:
  - None.
- Data updated:
  - Toast DOM only.
- Data deleted:
  - None.

#### Step 6: User proceeds to checkout

- User action:
  - Clicks `Proceed to Checkout`.
- System response:
  - `navigate('checkout')`.
  - Checkout page renders step 1.
- Data read:
  - None specifically beyond existing cart state used later.
- Data created:
  - Checkout DOM.
- Data updated:
  - `currentPage`.
- Data deleted:
  - Previous page DOM replaced.

### Hidden or implied logic

- Cart is persistent across refreshes via `maison_cart`.
- Cart automatically self-heals when products are deleted by admin because `syncProductsAndCart()` removes invalid product IDs.

### Edge cases

- Empty cart shows empty-state instead of summary.
- Quantity cannot drop below 1 through cart controls.
- Cart quantity updates do not validate against stock at update time.
  - A user can increase quantity beyond current stock after the item is already in cart.
  - Final stock enforcement happens later in `placeOrder()`.

### Observations / assumptions

- Backend implication: cart update endpoint would need stock revalidation, because current UI does not do it here.

## Flow 6: Checkout Process

### What is actually implemented

- Checkout is a 4-step wizard rendered inside one container:
  1. Shipping
  2. Delivery
  3. Payment
  4. Review
- No hard validation blocks moving between checkout steps.
- Final order creation decrements stock, creates an order, and clears cart.

### Step-by-step breakdown

#### Step 1: User enters shipping details

- User action:
  - On checkout step 1, enters first name, last name, email, address, city, zip code, and country.
  - Clicks `Continue to Delivery`.
- System response:
  - `checkoutStep(2)` reads current form values into `checkoutForm`.
  - No required-field validation occurs.
  - Delivery defaults are set:
    - `deliveryMethod = 'Standard'`
    - `deliveryPrice = 0`
  - Step 2 UI replaces step 1 UI.
- Data read:
  - Shipping form input values.
- Data created:
  - `checkoutForm` values in memory.
- Data updated:
  - `checkoutStepNum`
  - `checkoutForm.firstName`
  - `checkoutForm.lastName`
  - `checkoutForm.email`
  - `checkoutForm.address`
  - `checkoutForm.city`
  - `checkoutForm.zipCode`
  - `checkoutForm.country`
  - `checkoutForm.deliveryMethod`
  - `checkoutForm.deliveryPrice`
- Data deleted:
  - Step 1 DOM is replaced.

#### Step 2: User selects delivery method

- User action:
  - Clicks one of:
    - Standard
    - Express
    - Next Day
  - Clicks `Continue to Payment`.
- System response:
  - `selectDelivery(el)` marks the selected card and radio input.
  - Updates `checkoutForm.deliveryMethod` and `checkoutForm.deliveryPrice`.
  - `checkoutStep(3)` replaces content with payment UI.
- Data read:
  - Clicked element `data-method` and `data-price`.
- Data created:
  - None.
- Data updated:
  - `checkoutForm.deliveryMethod`
  - `checkoutForm.deliveryPrice`
  - Delivery option selected CSS/radio state.
- Data deleted:
  - Step 2 DOM when moving forward.

#### Step 3: User enters payment details

- User action:
  - Can type card number, expiry, CVC, name on card.
  - Can optionally type an M-Pesa phone number.
  - Can click `Request STK (Demo)`.
  - Clicks `Review Order`.
- System response:
  - Card fields are not saved anywhere and are not validated.
  - `startMpesaStub()` validates phone against `^2547\\d{8}$`.
  - If invalid, toast says `Enter phone as 2547XXXXXXXX`.
  - If valid, spinner appears for 2 seconds, then a demo toast appears.
  - `checkoutStep(4)` recalculates totals and shows review screen.
- Data read:
  - `#mpesaPhone` if STK demo button is clicked.
  - Cart lines for review totals.
- Data created:
  - None persisted.
- Data updated:
  - Spinner DOM state.
  - `checkoutStepNum`.
- Data deleted:
  - Step 3 DOM when moving forward.

#### Step 4: User reviews order

- User action:
  - Reviews line items and total.
  - Clicks `Place Order`.
- System response:
  - Review page recomputes:
    - subtotal from cart
    - shipping from `checkoutForm.deliveryPrice`, else free-over-200 fallback
    - total
- Data read:
  - `cart`
  - `products`
  - `checkoutForm.deliveryPrice`
- Data created:
  - Review summary DOM.
- Data updated:
  - None persisted yet.
- Data deleted:
  - None.

#### Step 5: System re-syncs before order creation

- User action:
  - None, system-side during `placeOrder()`.
- System response:
  - Calls `syncProductsAndCart()`.
  - Reloads latest products.
  - Removes cart items whose products no longer exist.
  - If cart becomes empty, `placeOrder()` returns immediately.
- Data read:
  - `maison_products`
  - Current `cart`
- Data created:
  - None.
- Data updated:
  - In-memory `products`
  - Possibly `cart`
  - Possibly `maison_cart`
- Data deleted:
  - Invalid cart lines if products were removed.

#### Step 6: System validates stock before final placement

- User action:
  - None, system-side.
- System response:
  - Iterates through cart items.
  - For each item, checks:
    - product exists
    - `p.inStock`
    - `p.stockCount >= item.qty`
  - If any check fails, shows toast `"Item" is out of stock` or product-specific message and aborts placement.
- Data read:
  - Latest `products`
  - Current `cart`
- Data created:
  - None.
- Data updated:
  - None.
- Data deleted:
  - None.

#### Step 7: System decrements inventory

- User action:
  - None, system-side.
- System response:
  - For each cart item:
    - `p.stockCount = max(0, p.stockCount - item.qty)`
    - `p.inStock = p.stockCount > 0`
  - `setProducts(products)` writes updated catalog to `maison_products`.
- Data read:
  - Products and cart items.
- Data created:
  - None.
- Data updated:
  - Product `stockCount`
  - Product `inStock`
  - `maison_products`
- Data deleted:
  - None.

#### Step 8: System creates order record

- User action:
  - None, system-side.
- System response:
  - Builds `orderNum = 'MSN-' + last 6 digits of timestamp`.
  - Builds `customer.name` from first + last name, fallback `Customer`.
  - Uses `checkoutForm.email`, fallback `customer@example.com`.
  - Calls `createOrder(...)`.
  - `createOrder` normalizes order defaults and prepends it to `maison_orders`.
  - Order stores:
    - `orderNum`
    - `customer`
    - `date`
    - `items[]`
    - `subtotal`
    - `shipping`
    - `total`
    - `status: 'pending'`
- Data read:
  - `checkoutForm`
  - `cart`
  - Calculated totals
  - Existing `maison_orders`
- Data created:
  - New order object.
- Data updated:
  - `maison_orders`
- Data deleted:
  - None.

#### Step 9: System clears cart and shows confirmation

- User action:
  - None, system-side.
- System response:
  - Sets `cart = []`.
  - `saveState()` persists empty cart.
  - Replaces checkout content with thank-you screen and order number.
- Data read:
  - None.
- Data created:
  - Confirmation DOM.
- Data updated:
  - In-memory `cart`
  - `maison_cart`
  - Cart badge
- Data deleted:
  - All cart lines.

### Hidden or implied logic

- Checkout data is in-memory only; refreshing mid-checkout loses entered data.
- Shipping cost rule is duplicated in cart and checkout:
  - Free above `Ksh 200`
  - Otherwise `Ksh 15`
- Payment is non-functional; order placement does not depend on successful payment.
- Order placement is the only place where stock is actually decremented.

### Edge cases

- User can proceed through checkout with blank shipping fields.
- User can place order without valid payment info because no card validation is enforced.
- If cart is empty when `Place Order` is clicked, function exits silently.
- If stock changed after carting but before order placement, order is blocked at final validation step.

### Observations / assumptions

- Backend implication: checkout would need server-side validation for shipping, payment, pricing, and stock.
- The UI currently treats payment as informational, not transactional.

## Flow 7: Admin Authentication

### What is actually implemented

- Admin auth is implemented locally using hardcoded credentials and a token in localStorage.
- This is separate from customer auth.

### Step-by-step breakdown

#### Step 1: Admin opens admin page

- User action:
  - Opens `admin.html`.
- System response:
  - `renderAdmin()` runs.
  - If `isAuthed()` is false, `renderLogin()` is shown.
  - Sidebar is hidden on login screen.
- Data read:
  - `maison_admin_token`
- Data created:
  - Login DOM if unauthenticated.
- Data updated:
  - Sidebar visibility.
- Data deleted:
  - Main content DOM replaced.

#### Step 2: Admin submits credentials

- User action:
  - Clicks `Sign In` on admin login form.
- System response:
  - `handleLogin()` reads `#adminLoginEmail` and `#adminLoginPass`.
  - Compares them to hardcoded values:
    - `admin@maison.test`
    - `admin123`
  - If correct:
    - writes `maison_admin_token = 'ok'`
    - shows `Signed in`
    - renders admin dashboard
  - If incorrect:
    - shows `Invalid admin credentials`
- Data read:
  - Admin login form values.
  - Hardcoded credential constants.
- Data created:
  - Token in localStorage on success.
- Data updated:
  - `maison_admin_token`
  - Admin page DOM.
- Data deleted:
  - None.

#### Step 3: Admin signs out

- User action:
  - Clicks `Sign Out`.
- System response:
  - Removes `maison_admin_token`.
  - Redirects browser to `index.html`.
- Data read:
  - None.
- Data created:
  - None.
- Data updated:
  - Browser location.
- Data deleted:
  - `maison_admin_token`.

### Hidden or implied logic

- Admin access control is client-side only.
- Any user with browser storage access can inspect or manipulate auth state.

### Edge cases

- Refresh preserves admin access while token exists.
- Direct navigation to admin sub-actions is blocked only by `isAuthed()` checks in render/navigation logic.

### Observations / assumptions

- This is a demo auth gate, not a secure authentication system.

## Flow 8: Admin Order Management

### What is actually implemented

- Admin can view orders, inspect order details, and advance order status along a fixed path.
- Admin cannot create or delete orders from the UI.

### Step-by-step breakdown

#### Step 1: Admin navigates to Orders

- User action:
  - Clicks `Orders` in sidebar.
- System response:
  - `navigateAdmin('orders')`.
  - `renderOrders(products, orders)` builds orders table.
  - Orders are sorted newest-first by `date`.
- Data read:
  - `maison_orders`
  - `maison_products` for later modal resolution
- Data created:
  - Orders table DOM.
- Data updated:
  - `currentAdminPage`
  - Title/subtitle DOM.
- Data deleted:
  - Previous admin page DOM replaced.

#### Step 2: Admin inspects order list

- User action:
  - Passive view or scans rows.
- System response:
  - Each row shows:
    - order number
    - customer name
    - date
    - total
    - status chip
    - actions
  - Available main action depends on status:
    - `pending` -> `Confirm`
    - `confirmed` -> `Ship`
    - `shipped` -> `Deliver`
    - `delivered` / `cancelled` -> no transition button
- Data read:
  - Order `status`, `customer`, `date`, `total`.
- Data created:
  - Action buttons based on status.
- Data updated:
  - None persisted.
- Data deleted:
  - None.

#### Step 3: Admin updates order status

- User action:
  - Clicks `Confirm`, `Ship`, or `Deliver`.
- System response:
  - `setOrderStatus(orderNum, nextStatus)` calls `updateOrderStatus`.
  - If order exists:
    - updates matching order `status`
    - writes `maison_orders`
    - shows `Order updated`
    - re-renders page
  - If order missing:
    - shows `Order not found`
- Data read:
  - `maison_orders`
  - Selected `orderNum`
- Data created:
  - None.
- Data updated:
  - One order's `status`
  - `maison_orders`
- Data deleted:
  - None.

#### Step 4: Admin views full order details

- User action:
  - Clicks `View`.
- System response:
  - `openOrderModal(orderNum)` loads the order.
  - Reads products to resolve line item names/images by `productId`.
  - Modal shows customer info, status, subtotal, shipping, total, and line items.
  - If demo order has no stored items, modal explicitly says so.
- Data read:
  - `maison_orders`
  - `maison_products`
  - Order `items`
- Data created:
  - Modal DOM.
- Data updated:
  - Modal visible state.
- Data deleted:
  - Previous modal body DOM replaced.

### Hidden or implied logic

- Order status transitions are linear and UI-driven.
- There is no cancellation action in the admin UI.
- Order line items are expected to reference `productId` or `id`.

### Edge cases

- Some seeded demo orders have empty `items`; modal handles this with a placeholder row.
- If a product was deleted after an order was created, order modal falls back to `Unknown item` or stored item name.

### Observations / assumptions

- Backend implication: order lifecycle currently represented is `pending -> confirmed -> shipped -> delivered`.

## Flow 9: Admin Product Management

### What is actually implemented

- Admin can add, edit, and delete products.
- Product changes immediately affect storefront behavior because both sides share `maison_products`.

### Step-by-step breakdown

#### Step 1: Admin opens Products page

- User action:
  - Clicks `Products` in sidebar.
- System response:
  - `navigateAdmin('products')`.
  - `renderProducts(products)` builds product table sorted by product name.
- Data read:
  - `maison_products`
- Data created:
  - Products table DOM.
- Data updated:
  - `currentAdminPage`
  - Title/subtitle DOM.
- Data deleted:
  - Previous admin page DOM replaced.

#### Step 2A: Admin starts Add Product flow

- User action:
  - Clicks `+ Add Product`.
- System response:
  - `openAddProductModal()`.
  - Sets modal mode to `add`.
  - Opens empty product form modal.
- Data read:
  - Category list from `window.maisonCategories`.
- Data created:
  - Empty modal form DOM.
- Data updated:
  - `productModalMode`
  - `productModalEditingId`
  - Modal state.
- Data deleted:
  - Previous modal body state.

#### Step 2B: Admin starts Edit Product flow

- User action:
  - Clicks `Edit` on a product row.
- System response:
  - `openProductModal(productId)`.
  - Loads existing product.
  - Opens modal prefilled with product values.
  - Existing images become `productModalBaseImages`.
- Data read:
  - `maison_products`
- Data created:
  - Prefilled modal form DOM.
- Data updated:
  - `productModalMode = 'edit'`
  - `productModalEditingId`
  - `productModalBaseImages`
- Data deleted:
  - Previous modal body state.

#### Step 3: Admin enters product form data

- User action:
  - Fills or edits:
    - name
    - brand
    - category
    - subcategory
    - price
    - original price
    - stock count
    - in-stock select
    - image URLs
    - local image files
    - sizes
    - colors
    - description
    - material
    - featured / best seller / new arrival flags
- System response:
  - Local image picker uses `FileReader` to convert files into data URLs.
  - Preview area shows combined base + uploaded images.
- Data read:
  - Form field values.
  - Local file contents for selected images.
- Data created:
  - `pendingImageDataUrls`
  - Preview DOM.
- Data updated:
  - `pendingImageReadPromise`
  - Preview UI.
- Data deleted:
  - Previous pending image state when file selection changes.

#### Step 4: Admin saves product

- User action:
  - Clicks `Save`.
- System response:
  - `saveProductFromModal()` collects all form values.
  - Validation enforced before save:
    - name required
    - at least one image required
    - at least one color required
    - at least one size required
  - If `inStock` is true, `stockCount` becomes at least 1.
  - If `inStock` is false, `stockCount` becomes 0.
  - Merges existing images + URL images + picked images.
  - Removes duplicate image URLs/data URLs.
  - Calls `upsertProduct(payload)`.
  - `upsertProduct`:
    - normalizes product
    - generates new ID if needed
    - updates existing product by ID or appends new product
    - writes `maison_products`
  - Modal closes, toast shows `Product saved`, page re-renders.
- Data read:
  - Form values.
  - Existing `maison_products`.
  - Pending image state.
- Data created:
  - New product when adding.
  - Generated product ID when adding without ID.
- Data updated:
  - Existing product when editing.
  - `maison_products`
  - Modal/button state.
- Data deleted:
  - None directly in product save.

#### Step 5: Product normalization runs during save

- User action:
  - None, system-side.
- System response:
  - `normalizeProduct()` ensures:
    - IDs and strings are coerced
    - category is valid or defaulted
    - prices are numeric
    - discount/original price are recomputed when applicable
    - images array exists with fallback image
    - sizes/colors are parsed from comma-separated inputs
    - stock count is clamped to `>= 0`
    - `inStock = stockCount > 0`
    - flags become booleans
- Data read:
  - Raw payload.
- Data created:
  - Normalized product object.
- Data updated:
  - Product fields before persistence.
- Data deleted:
  - Invalid/empty structure is effectively discarded during normalization.

#### Step 6: Admin deletes product

- User action:
  - Clicks `Delete`.
  - Confirms browser `confirm(...)`.
- System response:
  - `deleteProduct(id)`:
    - removes product from `maison_products`
    - removes matching cart lines from `maison_cart`
    - removes matching wishlist IDs from `maison_wishlist`
  - Shows `Product deleted`.
  - Re-renders admin page.
- Data read:
  - `maison_products`
  - `maison_cart`
  - `maison_wishlist`
- Data created:
  - None.
- Data updated:
  - `maison_products`
  - `maison_cart`
  - `maison_wishlist`
- Data deleted:
  - Product record
  - Any cart lines referencing that product
  - Any wishlist entries referencing that product

### Hidden or implied logic

- Storefront reacts to product deletion because invalid cart/wishlist entries are pruned.
- Storefront reacts to product edits because it reloads shared product state on render and on `storage` events.
- Product images can be browser-stored data URLs, which may make localStorage very large.

### Edge cases

- Saving with blank image URLs but selected local files is valid.
- Editing can preserve existing images and append new ones.
- Invalid category is normalized to a default/valid value.
- Stock can be forced to zero by setting `In Stock = No`.

### Observations / assumptions

- Backend implication: admin form already expresses the product schema the system expects.
- Product deletion is the only place where related customer-side records are cascade-pruned.

## Flow 10: Admin Customer View

### What is actually implemented

- Admin can view customer rollups derived from orders.
- No direct customer CRUD exists.

### Step-by-step breakdown

#### Step 1: Admin opens Customers page

- User action:
  - Clicks `Customers`.
- System response:
  - `renderCustomers()` calls `getCustomerSummaries()`.
  - Customers are grouped by order email.
- Data read:
  - `maison_orders`
- Data created:
  - Derived customer summary list.
- Data updated:
  - `currentAdminPage`
  - Title/subtitle DOM.
- Data deleted:
  - Previous admin page DOM replaced.

#### Step 2: System aggregates customer metrics

- User action:
  - Passive view only.
- System response:
  - For each email:
    - counts orders
    - sums non-cancelled total spent
    - tracks earliest order date as joined date
  - Sorts customers by highest total spent.
- Data read:
  - Order customer names/emails.
  - Order totals and statuses.
- Data created:
  - Customer summary objects.
- Data updated:
  - Customers table DOM.
- Data deleted:
  - None.

### Hidden or implied logic

- Customer identity is email-based.
- There is no dedicated customers dataset; customers are inferred from orders.

### Edge cases

- Orders without customer email are skipped.
- Cancelled orders still count toward order count, but not toward total spent.

### Observations / assumptions

- Backend implication: current admin customer model is a reporting projection, not a true customer entity.

## Flow 11: Review Submission

### What is actually implemented

- Review submission is available from product detail.
- It is gated by delivered-order verification based on email and product ID.

### Step-by-step breakdown

#### Step 1: User fills review form

- User action:
  - Enters name.
  - Enters email used for the order.
  - Clicks a star rating.
  - Types a message.
  - Clicks `Submit Review`.
- System response:
  - `selectReviewRating(productId, value)` stores chosen rating in `reviewSelections`.
  - `submitReview(productId)` reads name, email, message, and rating.
- Data read:
  - Review form fields.
  - `reviewSelections[productId]`.
- Data created:
  - None yet.
- Data updated:
  - `reviewSelections`.
- Data deleted:
  - None.

#### Step 2: System validates review

- User action:
  - None, system-side.
- System response:
  - Requires:
    - email
    - message
    - rating
  - Name is optional and defaults to `Customer`.
  - Calls `hasDeliveredPurchase(productId, email)`.
  - That function scans `maison_orders` for:
    - same email
    - `status === 'delivered'`
    - at least one order item with matching product ID
  - If rule fails, shows `Only delivered orders can review this product`.
- Data read:
  - `maison_orders`
  - Order statuses, emails, items.
- Data created:
  - None.
- Data updated:
  - None.
- Data deleted:
  - None.

#### Step 3: System creates review

- User action:
  - None, system-side.
- System response:
  - Calls `addReview(...)`.
  - Appends normalized review to `maison_reviews`.
  - `verified: true`.
  - Date defaults to today if not provided.
  - Clears in-memory selected rating.
  - Shows thank-you toast.
  - Re-renders product page.
- Data read:
  - Existing `maison_reviews`.
- Data created:
  - New review object.
- Data updated:
  - `maison_reviews`
  - `reviewSelections[productId] = 0`
- Data deleted:
  - None.

### Hidden or implied logic

- Review verification depends on order email matching the entered email, not a logged-in user.
- Review count on product seed data is not updated when new reviews are added; live review section uses `maison_reviews` directly.

### Edge cases

- Missing name is allowed; it becomes `Customer`.
- Missing email, message, or rating blocks submission.
- Delivered order must include the exact product.
- If no delivered order exists because checkout-created orders are still `pending`, newly purchased items cannot be reviewed until admin advances order to `delivered`.

### Observations / assumptions

- This is the clearest implemented business rule in the storefront: verified review requires delivered purchase evidence.

## Cross-Flow Hidden Logic Summary

### Authentication checks

- Customer auth:
  - Not implemented.
  - No customer session, account persistence, or access control.
- Admin auth:
  - Implemented via hardcoded credentials and `maison_admin_token`.
  - Entirely client-side.

### Stock validation

- Enforced at add-to-cart time using remaining product stock across all cart variants.
- Not enforced when changing quantity in cart.
- Enforced again during final order placement.
- Stock decrements only after successful `placeOrder()`.

### Price calculations

- Product display price may include `originalPrice` and computed `discount`.
- Cart subtotal uses stored line price x quantity.
- Shipping:
  - Cart default: free over `Ksh 200`, else `Ksh 15`
  - Checkout review/order: selected delivery price if set, else same default rule
- Coupon UI does not affect totals.

### Session / persistence

- Products, orders, reviews, cart, wishlist, and admin token all persist in `localStorage`.
- Checkout form does not persist.
- Customer auth does not persist because it does not exist.

## Key Backend-Oriented Findings

- The storefront already defines core data entities: product, cart line, order, review, customer summary.
- Product deletion has cascade effects on cart and wishlist.
- Admin order fulfillment status drives review eligibility.
- The UI depends heavily on browser-local state and would require server-side equivalents for:
  - auth/session
  - cart ownership
  - stock-safe cart updates
  - checkout validation
  - payment confirmation
  - order lifecycle
  - secure admin access

## Assumptions Called Out Explicitly

- Customer registration/login is intentionally a placeholder because no storage or validation exists for it.
- Checkout order placement is allowed without payment because the current UI does not enforce payment success.
- Brand filtering is implemented as a text filter, not as a dedicated brand-state filter.
- Order review gating assumes admin will eventually mark customer orders as `delivered`, which then unlocks review submission.
