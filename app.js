// ===== DATA =====
// This top section defines the raw information the storefront can display.
// In practice, the live product list comes from `store-data.js`, but this legacy array
// still shows the shape of a product object very clearly for learning purposes.
// `initialProducts` exists only for legacy reference; actual products are loaded from `store-data.js`.
const initialProducts = [
  {id:"1",name:"Tailored Wool Blazer",brand:"Maison Élégance",category:"Women",subcategory:"Blazers",price:289,originalPrice:389,discount:26,images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"],colors:[{name:"Charcoal",hex:"#36454F"},{name:"Camel",hex:"#C19A6B"}],sizes:["XS","S","M","L","XL"],rating:4.7,reviewCount:128,description:"Impeccably tailored from premium Italian wool, this blazer features a structured silhouette with satin-lined interior for a polished, sophisticated look.",material:"100% Italian Wool",inStock:true,stockCount:24,tags:["blazer","formal","wool"],isFeatured:true,isBestSeller:true},
  {id:"2",name:"Silk Slip Dress",brand:"Lumière",category:"Women",subcategory:"Dresses",price:195,images:["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"],colors:[{name:"Champagne",hex:"#F7E7CE"},{name:"Black",hex:"#000000"},{name:"Burgundy",hex:"#800020"}],sizes:["XS","S","M","L"],rating:4.9,reviewCount:256,description:"A timeless slip dress crafted from luxurious mulberry silk. The bias-cut drapes beautifully, creating an effortlessly elegant silhouette.",material:"100% Mulberry Silk",inStock:true,stockCount:18,tags:["dress","silk","evening"],isNewArrival:true,isFeatured:true},
  {id:"3",name:"Cashmere Crewneck Sweater",brand:"Nordhaus",category:"Men",subcategory:"Sweaters",price:245,originalPrice:320,discount:23,images:["https://images.unsplash.com/photo-1614975059251-992f11792571?w=600","https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"],colors:[{name:"Navy",hex:"#1B2A4A"},{name:"Oatmeal",hex:"#D4C5A9"},{name:"Forest",hex:"#228B22"}],sizes:["S","M","L","XL","XXL"],rating:4.8,reviewCount:189,description:"Ultra-soft Mongolian cashmere crewneck with ribbed cuffs and hem. A wardrobe essential that pairs effortlessly with everything.",material:"100% Mongolian Cashmere",inStock:true,stockCount:32,tags:["sweater","cashmere","casual"],isBestSeller:true},
  {id:"4",name:"Leather Chelsea Boots",brand:"Artisan & Co.",category:"Shoes",subcategory:"Boots",price:375,images:["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600","https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600"],colors:[{name:"Black",hex:"#000000"},{name:"Brown",hex:"#8B4513"}],sizes:["39","40","41","42","43","44","45"],rating:4.6,reviewCount:97,description:"Handcrafted from full-grain calfskin leather with a Goodyear welt construction. Features elastic side panels and a pull tab for easy on/off.",material:"Full-grain Calfskin Leather",inStock:true,stockCount:14,tags:["boots","leather","chelsea"],isFeatured:true,isNewArrival:true},
  {id:"5",name:"Linen Wide-Leg Trousers",brand:"Maison Élégance",category:"Women",subcategory:"Trousers",price:145,images:["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600"],colors:[{name:"Sand",hex:"#C2B280"},{name:"White",hex:"#FFFFFF"},{name:"Olive",hex:"#808000"}],sizes:["XS","S","M","L","XL"],rating:4.5,reviewCount:73,description:"Relaxed wide-leg trousers in breathable European linen. Features a high waist with pleated front and side pockets.",material:"100% European Linen",inStock:true,stockCount:40,tags:["trousers","linen","casual"],isNewArrival:true},
  {id:"6",name:"Structured Leather Tote",brand:"Lumière",category:"Accessories",subcategory:"Bags",price:425,originalPrice:550,discount:23,images:["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"],colors:[{name:"Tan",hex:"#D2B48C"},{name:"Black",hex:"#000000"}],sizes:["One Size"],rating:4.8,reviewCount:156,description:"A structured tote bag crafted from vegetable-tanned Italian leather. Features interior pockets, magnetic closure, and detachable shoulder strap.",material:"Vegetable-tanned Italian Leather",inStock:true,stockCount:8,tags:["bag","tote","leather"],isFeatured:true,isBestSeller:true},
  {id:"7",name:"Organic Cotton T-Shirt",brand:"Nordhaus",category:"Men",subcategory:"T-Shirts",price:65,images:["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"],colors:[{name:"White",hex:"#FFFFFF"},{name:"Black",hex:"#000000"},{name:"Gray",hex:"#808080"}],sizes:["S","M","L","XL","XXL"],rating:4.4,reviewCount:342,description:"Classic crew-neck tee in heavyweight organic cotton. Pre-shrunk with a relaxed fit and reinforced seams for lasting comfort.",material:"100% Organic Cotton",inStock:true,stockCount:120,tags:["t-shirt","cotton","basics"],isBestSeller:true},
  {id:"8",name:"Kids Denim Jacket",brand:"Petit Monde",category:"Kids",subcategory:"Jackets",price:89,originalPrice:120,discount:26,images:["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600","https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600"],colors:[{name:"Classic Blue",hex:"#4169E1"},{name:"Light Wash",hex:"#B0C4DE"}],sizes:["3-4Y","5-6Y","7-8Y","9-10Y","11-12Y"],rating:4.6,reviewCount:64,description:"A classic denim jacket for kids with snap-button closure, chest pockets, and adjustable waist tabs.",material:"100% Cotton Denim",inStock:true,stockCount:35,tags:["jacket","denim","kids"],isNewArrival:true},
  {id:"9",name:"Merino Wool Scarf",brand:"Artisan & Co.",category:"Accessories",subcategory:"Scarves",price:95,images:["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600"],colors:[{name:"Camel",hex:"#C19A6B"},{name:"Charcoal",hex:"#36454F"},{name:"Burgundy",hex:"#800020"}],sizes:["One Size"],rating:4.7,reviewCount:88,description:"Luxuriously soft merino wool scarf with fringed edges. Generously sized for wrapping, draping, or styling as a shawl.",material:"100% Merino Wool",inStock:true,stockCount:50,tags:["scarf","wool","accessories"],isFeatured:true},
  {id:"10",name:"Slim Fit Chinos",brand:"Nordhaus",category:"Men",subcategory:"Trousers",price:110,originalPrice:145,discount:24,images:["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600"],colors:[{name:"Khaki",hex:"#C3B091"},{name:"Navy",hex:"#1B2A4A"},{name:"Olive",hex:"#808000"}],sizes:["28","30","32","34","36","38"],rating:4.5,reviewCount:210,description:"Modern slim-fit chinos in stretch cotton twill. Features a mid-rise waist, flat front, and tapered leg.",material:"98% Cotton, 2% Elastane",inStock:true,stockCount:65,tags:["chinos","trousers","casual"],isBestSeller:true},
  {id:"11",name:"Embroidered Midi Skirt",brand:"Lumière",category:"Women",subcategory:"Skirts",price:175,images:["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600"],colors:[{name:"Ivory",hex:"#FFFFF0"},{name:"Blush",hex:"#DE5D83"}],sizes:["XS","S","M","L"],rating:4.6,reviewCount:45,description:"A beautifully embroidered A-line midi skirt with intricate floral motifs. Fully lined with a hidden side zipper.",material:"Cotton/Silk Blend",inStock:true,stockCount:12,tags:["skirt","embroidered","midi"],isNewArrival:true},
  {id:"12",name:"Canvas Sneakers",brand:"Artisan & Co.",category:"Shoes",subcategory:"Sneakers",price:135,images:["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600"],colors:[{name:"White",hex:"#FFFFFF"},{name:"Black",hex:"#000000"}],sizes:["38","39","40","41","42","43","44"],rating:4.3,reviewCount:178,description:"Minimalist canvas sneakers with vulcanized rubber sole. Features a cushioned insole and organic cotton laces.",material:"Organic Canvas, Natural Rubber",inStock:true,stockCount:55,tags:["sneakers","canvas","casual"],isBestSeller:true}
];

// Load shared products from localStorage (managed by `store-data.js`).
// This means the storefront and the admin area can read/write the same catalog data.
let products = getProducts();

const categories = [
  {name:"Men",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"},
  {name:"Women",image:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400"},
  {name:"Kids",image:"https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400"},
  {name:"Shoes",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"},
  {name:"Accessories",image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400"}
];

const heroSlides = [
  {title:"Spring Collection 2026",subtitle:"Effortless elegance for the new season",image:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",cta:"Shop Now"},
  {title:"The Essentials Edit",subtitle:"Timeless pieces, enduring quality",image:"https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200",cta:"Explore"},
  {title:"Up to 30% Off",subtitle:"Seasonal sale on selected styles",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",cta:"Shop Sale"}
];

// ===== STATE =====
// "State" means the values that can change while the user interacts with the app.
// When these values change, `render()` rebuilds the visible page to reflect the new state.
let cart = JSON.parse(localStorage.getItem('maison_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('maison_wishlist') || '[]');
const API_BASE_URL = 'http://localhost:5000/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api$/, '');
const CUSTOMER_TOKEN_KEY = 'maison_user_token';
const CUSTOMER_PROFILE_KEY = 'maison_user_profile';
let currentSlide = 0;
let heroInterval;
let currentPage = 'home';
let shopFilter = '';
let reviewPage = 1;
const REVIEWS_PER_PAGE = 5;
const reviewExpanded = {};
const reviewSelections = {};
const reviewCache = {};
let reviewProductId = '';
let currentUser = JSON.parse(localStorage.getItem(CUSTOMER_PROFILE_KEY) || 'null');
let productSyncInFlight = null;
let hasLoadedBackendProducts = false;
let cartSyncInFlight = null;
const reviewSyncInFlight = {};

function syncProductsAndCart() {
  // Pull the latest catalog from shared storage first.
  products = getProducts();
  const validIds = new Set(products.map(p => String(p.id)));

  // Clean the cart if products were removed or changed elsewhere.
  const cartBefore = cart.length;
  cart = cart.filter(i => i && validIds.has(String(i.id)));

  // Clean the wishlist for the same reason.
  const wishlistBefore = wishlist.length;
  wishlist = wishlist.filter(id => validIds.has(String(id)));

  // Only write back to storage if something actually changed.
  if (cart.length !== cartBefore || wishlist.length !== wishlistBefore) saveState();
}

// If admin changes products in another tab, reflect it in the storefront.
window.addEventListener('storage', (e) => {
  if (e.key === 'maison_products') {
    syncProductsAndCart();
    render();
  }
});

window.addEventListener('focus', () => {
  if (hasLoadedBackendProducts) {
    refreshProductsFromBackend({ rerender: true, silent: true });
  }
  if (currentUser) {
    refreshCartFromBackend({ rerender: true, silent: true });
  }
});

function saveState() {
  // Persist user-specific storefront data between refreshes.
  localStorage.setItem('maison_cart', JSON.stringify(cart));
  localStorage.setItem('maison_wishlist', JSON.stringify(wishlist));
  updateBadges();
}

function updateBadges() {
  // Cart badge shows total quantity, not just distinct product lines.
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cb = document.getElementById('cartBadge');
  const wb = document.getElementById('wishlistBadge');
  if (cb) { cb.textContent = cartCount; cb.style.display = cartCount > 0 ? 'flex' : 'none'; }
  if (wb) { wb.textContent = wishlist.length; wb.style.display = wishlist.length > 0 ? 'flex' : 'none'; }
}

function showToast(msg) {
  // Reusable feedback helper for fast UI messages without opening a modal.
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Small formatting helpers keep repeated UI logic out of the bigger render functions.
function stars(r) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)); }
function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr || '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str || '').replace(/[&<>"']/g, s => map[s]);
}

function resolveImageSrc(src) {
  const value = String(src || '').trim();
  if (!value) return '';
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
  if (value.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${value}`;
  if (value.startsWith('uploads/')) return `${BACKEND_ORIGIN}/${value}`;
  if (/^[a-zA-Z]:\\/.test(value) || value.includes('\\')) {
    const fileName = value.split(/[/\\]+/).pop();
    return fileName ? `assets/products/${fileName}` : value;
  }
  if (/^[^/\\]+\.(png|jpe?g|webp|gif|svg)$/i.test(value)) return `assets/products/${value}`;
  return value;
}

function getCustomerToken() {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY) || '';
}

function setCustomerSession(token, user) {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(user));
  currentUser = user;
}

function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_PROFILE_KEY);
  currentUser = null;
}

function isCustomerAuthed() {
  return Boolean(getCustomerToken() && currentUser);
}

async function storefrontApiRequest(path, options = {}) {
  const token = getCustomerToken();
  const headers = {
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

async function refreshProductsFromBackend({ rerender = false, silent = true } = {}) {
  if (productSyncInFlight) return productSyncInFlight;

  productSyncInFlight = (async () => {
    try {
      const data = await storefrontApiRequest('/products');
      if (!Array.isArray(data?.products)) {
        throw new Error('Invalid product response from backend');
      }

      // Keep the existing storefront helpers by syncing backend products into local storage.
      setProducts(data.products);
      hasLoadedBackendProducts = true;
      syncProductsAndCart();

      if (rerender) render();
      return data.products;
    } catch (error) {
      if (!silent) showToast(error.message || 'Could not load products from backend');
      return products;
    } finally {
      productSyncInFlight = null;
    }
  })();

  return productSyncInFlight;
}

function setCartFromBackend(items) {
  cart = Array.isArray(items)
    ? items.map((item) => ({
      cartItemId: String(item.cartItemId || ''),
      id: String(item.id || ''),
      size: String(item.size || ''),
      color: String(item.color || ''),
      qty: Number(item.qty || 0),
      price: Number(item.price || 0)
    }))
    : [];
  saveState();
}

async function refreshCartFromBackend({ rerender = false, silent = true } = {}) {
  if (!isCustomerAuthed()) return cart;
  if (cartSyncInFlight) return cartSyncInFlight;

  cartSyncInFlight = (async () => {
    try {
      const data = await storefrontApiRequest('/cart');
      setCartFromBackend(data.items || []);
      if (rerender) render();
      return cart;
    } catch (error) {
      if (!silent) showToast(error.message || 'Could not load your cart');
      return cart;
    } finally {
      cartSyncInFlight = null;
    }
  })();

  return cartSyncInFlight;
}

async function syncGuestCartToBackend() {
  if (!isCustomerAuthed()) return cart;
  const guestItems = Array.isArray(cart)
    ? cart.filter((item) => !item?.cartItemId).map((item) => ({
      productId: item.id,
      size: item.size,
      color: item.color,
      quantity: item.qty
    }))
    : [];

  if (!guestItems.length) {
    return refreshCartFromBackend({ rerender: false, silent: true });
  }

  const data = await storefrontApiRequest('/cart/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ items: guestItems })
  });

  setCartFromBackend(data.items || []);
  return cart;
}

function getCachedReviews(productId) {
  return reviewCache[String(productId)] || [];
}

async function refreshReviewsFromBackend(productId, { rerender = false, silent = true, force = false } = {}) {
  const pid = String(productId || '').trim();
  if (!pid) return [];
  if (!force && reviewSyncInFlight[pid]) return reviewSyncInFlight[pid];
  if (!force && Array.isArray(reviewCache[pid])) return reviewCache[pid];

  reviewSyncInFlight[pid] = (async () => {
    try {
      const data = await storefrontApiRequest(`/products/${pid}/reviews`);
      reviewCache[pid] = Array.isArray(data?.reviews) ? data.reviews : [];
      if (rerender) render();
      return reviewCache[pid];
    } catch (error) {
      if (!silent) showToast(error.message || 'Could not load reviews');
      reviewCache[pid] = reviewCache[pid] || [];
      return reviewCache[pid];
    } finally {
      delete reviewSyncInFlight[pid];
    }
  })();

  return reviewSyncInFlight[pid];
}

// ===== NAVIGATION =====
function navigate(page, filter) {
  // This is the heart of the single-page app approach:
  // instead of loading a new HTML file, we switch state and re-render the main content.
  currentPage = page;
  shopFilter = filter || '';
  window.scrollTo(0, 0);
  render();

  if (page === 'home' || page === 'shop' || page === 'product') {
    refreshProductsFromBackend({ rerender: true, silent: true });
  }
}

// ===== MOBILE NAV =====
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
});
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }

// ===== SEARCH =====
function toggleSearch(forceState) {
  // The search UI is an expandable inline control in the header.
  // We use a CSS class instead of direct inline styles so animation stays in CSS.
  const sb = document.getElementById('searchBar');
  const toggleBtn = document.getElementById('searchToggleBtn');
  if (!sb) return;

  const shouldOpen = typeof forceState === 'boolean'
    ? forceState
    : !sb.classList.contains('open');

  sb.classList.toggle('open', shouldOpen);
  sb.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  if (toggleBtn) toggleBtn.classList.toggle('active', shouldOpen);

  if (shouldOpen) document.getElementById('searchInput')?.focus();
}
function handleSearch(e) {
  // Enter submits the search by navigating to the shop page with the query as a filter.
  if (e.key === 'Enter') {
    const q = document.getElementById('searchInput').value.trim();
    navigate('shop', q);
    toggleSearch(false);
  } else if (e.key === 'Escape') {
    toggleSearch(false);
  }
}

document.addEventListener('click', (e) => {
  // Clicking outside the compact search field closes it, which matches common header search behavior.
  const sb = document.getElementById('searchBar');
  const toggleBtn = document.getElementById('searchToggleBtn');
  if (!sb || !sb.classList.contains('open')) return;
  if (sb.contains(e.target) || toggleBtn?.contains(e.target)) return;
  toggleSearch(false);
});

// ===== CART =====
async function addToCart(productId, size, color, qty) {
  // Find the product the user is trying to buy.
  const p = products.find(x => x.id === productId);
  if (!p) return;
  if (!p.inStock || p.stockCount <= 0) {
    showToast('This item is out of stock');
    return;
  }

  size = size || p.sizes[0];
  color = color || p.colors[0].name;

  const requestedQty = Math.max(1, qty || 1);
  const existing = cart.find(i => i.id === productId && i.size === size && i.color === color);
  // Stock is shared per product, not per variant (size/color).
  // So if one color/size is in the cart, it still counts against the same stock pool.
  const totalQtyForProduct = cart.reduce((s, i) => (i.id === productId ? s + i.qty : s), 0);
  const remainingStock = Math.max(0, p.stockCount - totalQtyForProduct);
  const addQty = Math.min(requestedQty, remainingStock);

  if (addQty <= 0) {
    showToast('Not enough stock available');
    return;
  }

  if (isCustomerAuthed()) {
    try {
      const data = await storefrontApiRequest('/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity: addQty
        })
      });
      setCartFromBackend(data.items || []);
      showToast(`${p.name} added to cart`);
      render();
    } catch (error) {
      showToast(error.message || 'Could not add item to cart');
    }
    return;
  }

  if (existing) existing.qty += addQty;
  else cart.push({ id: productId, size, color, qty: addQty, price: p.price });
  saveState();
  showToast(`${p.name} added to cart`);
}

async function removeFromCart(idx) {
  const item = cart[idx];
  if (!item) return;

  if (isCustomerAuthed() && item.cartItemId) {
    try {
      const data = await storefrontApiRequest(`/cart/items/${item.cartItemId}`, {
        method: 'DELETE'
      });
      setCartFromBackend(data.items || []);
      render();
    } catch (error) {
      showToast(error.message || 'Could not remove item from cart');
    }
    return;
  }

  cart.splice(idx, 1);
  saveState();
  render();
}
async function updateCartQty(idx, delta) {
  // Prevent quantity from dropping below 1.
  const item = cart[idx];
  if (!item) return;
  const nextQty = Math.max(1, item.qty + delta);

  if (isCustomerAuthed() && item.cartItemId) {
    try {
      const data = await storefrontApiRequest(`/cart/items/${item.cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: nextQty })
      });
      setCartFromBackend(data.items || []);
      render();
    } catch (error) {
      showToast(error.message || 'Could not update cart quantity');
    }
    return;
  }

  cart[idx].qty = nextQty;
  saveState(); render();
}

// ===== WISHLIST =====
function toggleWishlist(id) {
  // Wishlist is just an array of product IDs, so adding/removing stays simple.
  const idx = wishlist.indexOf(id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist'); }
  else { wishlist.push(id); showToast('Added to wishlist'); }
  saveState(); render();
}

// ===== PRODUCT CARD HTML =====
function productCardHTML(p) {
  // This helper returns reusable markup for any grid that displays products.
  // Reusing one card generator keeps home/shop/wishlist layouts visually consistent.
  const isWished = wishlist.includes(p.id);
  const priceHTML = p.discount
    ? `<span class="discount">Ksh ${p.price}</span> <span class="original">Ksh ${p.originalPrice}</span>`
    : `Ksh ${p.price}`;
  return `<div class="product-card" onclick="navigate('product','${p.id}')">
    <div class="product-card-img">
      <img src="${resolveImageSrc(p.images[0])}" alt="${p.name}" loading="lazy">
      <div class="product-badges">
        ${p.discount ? '<span class="badge-tag badge-sale">-' + p.discount + '%</span>' : ''}
        ${p.isNewArrival ? '<span class="badge-tag badge-new">New</span>' : ''}
      </div>
      <button class="product-wishlist-btn ${isWished ? 'active' : ''}" onclick="event.stopPropagation();toggleWishlist('${p.id}')">♥</button>
    </div>
    <div class="product-card-info">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${priceHTML}</div>
      <div class="product-rating"><span class="stars">${stars(p.rating)}</span> (${p.reviewCount})</div>
    </div>
  </div>`;
}

// ===== PAGE RENDERERS =====
function renderHome() {
  // Home is mostly a composition of filtered product groups and marketing sections.
  const featured = products.filter(p => p.isFeatured);
  const newArrivals = products.filter(p => p.isNewArrival);
  const bestSellers = products.filter(p => p.isBestSeller);

  return `
  <!-- Hero -->
  <section class="hero" id="hero">
    ${heroSlides.map((s, i) => `<div class="hero-slide ${i === currentSlide ? 'active' : ''}">
      <img src="${s.image}" alt="${s.title}"><div class="hero-overlay"></div>
    </div>`).join('')}
    <div class="hero-content"><div class="container"><div class="hero-text fade-in">
      <h1>${heroSlides[currentSlide].title}</h1>
      <p>${heroSlides[currentSlide].subtitle}</p>
      <button class="btn btn-accent btn-lg" onclick="navigate('shop')">${heroSlides[currentSlide].cta} →</button>
    </div></div></div>
    <div class="hero-dots">${heroSlides.map((_, i) => `<button class="hero-dot ${i === currentSlide ? 'active' : ''}" onclick="goSlide(${i})"></button>`).join('')}</div>
    <div class="hero-arrows"><button class="hero-prev" onclick="goSlide((currentSlide-1+3)%3)">‹</button><button class="hero-next" onclick="goSlide((currentSlide+1)%3)">›</button></div>
  </section>

  <!-- Categories -->
  <section class="section"><div class="container">
    <h2 style="text-align:center;font-size:28px;margin-bottom:32px">Shop by Category</h2>
    <div class="categories-grid">
      ${categories.map(c => `<div class="category-card" onclick="navigate('shop','${c.name}')">
        <img src="${c.image}" alt="${c.name}" loading="lazy"><div class="category-card-overlay"></div><span>${c.name}</span>
      </div>`).join('')}
    </div>
  </div></section>

  <!-- Featured -->
  <section class="section"><div class="container">
    <div class="section-header"><h2>Featured</h2><a href="#" class="view-all" onclick="navigate('shop')">View All →</a></div>
    <div class="product-grid">${featured.map(productCardHTML).join('')}</div>
  </div></section>

  <!-- Promo Banner -->
  <section class="section"><div class="container">
    <div class="promo-banner">
      <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200" alt="Sale">
      <div class="promo-banner-overlay"><div class="promo-banner-text">
        <div class="tag">Limited Time</div><h2>Seasonal Sale</h2><p>Up to 30% off selected styles</p>
        <button class="btn btn-accent" onclick="navigate('shop','Sale')">Shop Sale</button>
      </div></div>
    </div>
  </div></section>

  <!-- New Arrivals -->
  <section class="section"><div class="container">
    <div class="section-header"><h2>New Arrivals</h2><a href="#" class="view-all" onclick="navigate('shop')">View All →</a></div>
    <div class="product-grid">${newArrivals.map(productCardHTML).join('')}</div>
  </div></section>

  <!-- Best Sellers -->
  <section class="section"><div class="container">
    <div class="section-header"><h2>Best Sellers</h2><a href="#" class="view-all" onclick="navigate('shop')">View All →</a></div>
    <div class="product-grid">${bestSellers.map(productCardHTML).join('')}</div>
  </div></section>

  <!-- Newsletter -->
  <section class="newsletter">
    <h2>Stay in the Loop</h2>
    <p>Subscribe for early access to new collections, exclusive offers, and style inspiration.</p>
    <div class="newsletter-form"><input type="email" placeholder="Enter your email"><button class="btn btn-primary">Subscribe</button></div>
  </section>`;
}

function renderPrivacyPolicy() {
return `<section class="section"><div class="container">
    <div class="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>This is a simple privacy policy. We collect information only to improve your shopping experience and provide better service.</p>
    </div>
  </div></section>`;
}


function renderShop() {
  // Start with the full catalog, then reduce it based on category / sale / text search.
  let filtered = [...products];
  const filter = shopFilter;
  if (filter === 'Sale') filtered = filtered.filter(p => p.discount);
  else if (['Men','Women','Kids','Shoes','Accessories'].includes(filter)) filtered = filtered.filter(p => p.category === filter);
  else if (filter) filtered = filtered.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.brand.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase()));

  const title = filter || 'All Products';
  // Unique brands are extracted so the sidebar can build brand filters dynamically.
  const brandSet = [...new Set(products.map(p => p.brand))];

  return `<section class="section"><div class="container">
    <div class="shop-header">
      <h1>${title}</h1>
      <div style="display:flex;gap:12px;align-items:center">
        <button class="btn btn-outline btn-sm mobile-filter-btn" onclick="document.querySelector('.shop-sidebar').classList.toggle('open')">Filters</button>
        <span class="results-count">${filtered.length} products</span>
        <select class="sort-select" onchange="sortProducts(this.value)">
          <option>Sort by</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="newest">Newest</option><option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
    <div class="shop-layout">
      <aside class="shop-sidebar" id="shopSidebar">
        <div class="filter-group"><h4>Category</h4>
          ${['Men','Women','Kids','Shoes','Accessories'].map(c => `<label><input type="checkbox" ${filter===c?'checked':''} onchange="navigate('shop',this.checked?'${c}':'')"> ${c}</label>`).join('')}
        </div>
        <div class="filter-group"><h4>Brand</h4>
          ${brandSet.map(b => `<label><input type="checkbox" onchange="filterByBrand(this,'${b}')"> ${b}</label>`).join('')}
        </div>
        <div class="filter-group"><h4>On Sale</h4>
          <label><input type="checkbox" ${filter==='Sale'?'checked':''} onchange="navigate('shop',this.checked?'Sale':'')"> Sale items only</label>
        </div>
      </aside>
      <div>
        <div class="product-grid" id="productGrid">${filtered.map(productCardHTML).join('')}</div>
        ${filtered.length === 0 ? '<div class="empty-state"><h2>No products found</h2><p>Try adjusting your filters</p></div>' : ''}
      </div>
    </div>
  </div></section>`;
}

function renderProductDetail() {
  // On the product page, `shopFilter` is reused as the selected product ID.
  const p = products.find(x => x.id === shopFilter);
  if (!p) return '<div class="empty-state"><h2>Product not found</h2></div>';
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);

  return `<section><div class="container">
    <div class="product-detail">
      <div class="pd-gallery">
        <div class="pd-main-img"><img src="${resolveImageSrc(p.images[0])}" alt="${p.name}" id="pdMainImg"></div>
        <div class="pd-thumbs">${p.images.map((img, i) => `<div class="pd-thumb ${i === 0 ? 'active' : ''}" onclick="changePdImg('${String(img).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',this)"><img src="${resolveImageSrc(img)}" alt=""></div>`).join('')}</div>
      </div>
      <div class="pd-info">
        <div class="pd-brand">${p.brand}</div>
        <h1 class="pd-name">${p.name}</h1>
        <div class="pd-rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} (${p.reviewCount} reviews)</div>
        <div class="pd-price">
          Ksh ${p.price}
          ${p.originalPrice ? `<span class="original">Ksh ${p.originalPrice}</span><span class="save-tag">-${p.discount}%</span>` : ''}
        </div>
        <p class="pd-desc">${p.description}</p>

        <div class="pd-options"><h4>Color</h4>
          <div class="color-options">${p.colors.map((c, i) => `<div class="color-swatch ${i === 0 ? 'active' : ''}" style="background:${c.hex}" title="${c.name}" onclick="selectColor(this)"></div>`).join('')}</div>
        </div>
        <div class="pd-options"><h4>Size</h4>
          <div class="size-options">${p.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" onclick="selectSize(this)">${s}</button>`).join('')}</div>
        </div>

        <div class="qty-row">
          <span style="font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Quantity</span>
          <div class="qty-control">
            <button onclick="changeQty(-1)">−</button><span id="pdQty">1</span><button onclick="changeQty(1)">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail('${p.id}')">Add to Cart</button>
          <button class="btn btn-outline btn-lg" onclick="toggleWishlist('${p.id}')">${wishlist.includes(p.id) ? '♥ Wishlisted' : '♡ Wishlist'}</button>
        </div>

        <div class="stock-status ${p.stockCount < 15 ? 'low-stock' : 'in-stock'}">
          <span class="stock-dot"></span> ${p.stockCount < 15 ? 'Only ' + p.stockCount + ' left' : 'In Stock'}
        </div>

        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
          <p style="font-size:13px;color:var(--muted)"><strong>Material:</strong> ${p.material}</p>
          <p style="font-size:13px;color:var(--muted);margin-top:4px"><strong>Free shipping</strong> on orders over Ksh 200</p>
        </div>
      </div>
    </div>
    ${renderReviewsSection(p)}
    ${related.length ? `<div class="section"><div class="section-header"><h2>You May Also Like</h2></div><div class="product-grid">${related.map(productCardHTML).join('')}</div></div>` : ''}
  </div></section>`;
}

function renderCart() {
  // Empty-state pattern gives the user a clear next action instead of a blank page.
  if (cart.length === 0) return `<div class="empty-state"><h2>Your cart is empty</h2><p>Browse our collection and add items to your cart.</p><button class="btn btn-primary" onclick="navigate('shop')">Continue Shopping</button></div>`;

  // Totals are derived from cart contents each time the page is rendered.
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return `<section><div class="container">
    <h1 style="font-size:28px;margin:32px 0 24px">Shopping Cart</h1>
    <div class="cart-layout">
      <div>${cart.map((item, idx) => {
        const p = products.find(x => x.id === item.id);
        if (!p) return '';
        return `<div class="cart-item">
          <div class="cart-item-img"><img src="${resolveImageSrc(p.images[0])}" alt="${p.name}"></div>
          <div class="cart-item-info">
            <div class="cart-item-top">
              <div><div class="cart-item-brand">${p.brand}</div><div class="cart-item-name">${p.name}</div>
                <div class="cart-item-meta">Size: ${item.size} · Color: ${item.color}</div></div>
            </div>
            <div class="cart-item-bottom">
              <div class="qty-control"><button onclick="updateCartQty(${idx},-1)">−</button><span>${item.qty}</span><button onclick="updateCartQty(${idx},1)">+</button></div>
              <div class="cart-item-price">Ksh ${(item.price * item.qty).toFixed(2)}</div>
              <button class="remove-btn" onclick="removeFromCart(${idx})">Remove</button>
            </div>
          </div>
        </div>`;
      }).join('')}</div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>Ksh ${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : 'Ksh ' + shipping.toFixed(2)}</span></div>
        <div class="coupon-row"><input type="text" placeholder="Coupon code" id="couponInput"><button class="btn btn-outline btn-sm" onclick="applyCoupon()">Apply</button></div>
        <div class="summary-row total"><span>Total</span><span>Ksh ${total.toFixed(2)}</span></div>
        <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="navigate('checkout')">Proceed to Checkout</button>
        <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="navigate('shop')">Continue Shopping</button>
      </div>
    </div>
  </div></section>`;
}

function renderCheckout() {
  // The checkout shell starts at step 1.
  // Later steps are swapped into `#checkoutContent` by `checkoutStep()`.
  if (!isCustomerAuthed()) {
    return `<section class="checkout-layout">
      <div class="empty-state">
        <h2>Sign in to continue checkout</h2>
        <p>Your cart is ready. Sign in or create an account so we can attach the order to your profile.</p>
        <button class="btn btn-primary" onclick="navigate('account')">Go to Account</button>
      </div>
    </section>`;
  }

  const [firstName = '', ...restName] = String(currentUser?.fullName || '').trim().split(/\s+/);
  const lastName = restName.join(' ');

  return `<section class="checkout-layout">
    <div class="checkout-steps">
      <div class="checkout-step active" id="step1">1. Shipping</div>
      <div class="checkout-step" id="step2">2. Delivery</div>
      <div class="checkout-step" id="step3">3. Payment</div>
      <div class="checkout-step" id="step4">4. Review</div>
    </div>
    <div id="checkoutContent">
      <h2 style="margin-bottom:20px">Shipping Address</h2>
      <div class="form-row"><div class="form-group"><label>First Name</label><input type="text" id="checkoutFirstName" placeholder="John" value="${escapeHtml(checkoutForm.firstName || firstName)}"></div><div class="form-group"><label>Last Name</label><input type="text" id="checkoutLastName" placeholder="Doe" value="${escapeHtml(checkoutForm.lastName || lastName)}"></div></div>
      <div class="form-group"><label>Email</label><input type="email" id="checkoutEmail" placeholder="john@example.com" value="${escapeHtml(checkoutForm.email || currentUser?.email || '')}"></div>
      <div class="form-group"><label>Address</label><input type="text" id="checkoutAddress" placeholder="123 Main St"></div>
      <div class="form-row"><div class="form-group"><label>City</label><input type="text" id="checkoutCity" placeholder="New York"></div><div class="form-group"><label>Zip Code</label><input type="text" id="checkoutZip" placeholder="10001"></div></div>
      <div class="form-group"><label>Country</label><select id="checkoutCountry"><option>United States</option><option>Canada</option><option>United Kingdom</option></select></div>
      <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="checkoutStep(2)">Continue to Delivery</button>
    </div>
  </section>`;
}

let checkoutStepNum = 1;
let checkoutForm = {
  // This object keeps user-entered checkout data alive while the step content is being replaced.
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  zipCode: '',
  country: 'United States',
  deliveryMethod: 'Standard',
  deliveryPrice: 0,
  mpesaPhone: ''
};
function checkoutStep(step) {
  // Move the UI to the selected step and update the step indicator bar.
  checkoutStepNum = step;
  const content = document.getElementById('checkoutContent');
  document.querySelectorAll('.checkout-step').forEach((el, i) => {
    el.className = 'checkout-step' + (i + 1 < step ? ' done' : '') + (i + 1 === step ? ' active' : '');
  });

  if (step === 2) {
    // Capture shipping form data before replacing the HTML.
    // Without this, changing step would wipe the user's typed values.
    const firstNameEl = document.getElementById('checkoutFirstName');
    const lastNameEl = document.getElementById('checkoutLastName');
    const emailEl = document.getElementById('checkoutEmail');
    const addressEl = document.getElementById('checkoutAddress');
    const cityEl = document.getElementById('checkoutCity');
    const zipEl = document.getElementById('checkoutZip');
    const countryEl = document.getElementById('checkoutCountry');
    checkoutForm.firstName = firstNameEl ? firstNameEl.value.trim() : checkoutForm.firstName;
    checkoutForm.lastName = lastNameEl ? lastNameEl.value.trim() : checkoutForm.lastName;
    checkoutForm.email = emailEl ? emailEl.value.trim() : checkoutForm.email;
    checkoutForm.address = addressEl ? addressEl.value.trim() : checkoutForm.address;
    checkoutForm.city = cityEl ? cityEl.value.trim() : checkoutForm.city;
    checkoutForm.zipCode = zipEl ? zipEl.value.trim() : checkoutForm.zipCode;
    checkoutForm.country = countryEl ? countryEl.value : checkoutForm.country;

    // Default delivery selection.
    checkoutForm.deliveryMethod = 'Standard';
    checkoutForm.deliveryPrice = 0;

    content.innerHTML = `<h2 style="margin-bottom:20px">Delivery Method</h2>
      <div class="delivery-option selected" data-method="Standard" data-price="0" onclick="selectDelivery(this)"><input type="radio" name="delivery" checked> <div><strong>Standard (5-7 days)</strong><br><span style="font-size:13px;color:var(--muted)">Free on orders over Ksh 200</span></div><span style="margin-left:auto;font-weight:600">FREE</span></div>
      <div class="delivery-option" data-method="Express" data-price="15" onclick="selectDelivery(this)"><input type="radio" name="delivery"> <div><strong>Express (2-3 days)</strong></div><span style="margin-left:auto;font-weight:600">Ksh 15.00</span></div>
      <div class="delivery-option" data-method="Next Day" data-price="25" onclick="selectDelivery(this)"><input type="radio" name="delivery"> <div><strong>Next Day</strong></div><span style="margin-left:auto;font-weight:600">Ksh 25.00</span></div>
      <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="checkoutStep(3)">Continue to Payment</button>`;
  } else if (step === 3) {
    content.innerHTML = `<h2 style="margin-bottom:20px">M-Pesa Payment</h2>
      <div class="checkout-mpesa checkout-mpesa-panel">
        <div class="checkout-mpesa-head">
          <div class="checkout-mpesa-mark" aria-hidden="true">
            <span class="checkout-mpesa-mark-dot"></span>
            <span class="checkout-mpesa-mark-text">M-PESA</span>
          </div>
          <div>
            <div class="checkout-mpesa-badge">Safaricom M-Pesa</div>
            <div class="checkout-mpesa-title">Pay with M-Pesa</div>
            <div class="checkout-mpesa-note">Enter your number in the format <strong>2547XXXXXXXX</strong> to receive the STK push on your phone.</div>
          </div>
        </div>
        <div class="form-group checkout-mpesa-field" style="margin-top:14px">
          <label>Phone Number</label>
          <input type="tel" id="mpesaPhone" pattern="2547[0-9]{8}" placeholder="2547XXXXXXXX" maxlength="12" value="${escapeHtml(checkoutForm.mpesaPhone || '')}">
        </div>
        <div class="checkout-mpesa-tip">Use the Safaricom number that will accept the payment prompt on your phone.</div>
        <button class="mpesa-pay-btn" type="button" onclick="continueCheckoutWithMpesa()">
          <span class="mpesa-pay-label">Continue to Review</span>
        </button>
        <div id="mpesaSpinner" class="mpesa-spinner" style="display:none">
          <div class="spinner-dot"></div>
          <div class="mpesa-spinner-text">Saving your M-Pesa number...</div>
        </div>
      </div>`;
    return; /*
      <div class="checkout-mpesa">
        <div class="checkout-mpesa-head">
          <div>
            <div class="checkout-mpesa-title">M-Pesa (Placeholder)</div>
            <div class="checkout-mpesa-note">Enter number in format <strong>2547XXXXXXXX</strong>. This is UI-only; backend will be added later.</div>
          </div>
        </div>
        <div class="form-group" style="margin-top:12px">
          <label>Mobile Number</label>
          <input type="tel" id="mpesaPhone" pattern="2547[0-9]{8}" placeholder="2547XXXXXXXX" maxlength="12">
        </div>
        <button class="btn btn-outline btn-sm" type="button" onclick="startMpesaStub()">Request STK (Demo)</button>
        <div id="mpesaSpinner" class="mpesa-spinner" style="display:none">
          <div class="spinner-dot"></div>
          <div class="mpesa-spinner-text">Fetching payment, please wait…</div>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="checkoutStep(4)">Review Order</button>`;
  */ } else if (step === 4) {
    // Review step recomputes totals so the user sees the current shipping choice reflected.
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = (checkoutForm && Number.isFinite(checkoutForm.deliveryPrice))
      ? checkoutForm.deliveryPrice
      : (subtotal > 200 ? 0 : 15);
    const total = subtotal + shipping;
    content.innerHTML = `<h2 style="margin-bottom:20px">Order Review</h2>
      ${cart.map(i => { const p = products.find(x => x.id === i.id); return p ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:14px"><span>${p.name} × ${i.qty}</span><span>Ksh ${(i.price*i.qty).toFixed(2)}</span></div>` : ''; }).join('')}
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : 'Ksh ' + shipping.toFixed(2)}</span></div>
      <div class="summary-row total" style="margin-top:16px"><span>Total</span><span>Ksh ${total.toFixed(2)}</span></div>
      <button class="btn btn-accent btn-lg" style="width:100%;margin-top:20px" onclick="placeOrder()">Place Order & Send STK Push</button>`;
  }
}

async function placeOrder() {
  // Pull the latest product data one more time before finalizing the order.
  // This helps protect against stale stock information.
  if (!isCustomerAuthed()) {
    showToast('Sign in to place your order');
    navigate('account');
    return;
  }

  syncProductsAndCart();
  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = (checkoutForm && Number.isFinite(checkoutForm.deliveryPrice))
    ? checkoutForm.deliveryPrice
    : (subtotal > 200 ? 0 : 15);

  // Prevent ordering out-of-stock items.
  // This validation happens again here even if the cart was valid earlier.
  for (const item of cart) {
    const p = products.find(x => x.id === item.id);
    if (!p || !p.inStock || p.stockCount < item.qty) {
      showToast(`"${p ? p.name : 'Item'}" is out of stock`);
      return;
    }
  }

  try {
    const paymentMethod = 'mpesa_stk';
    const mpesaPhone = checkoutForm.mpesaPhone || '';
    if (!/^2547\d{8}$/.test(mpesaPhone)) {
      showToast('Enter phone as 2547XXXXXXXX');
      checkoutStep(3);
      return;
    }

    const data = await storefrontApiRequest('/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: checkoutForm.firstName,
        lastName: checkoutForm.lastName,
        email: checkoutForm.email,
        address: checkoutForm.address,
        city: checkoutForm.city,
        zipCode: checkoutForm.zipCode,
        country: checkoutForm.country,
        deliveryMethod: checkoutForm.deliveryMethod,
        shippingAmount: shipping,
        paymentMethod,
        phone: mpesaPhone,
        mpesaPhone
      })
    });

    const order = data?.order || {};
    const orderId = order?.id;
    let stkData = null;
    let stkError = '';

    if (orderId) {
      try {
        stkData = await storefrontApiRequest(`/payments/orders/${orderId}/mpesa/stkpush`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: mpesaPhone
          })
        });
      } catch (error) {
        stkError = error.message || 'Could not send the M-Pesa prompt';
      }
    } else {
      stkError = 'Order was created but no order id was returned for M-Pesa processing.';
    }

    cart = [];
    saveState();
    await refreshCartFromBackend({ rerender: false, silent: true });
    await refreshProductsFromBackend({ rerender: false, silent: true });

    const orderNum = order?.orderNum || 'MSN-PENDING';
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;

    if (stkData) {
      const customerMessage = stkData?.providerResponse?.customerMessage || `Check your phone ${mpesaPhone} to complete the payment.`;
      checkoutContent.innerHTML = `<div class="order-confirmed">
        <h1>Order Created</h1><p>Your order was placed and the M-Pesa STK push has been sent.</p>
        <div class="order-number">${orderNum}</div>
        <p style="color:var(--muted);font-size:14px;margin-top:12px">${escapeHtml(customerMessage)}</p>
        <button class="btn btn-primary" style="margin-top:24px" onclick="navigate('home')">Continue Shopping</button>
      </div>`;
      return;
    }

    checkoutContent.innerHTML = `<div class="order-confirmed">
      <h1>Order Created</h1><p>Your order was saved, but the M-Pesa prompt was not sent yet.</p>
      <div class="order-number">${orderNum}</div>
      <p style="color:var(--muted);font-size:14px;margin-top:12px">${escapeHtml(stkError || 'Please retry the STK push after confirming your Daraja setup.')}</p>
      <button class="btn btn-primary" style="margin-top:24px" onclick="navigate('home')">Continue Shopping</button>
    </div>`;
  } catch (error) {
    showToast(error.message || 'Could not place your order');
  }
}

function renderWishlist() {
  // Wishlist reuses the same product cards instead of inventing a special layout.
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0) return `<div class="empty-state"><h2>Your wishlist is empty</h2><p>Save items you love for later.</p><button class="btn btn-primary" onclick="navigate('shop')">Browse Products</button></div>`;
  return `<section class="section"><div class="container"><h1 style="font-size:28px;margin-bottom:24px">Wishlist (${items.length})</h1><div class="product-grid">${items.map(productCardHTML).join('')}</div></div></section>`;
}

function renderReviewsPage() {
  // This is a dedicated "all reviews" page with pagination.
  // It exists separately so the product page stays compact even when many reviews exist.
  const pid = shopFilter || reviewProductId;
  const product = products.find(p => p.id === pid);
  if (!product) return '<div class="empty-state"><h2>Product not found</h2></div>';

  const reviews = getCachedReviews(pid);
  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  reviewPage = Math.min(Math.max(1, reviewPage), totalPages);
  const start = (reviewPage - 1) * REVIEWS_PER_PAGE;
  const visible = reviews.slice(start, start + REVIEWS_PER_PAGE);

  // Build a compact pagination window instead of showing every page button forever.
  const pageButtons = [];
  const maxBtns = 7;
  const half = Math.floor(maxBtns / 2);
  let btnStart = Math.max(1, reviewPage - half);
  let btnEnd = Math.min(totalPages, btnStart + maxBtns - 1);
  btnStart = Math.max(1, btnEnd - maxBtns + 1);
  for (let i = btnStart; i <= btnEnd; i++) {
    pageButtons.push(`<button class="pager-btn ${i === reviewPage ? 'active' : ''}" onclick="setReviewPage(${i})">${i}</button>`);
  }

  const pagination = reviews.length > REVIEWS_PER_PAGE ? `
    <div class="review-pagination">
      <button class="pager-btn" ${reviewPage === 1 ? 'disabled' : ''} onclick="setReviewPage(1)">|&lt;</button>
      <button class="pager-btn" ${reviewPage === 1 ? 'disabled' : ''} onclick="setReviewPage(${reviewPage - 1})">&lt;</button>
      ${pageButtons.join('')}
      <button class="pager-btn" ${reviewPage === totalPages ? 'disabled' : ''} onclick="setReviewPage(${reviewPage + 1})">&gt;</button>
      <button class="pager-btn" ${reviewPage === totalPages ? 'disabled' : ''} onclick="setReviewPage(${totalPages})">&gt;|</button>
    </div>` : '';

  return `<section class="reviews-page">
    <div class="container">
      <div class="reviews-header">
        <button class="back-link" onclick="navigate('product','${pid}')">&#8592; Back to ${product.name}</button>
        <div>
          <div class="pd-brand">${product.brand}</div>
          <h1>Customer Reviews (${reviews.length})</h1>
        </div>
      </div>
      ${reviews.length === 0 ? '<div class="empty-state"><h2>No reviews yet</h2><p>Be the first to leave feedback after your delivery.</p></div>' : `
        <div class="review-list-full">
          ${visible.map(r => `
            <div class="review-card review-card-full">
              <div class="review-card-top">
                <div>
                  <div class="stars">${stars(r.rating)}</div>
                  <div class="reviewer">${escapeHtml(r.name || 'Customer')}</div>
                  <div class="review-date">${formatDateShort(r.date)}</div>
                </div>
                ${r.verified ? '<span class="verified-badge">Verified Purchase</span>' : ''}
              </div>
              <p class="review-message">${escapeHtml(r.message)}</p>
            </div>
          `).join('')}
        </div>
        ${pagination}
      `}
    </div>
  </section>`;
}

function renderAccount() {
  // Account now talks to the backend auth endpoints instead of only showing placeholder toasts.
  if (currentUser) {
    return `<section class="account-layout">
      <div class="auth-form auth-form-logged-in">
        <div class="account-badge">Signed In</div>
        <h2>Welcome, ${escapeHtml(currentUser.fullName || 'Customer')}</h2>
        <p class="account-copy">Your storefront account is now connected to the backend.</p>
        <div class="account-summary">
          <div class="account-summary-row"><span>Name</span><strong>${escapeHtml(currentUser.fullName || '-')}</strong></div>
          <div class="account-summary-row"><span>Email</span><strong>${escapeHtml(currentUser.email || '-')}</strong></div>
          <div class="account-summary-row"><span>Role</span><strong>${escapeHtml(currentUser.role || 'customer')}</strong></div>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="handleCustomerSignOut()">Sign Out</button>
      </div>
    </section>`;
  }

  return `<section class="account-layout">
    <div class="auth-form">
      <h2>Welcome Back</h2>
      <div class="auth-tabs"><div class="auth-tab active" onclick="switchAuthTab(this,'login')">Sign In</div><div class="auth-tab" onclick="switchAuthTab(this,'signup')">Sign Up</div></div>
      <div id="authContent">
        <div class="form-group"><label>Email</label><input id="customerLoginEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
        <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••"></div>
        <button class="btn btn-primary" style="width:100%" onclick="showToast('Login functionality — connect to your backend!')">Sign In</button>
      </div>
    </div>
  </section>`;
}

// ===== HELPERS =====
function selectDelivery(el) {
  // Mark the chosen delivery option in the UI and store it for later total calculations.
  document.querySelectorAll('.delivery-option').forEach(e => { e.classList.remove('selected'); e.querySelector('input').checked = false; });
  el.classList.add('selected'); el.querySelector('input').checked = true;

  // Persist delivery selection so step 4 + order placement can use it.
  checkoutForm.deliveryMethod = el.dataset.method || 'Standard';
  const price = Number(el.dataset.price);
  checkoutForm.deliveryPrice = Number.isFinite(price) ? price : 0;
}

function selectSize(el) {
  // Only one size should look selected at a time.
  el.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function selectColor(el) {
  // Same pattern as sizes, but for the color swatches.
  el.parentElement.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function changePdImg(src, thumb) {
  // Swap the main product image when the user clicks a thumbnail.
  document.getElementById('pdMainImg').src = resolveImageSrc(src);
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function renderReviewsSection(p) {
  // Product page review section shows a summary + only the first few reviews.
  // The full list is moved to the dedicated reviews page when there are many.
  const reviews = getCachedReviews(p.id);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length) : p.rating;
  const dist = [5, 4, 3, 2, 1].map(star => reviews.filter(r => Math.round(r.rating) === star).length);
  const total = reviews.length || 1;
  const visible = reviews.slice(0, 3);
  const defaultName = currentUser?.fullName || '';
  const defaultEmail = currentUser?.email || '';

  return `<section class="review-section" id="reviews-${p.id}">
    <div class="section-header" style="align-items:flex-start">
      <h2>Customer Feedback</h2>
      ${reviews.length > 3 ? `<button class="view-all" onclick="goToReviews('${p.id}')">View all (${reviews.length}) -></button>` : ''}
    </div>
    <div class="review-grid">
      <div class="review-summary">
        <div class="review-score">
          <div class="score-number">${avg.toFixed(1)}</div>
          <div class="score-stars">${stars(avg)}</div>
          <div class="score-count">${reviews.length || p.reviewCount} ratings</div>
        </div>
        <div class="review-bars">
          ${[5,4,3,2,1].map((star, idx) => {
            const count = dist[idx];
            const pct = Math.round((count / total) * 100);
            return `<div class="rating-row"><span>${star}★</span><div class="rating-bar"><span style="width:${pct}%"></span></div><span class="rating-count">${count}</span></div>`;
          }).join('')}
        </div>
        <div class="review-note">Writing a review is limited to verified delivered orders of this product.</div>
      </div>

      <div class="review-list">
        ${visible.length ? visible.map(r => `
          <div class="review-card">
            <div class="review-card-top">
              <div>
                <div class="stars">${stars(r.rating)}</div>
                <div class="reviewer">${escapeHtml(r.name || 'Customer')}</div>
                <div class="review-date">${formatDateShort(r.date)}</div>
              </div>
              ${r.verified ? '<span class="verified-badge">Verified Purchase</span>' : ''}
            </div>
            <p class="review-message">${escapeHtml(r.message)}</p>
          </div>
        `).join('') : '<div class="empty-state" style="padding:24px">No reviews yet — be the first after your delivery.</div>'}
      </div>
    </div>

    <div class="review-form">
      <h3>Write a Review</h3>
      <p class="review-form-note">Only customers with a delivered order for this item can submit.</p>
      <div class="form-row">
        <div class="form-group"><label>Name</label><input id="revName-${p.id}" type="text" placeholder="Your name" value="${escapeHtml(defaultName)}"></div>
        <div class="form-group"><label>Email used for the order</label><input id="revEmail-${p.id}" type="email" placeholder="you@example.com" value="${escapeHtml(defaultEmail)}"></div>
      </div>
      <div class="form-group">
        <label>Rating</label>
        <div class="rating-picker" id="revRating-${p.id}">
          ${[1,2,3,4,5].map(v => `<button type="button" class="rating-star" data-pid="${p.id}" data-val="${v}" onclick="selectReviewRating('${p.id}',${v})">★</button>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label>Message</label>
        <textarea id="revMsg-${p.id}" rows="3" placeholder="Share details about fit, quality, or delivery experience"></textarea>
      </div>
      <button class="btn btn-primary" onclick="submitReview('${p.id}')">Submit Review</button>
    </div>
  </section>`;
}
function renderPrivacyPolicy() {
  // Static content page with scrollable text.
  return `<section class="privacy-policy"><div class="container"><h1>Privacy Policy</h1><p>Your privacy is important to us. We do not sell your data. For more details, please contact our support.</p></div></section>`;
}

function goToReviews(productId) {
  // Store which product's reviews we want, reset pagination, then navigate.
  reviewProductId = productId;
  reviewPage = 1;
  navigate('reviews', productId);
}

function setReviewPage(page) {
  // Pagination just changes state and re-renders.
  reviewPage = page;
  render();
}

function selectReviewRating(productId, value) {
  // Visually fill all stars up to the chosen one.
  reviewSelections[productId] = value;
  document.querySelectorAll(`.rating-star[data-pid="${productId}"]`).forEach(btn => {
    const v = Number(btn.dataset.val);
    btn.classList.toggle('active', v <= value);
  });
}

async function submitReview(productId) {
  // Gather and validate the review form inputs.
  const nameEl = document.getElementById(`revName-${productId}`);
  const emailEl = document.getElementById(`revEmail-${productId}`);
  const msgEl = document.getElementById(`revMsg-${productId}`);
  const rating = reviewSelections[productId] || 0;

  const name = nameEl?.value.trim() || 'Customer';
  const email = emailEl?.value.trim();
  const message = msgEl?.value.trim();

  if (!email || !message || rating === 0) {
    showToast('Add name, email, rating, and message');
    return;
  }

  if (!isCustomerAuthed()) {
    showToast('Sign in to submit a review');
    navigate('account');
    return;
  }

  if (currentUser?.email && String(currentUser.email).toLowerCase() !== String(email).toLowerCase()) {
    showToast('Use the signed-in account email to submit your review');
    return;
  }

  try {
    await storefrontApiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating,
        message,
        name
      })
    });

    reviewSelections[productId] = 0;
    await refreshReviewsFromBackend(productId, { rerender: false, silent: false, force: true });
    await refreshProductsFromBackend({ rerender: false, silent: true });
    showToast('Thank you for your review!');
    render();
  } catch (error) {
    showToast(error.message || 'Could not submit your review');
  }
}

let pdQty = 1;
function changeQty(d) {
  // Product detail quantity selector should never go below 1.
  pdQty = Math.max(1, pdQty + d);
  const el = document.getElementById('pdQty');
  if (el) el.textContent = pdQty;
}

function addToCartFromDetail(id) {
  // Read the currently selected size/color from the DOM, then reuse the main cart function.
  const sizeEl = document.querySelector('.size-btn.active');
  const colorEl = document.querySelector('.color-swatch.active');
  const size = sizeEl ? sizeEl.textContent : '';
  const color = colorEl ? colorEl.title : '';
  addToCart(id, size, color, pdQty);
  pdQty = 1;
}

function applyCoupon() {
  // Placeholder logic for now: this teaches the UI flow without calculating real discounts yet.
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (code === 'SAVE10' || code === 'SAVE20') showToast('Coupon applied! Connect to backend for real discounts.');
  else showToast('Invalid coupon code');
}

function continueCheckoutWithMpesa() {
  const phoneInput = document.getElementById('mpesaPhone');
  const spinner = document.getElementById('mpesaSpinner');
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!/^2547\d{8}$/.test(phone)) {
    showToast('Enter phone as 2547XXXXXXXX');
    return;
  }

  checkoutForm.mpesaPhone = phone;
  if (spinner) spinner.style.display = 'flex';
  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    checkoutStep(4);
  }, 700);
}

function startMpesaStub() {
  // Demo-only payment interaction.
  // It validates the number format and shows a loading spinner to simulate a real request.
  const phoneInput = document.getElementById('mpesaPhone');
  const spinner = document.getElementById('mpesaSpinner');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  if (!/^2547\d{8}$/.test(phone)) {
    showToast('Enter phone as 2547XXXXXXXX');
    return;
  }
  if (spinner) spinner.style.display = 'flex';
  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    showToast('Demo only – real M-Pesa will be wired after backend is ready.');
  }, 2000);
}

function sortProducts(val) {
  // Sorting updates only the visible grid instead of navigating away or reloading the page.
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  let items = [...products];
  if (shopFilter === 'Sale') items = items.filter(p => p.discount);
  else if (['Men','Women','Kids','Shoes','Accessories'].includes(shopFilter)) items = items.filter(p => p.category === shopFilter);

  if (val === 'price-asc') items.sort((a,b) => a.price - b.price);
  else if (val === 'price-desc') items.sort((a,b) => b.price - a.price);
  else if (val === 'rating') items.sort((a,b) => b.rating - a.rating);
  else if (val === 'newest') items.sort((a,b) => (b.isNewArrival?1:0) - (a.isNewArrival?1:0));
  grid.innerHTML = items.map(productCardHTML).join('');
}

function filterByBrand(cb, brand) {
  // Simple brand filter implementation: checked means navigate to that brand name as a text filter.
  if (cb.checked) navigate('shop', brand);
  else navigate('shop', '');
}

function getLoginAuthMarkup() {
  return `<div class="form-group"><label>Email</label><input id="customerLoginEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
    <div class="form-group"><label>Password</label><input id="customerLoginPassword" type="password" placeholder="Password" autocomplete="current-password"></div>
    <button class="btn btn-primary" style="width:100%" onclick="handleCustomerLogin()">Sign In</button>`;
}

function getSignupAuthMarkup() {
  return `<div class="form-group"><label>Full Name</label><input id="customerSignupName" type="text" placeholder="John Doe" autocomplete="name"></div>
    <div class="form-group"><label>Email</label><input id="customerSignupEmail" type="email" placeholder="you@example.com" autocomplete="email"></div>
    <div class="form-group"><label>Password</label><input id="customerSignupPassword" type="password" placeholder="Create a password" autocomplete="new-password"></div>
    <button class="btn btn-primary" style="width:100%" onclick="handleCustomerRegister()">Create Account</button>`;
}

function hydrateAccountForm() {
  const content = document.getElementById('authContent');
  if (!content || currentUser) return;
  content.innerHTML = getLoginAuthMarkup();
}

function switchAuthTab(el, type) {
  // This swaps the inner auth form without needing a separate page.
  el.parentElement.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const c = document.getElementById('authContent');
  if (type === 'signup') {
    c.innerHTML = getSignupAuthMarkup();
    return;
  }

  c.innerHTML = getLoginAuthMarkup();
  return;

  if (type === 'signup') {
    c.innerHTML = `<div class="form-group"><label>Full Name</label><input type="text" placeholder="John Doe"></div>
      <div class="form-group"><label>Email</label><input type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" style="width:100%" onclick="showToast('Signup — connect to your backend!')">Create Account</button>`;
  } else {
    c.innerHTML = `<div class="form-group"><label>Email</label><input type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary" style="width:100%" onclick="showToast('Login — connect to your backend!')">Sign In</button>`;
  }
}

async function handleCustomerLogin() {
  const email = document.getElementById('customerLoginEmail')?.value.trim();
  const password = document.getElementById('customerLoginPassword')?.value;

  if (!email || !password) {
    showToast('Email and password are required');
    return;
  }

  try {
    const data = await storefrontApiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (data?.user?.role === 'admin') {
      showToast('Admin accounts should use the admin portal');
      return;
    }

    setCustomerSession(data.token, data.user);
    await syncGuestCartToBackend();
    await refreshCartFromBackend({ rerender: false, silent: true });
    showToast('Signed in successfully');
    render();
  } catch (error) {
    showToast(error.message || 'Login failed');
  }
}

async function handleCustomerRegister() {
  const fullName = document.getElementById('customerSignupName')?.value.trim();
  const email = document.getElementById('customerSignupEmail')?.value.trim();
  const password = document.getElementById('customerSignupPassword')?.value;

  if (!fullName || !email || !password) {
    showToast('Full name, email, and password are required');
    return;
  }

  try {
    const data = await storefrontApiRequest('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password })
    });

    setCustomerSession(data.token, data.user);
    await syncGuestCartToBackend();
    await refreshCartFromBackend({ rerender: false, silent: true });
    showToast('Account created successfully');
    render();
  } catch (error) {
    showToast(error.message || 'Registration failed');
  }
}

function handleCustomerSignOut() {
  clearCustomerSession();
  cart = [];
  saveState();
  showToast('Signed out');
  render();
}

function goSlide(i) {
  // Hero slider updates both the active image and the matching dot indicator.
  currentSlide = i;
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  const text = document.querySelector('.hero-text');
  if (text) {
    text.querySelector('h1').textContent = heroSlides[i].title;
    text.querySelector('p').textContent = heroSlides[i].subtitle;
    text.querySelector('button').textContent = heroSlides[i].cta + ' →';
  }
}

// ===== MAIN RENDER =====
function render() {
  // This is the central repaint function for the whole app.
  // It checks the current state, decides which page renderer to call,
  // replaces the `#app` contents, and refreshes any UI that depends on state.
  syncProductsAndCart();
  const app = document.getElementById('app');
  checkoutStepNum = 1;
  pdQty = 1;
  if (currentPage === 'home') app.innerHTML = renderHome();
  else if (currentPage === 'shop') app.innerHTML = renderShop();
  else if (currentPage === 'product') app.innerHTML = renderProductDetail();
  else if (currentPage === 'cart') app.innerHTML = renderCart();
  else if (currentPage === 'checkout') app.innerHTML = renderCheckout();
  else if (currentPage === 'wishlist') app.innerHTML = renderWishlist();
  else if (currentPage === 'reviews') app.innerHTML = renderReviewsPage();
  else if (currentPage === 'account') app.innerHTML = renderAccount();
  else if (currentPage === 'PrivacyPolicy') app.innerHTML = renderPrivacyPolicy();
  
  if (currentPage === 'account') {
    hydrateAccountForm();
  }

  updateBadges();

  if (currentPage === 'product' && shopFilter) {
    refreshReviewsFromBackend(shopFilter, { rerender: true, silent: true });
  } else if (currentPage === 'reviews' && (shopFilter || reviewProductId)) {
    refreshReviewsFromBackend(shopFilter || reviewProductId, { rerender: true, silent: true });
  }

  // Restart hero slider
  clearInterval(heroInterval);
  if (currentPage === 'home') {
    heroInterval = setInterval(() => goSlide((currentSlide + 1) % heroSlides.length), 5000);
  }
}

// Init
render();
refreshProductsFromBackend({ rerender: true, silent: true });
if (currentUser) {
  refreshCartFromBackend({ rerender: true, silent: true });
}
