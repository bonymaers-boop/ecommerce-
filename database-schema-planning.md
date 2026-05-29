# Database Schema Planning From Implemented Flows

This document translates the implemented UI flows in [implemented-flows-analysis.md](/e:/Fashion%20Wear%20E-Commerce%20web/e-commerce/FRONTEND/implemented-flows-analysis.md) into backend database tables.

The goal is not to design an abstract e-commerce schema. The goal is to identify the tables you actually need based on what the current frontend already does.

## How To Read This

For each table, this document explains:

- what the table stores
- which implemented flows require it
- why it should exist as its own table
- the most important columns to include

## Recommended Core Tables

These are the tables I would treat as required if you want to move this frontend from `localStorage` to a real backend.

1. `users`
2. `products`
3. `product_images`
4. `product_colors`
5. `product_sizes`
6. `cart_items`
7. `orders`
8. `order_items`
9. `reviews`

## 1) `users`

### Why this table is required

The current frontend does not implement real customer login, but the flows clearly need user identity once you build the backend:

- registration / login flow
- cart ownership
- checkout ownership
- order history
- admin authentication
- review verification

Right now the UI uses email strings in checkout and reviews. In a backend system, those emails should be tied to real user records.

### Flows that depend on it

- Customer registration / login
- Checkout
- Orders
- Review submission
- Admin authentication

### Why it should be a separate table

Users are a core business entity. They should not be mixed into orders or reviews only, because:

- one user can have many orders
- one user can have many reviews
- one user can own one cart with many cart items
- admin access should come from a user role, not a hardcoded token

### Suggested columns

- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `created_at`
- `updated_at`

### Notes

- `role` can be `customer` or `admin`.
- `email` should be unique.
- This table replaces the frontend-only fake auth behavior.

## 2) `products`

### Why this table is required

This is the main catalog table. The storefront and admin both revolve around product data:

- browsing products
- viewing product detail
- adding to cart
- stock checks
- admin add/edit/delete product

### Flows that depend on it

- Product browsing
- Product detail
- Add to cart
- Cart rendering
- Checkout stock validation
- Admin product management
- Admin dashboard stock alerts

### Why it should be a separate table

Products are the center of the catalog. They must exist independently because many other tables refer to them:

- cart items
- order items
- reviews
- product images
- product colors
- product sizes

### Suggested columns

- `id`
- `name`
- `brand`
- `category`
- `subcategory`
- `price`
- `original_price`
- `discount_percent` or computed discount
- `description`
- `material`
- `stock_count`
- `is_featured`
- `is_best_seller`
- `is_new_arrival`
- `created_at`
- `updated_at`

### Notes

- Use `DECIMAL` for prices in MySQL.
- `stock_count` is important because the implemented UI already checks stock at add-to-cart and checkout.
- The frontend currently stores `inStock`, but in a database this can be derived from `stock_count > 0`.

## 3) `product_images`

### Why this table is required

The product detail page shows multiple thumbnails and the admin can add multiple images per product.

The current frontend stores images as arrays. In a relational database, repeated values like multiple image URLs should be normalized into their own table.

### Flows that depend on it

- Product browsing card image
- Product detail image gallery
- Admin add/edit product images

### Why it should be a separate table

One product can have many images. That is a one-to-many relationship.

If you store multiple image URLs in one text field, querying and maintaining them becomes harder.

### Suggested columns

- `id`
- `product_id`
- `image_url`
- `sort_order`
- `created_at`

### Notes

- `sort_order` helps decide which image is the main image.
- Start by storing URLs or file paths, not raw image binary in MySQL.

## 4) `product_colors`

### Why this table is required

The frontend lets users choose product colors, and admin can define color values as `Name|Hex`.

These are variant-like product attributes that should not be packed into one string column.

### Flows that depend on it

- Product detail color selection
- Add to cart
- Order item detail
- Admin product editing

### Why it should be a separate table

One product can have many colors. That is another one-to-many relationship.

This also keeps the schema aligned with the actual UI, which expects:

- a color name
- a hex code for rendering swatches

### Suggested columns

- `id`
- `product_id`
- `name`
- `hex_code`

### Notes

- This matches the existing frontend object shape closely.

## 5) `product_sizes`

### Why this table is required

The frontend lets users choose sizes on the product detail page, and admin can define comma-separated sizes.

In the database, those values should be normalized instead of stored as comma-separated text.

### Flows that depend on it

- Product detail size selection
- Add to cart
- Order item detail
- Admin product editing

### Why it should be a separate table

One product can have many sizes. This is a natural one-to-many relationship.

### Suggested columns

- `id`
- `product_id`
- `size_label`

### Notes

- Since your current frontend does not manage stock by size, you do not need per-size stock yet.
- If you later support true variants, this design may evolve into a `product_variants` table.

## 6) `cart_items`

### Why this table is required

The storefront already has a persistent cart flow:

- add to cart
- update quantity
- remove item
- proceed to checkout

Today that cart lives in `localStorage`. In the backend, cart state needs to be stored in the database.

### Flows that depend on it

- Add to cart
- Cart management
- Checkout

### Why it should be a separate table

Cart data is transactional user state, not product state.

One user can have many cart lines, and each line references one product plus chosen options.

### Suggested columns

- `id`
- `user_id`
- `product_id`
- `size`
- `color`
- `qty`
- `unit_price`
- `created_at`
- `updated_at`

### Notes

- The implemented frontend merges identical lines by `product + size + color`.
- `unit_price` should be saved so the cart remains stable even if product price changes later.
- If you want guest carts, you can later add `session_id` or a separate guest-cart strategy.

## 7) `orders`

### Why this table is required

Orders are already a major part of the implemented flows:

- checkout creates orders
- admin reads orders
- admin updates order status
- customer review eligibility depends on delivered orders

### Flows that depend on it

- Checkout
- Admin orders
- Admin dashboard metrics
- Admin customers view
- Review verification

### Why it should be a separate table

An order is a top-level business record. It needs its own identity, totals, shipping information, and fulfillment status.

### Suggested columns

- `id`
- `order_number`
- `user_id`
- `status`
- `shipping_name`
- `shipping_email`
- `address`
- `city`
- `zip_code`
- `country`
- `delivery_method`
- `subtotal`
- `shipping_amount`
- `total`
- `created_at`
- `updated_at`

### Notes

- `status` should support the implemented flow:
  - `pending`
  - `confirmed`
  - `shipped`
  - `delivered`
  - `cancelled`
- Even if a user exists, storing shipping email/name on the order is still useful because orders are historical records.

## 8) `order_items`

### Why this table is required

The current checkout creates an `items` array inside each order, and the admin order modal displays item-level data:

- product
- quantity
- unit price
- size
- color

In a relational database, those should be normalized into a child table of `orders`.

### Flows that depend on it

- Checkout
- Admin order detail modal
- Review verification by purchased product

### Why it should be a separate table

One order contains many items. That is a classic one-to-many relationship.

You should not store line items as JSON if you want clean SQL queries and proper relational behavior.

### Suggested columns

- `id`
- `order_id`
- `product_id`
- `product_name_snapshot`
- `qty`
- `unit_price`
- `size`
- `color`

### Notes

- `product_name_snapshot` is helpful so historical orders still make sense even if the product name changes later.
- This table is essential because `hasDeliveredPurchase(productId, email)` in the frontend relies on item-level matching.

## 9) `reviews`

### Why this table is required

The product detail page already supports reading and writing reviews.

Review submission is not cosmetic in this project. It includes actual business rules:

- email is required
- rating is required
- message is required
- only delivered purchases of that product may submit

### Flows that depend on it

- Product detail reviews
- Reviews page
- Review submission

### Why it should be a separate table

One product can have many reviews.
One user can write many reviews.

This data must be queryable independently from orders and products.

### Suggested columns

- `id`
- `product_id`
- `user_id`
- `rating`
- `message`
- `verified`
- `created_at`

### Notes

- In the current frontend, review verification is derived by checking delivered orders.
- In the backend, `verified` can still be stored, but the insertion logic should enforce the rule from order history.

## Relationships Between Tables

These are the key relationships implied by the implemented frontend:

- one `user` -> many `cart_items`
- one `user` -> many `orders`
- one `user` -> many `reviews`
- one `product` -> many `product_images`
- one `product` -> many `product_colors`
- one `product` -> many `product_sizes`
- one `product` -> many `cart_items`
- one `product` -> many `order_items`
- one `product` -> many `reviews`
- one `order` -> many `order_items`

## Tables I Do Not Think You Need Immediately

These may become useful later, but they are not required to faithfully implement the current frontend.

### `wishlists`

The current frontend stores wishlist as a simple array of product IDs in `localStorage`.

For a first backend version, you could skip this entirely or implement a simple table later:

- `user_id`
- `product_id`

Reason to delay:

- wishlist is not part of checkout or admin flows
- it does not affect stock, orders, or reviews

### `coupons`

The coupon UI is only a placeholder right now.

Reason to delay:

- current frontend does not apply real discount logic
- no order totals depend on coupon storage yet

### `payments`

Payment is currently UI-only.

Reason to delay:

- checkout places an order without real payment processing
- M-Pesa flow is only a demo spinner and message

You can add a `payments` table once you connect a real payment provider.

## Minimal First Version vs Better Version

### Minimal first version

If you want to start quickly, the smallest realistic backend schema is:

1. `users`
2. `products`
3. `cart_items`
4. `orders`
5. `order_items`
6. `reviews`

This works, but you would probably store product images, colors, and sizes less cleanly.

### Better version

If you want a cleaner relational design from the start, use:

1. `users`
2. `products`
3. `product_images`
4. `product_colors`
5. `product_sizes`
6. `cart_items`
7. `orders`
8. `order_items`
9. `reviews`

This version matches the implemented frontend more naturally.

## Recommended Build Order

Based on your current flows, I would implement the schema in this order:

1. `users`
2. `products`
3. `product_images`
4. `product_colors`
5. `product_sizes`
6. `orders`
7. `order_items`
8. `reviews`
9. `cart_items`

Reason:

- product browsing and admin product management need product data first
- order and review logic depend on product data
- cart is easier once user and product tables exist

## Final Recommendation

If your goal is to start your backend journey with MySQL, the safest schema choice for this project is:

- `users`
- `products`
- `product_images`
- `product_colors`
- `product_sizes`
- `cart_items`
- `orders`
- `order_items`
- `reviews`

That schema is directly justified by the implemented flows, not by theory.

It is enough to support:

- real authentication
- real product CRUD
- real cart persistence
- real checkout and order creation
- admin fulfillment updates
- verified review rules

## Next Step

After this file, the next practical step is to turn this into:

- an ERD
- a MySQL `schema.sql`
- foreign keys
- indexes
- starter Express routes

That would be the right bridge from frontend analysis into backend implementation.
