// Shared data layer for storefront + admin dashboard.
// Uses localStorage (frontend-only demo).
(() => {
  const LS_PRODUCTS = 'maison_products';
  const LS_ORDERS = 'maison_orders';
  const LS_REVIEWS = 'maison_reviews';

  // ===== Seed data (moved from app.js) =====
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

  const initialOrders = [
    {orderNum:"ORD-1001",customer:{name:"Emma Johnson",email:"emma@example.com"},date:"2026-03-20",items:[],subtotal:289,shipping:15,total:289+15,status:"delivered"},
    {orderNum:"ORD-1002",customer:{name:"James Smith",email:"james@example.com"},date:"2026-03-22",items:[],subtotal:450,shipping:15,total:450+15,status:"shipped"},
    {orderNum:"ORD-1003",customer:{name:"Sophie Chen",email:"sophie@example.com"},date:"2026-03-24",items:[],subtotal:620,shipping:0,total:620,status:"confirmed"},
    {orderNum:"ORD-1004",customer:{name:"Michael Brown",email:"michael@example.com"},date:"2026-03-25",items:[],subtotal:375,shipping:0,total:375,status:"pending"},
    {orderNum:"ORD-1005",customer:{name:"Lisa Wang",email:"lisa@example.com"},date:"2026-03-18",items:[],subtotal:89,shipping:0,total:89,status:"cancelled"},

    // Extra sample orders to make the dashboard feel populated
    {orderNum:"ORD-0951",customer:{name:"Emma Johnson",email:"emma@example.com"},date:"2026-02-10",items:[],subtotal:820,shipping:0,total:820,status:"delivered"},
    {orderNum:"ORD-0920",customer:{name:"James Smith",email:"james@example.com"},date:"2026-02-18",items:[],subtotal:640,shipping:15,total:655,status:"shipped"},
    {orderNum:"ORD-0905",customer:{name:"Sophie Chen",email:"sophie@example.com"},date:"2026-01-28",items:[],subtotal:720,shipping:0,total:720,status:"delivered"},
    {orderNum:"ORD-0888",customer:{name:"Michael Brown",email:"michael@example.com"},date:"2026-01-14",items:[],subtotal:535,shipping:15,total:550,status:"confirmed"},
    {orderNum:"ORD-0872",customer:{name:"Lisa Wang",email:"lisa@example.com"},date:"2026-01-06",items:[],subtotal:910,shipping:0,total:910,status:"delivered"}
  ];

  // Hardcoded baseline reviews so visitors can read sample feedback per product.
  const initialReviews = [
    { productId: '1', name: 'Anne', email: 'anne@example.com', rating: 4, message: 'Fits true to size and the wool is soft.', date: '2026-03-12', verified: true },
    { productId: '1', name: 'Tonui', email: 'tonui@example.com', rating: 2, message: 'Color was darker than photos.', date: '2026-03-05', verified: true },
    { productId: '2', name: 'Allan', email: 'allan@example.com', rating: 5, message: 'Perfect drape and very comfortable.', date: '2026-03-02', verified: true },
    { productId: '3', name: 'Priya', email: 'priya@example.com', rating: 5, message: 'Warm yet lightweight, great layering piece.', date: '2026-03-08', verified: true },
    { productId: '4', name: 'Jacob', email: 'jacob@example.com', rating: 4, message: 'Leather is premium; broke in quickly.', date: '2026-03-15', verified: true }
  ];

  const categories = ["Men", "Women", "Kids", "Shoes", "Accessories"];

  function seedIfNeeded() {
    if (!localStorage.getItem(LS_PRODUCTS)) {
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(LS_ORDERS)) {
      localStorage.setItem(LS_ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(LS_REVIEWS)) {
      localStorage.setItem(LS_REVIEWS, JSON.stringify(initialReviews));
    }
  }

  function parseNumber(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function parseColors(raw) {
    // Accept:
    // - array: [{name,hex}, ...]
    // - string: "Name|#hex,Name2|#hex2"
    if (!raw) return [{name:"Default", hex:"#36454F"}];
    if (Array.isArray(raw)) {
      return raw
        .filter(Boolean)
        .map(c => ({name: String(c.name || "Default"), hex: String(c.hex || "#36454F")}));
    }
    if (typeof raw === "string") {
      const parts = raw.split(",").map(s => s.trim()).filter(Boolean);
      const colors = parts.map(p => {
        const [name, hex] = p.split("|").map(x => (x || "").trim());
        return {name: name || "Default", hex: hex || "#36454F"};
      });
      return colors.length ? colors : [{name:"Default", hex:"#36454F"}];
    }
    return [{name:"Default", hex:"#36454F"}];
  }

  function parseSizes(raw) {
    if (!raw) return ["S", "M", "L"];
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
    if (typeof raw === "string") {
      const sizes = raw.split(",").map(s => s.trim()).filter(Boolean);
      return sizes.length ? sizes : ["S", "M", "L"];
    }
    return ["S", "M", "L"];
  }

  function normalizeProduct(p) {
    const out = { ...p };
    out.id = String(out.id ?? '');
    out.name = String(out.name ?? '');
    out.brand = String(out.brand ?? '');
    out.category = categories.includes(out.category) ? out.category : String(out.category ?? 'Women');
    out.subcategory = String(out.subcategory ?? out.category ?? '');

    out.price = parseNumber(out.price, 0);
    out.originalPrice = out.originalPrice != null && out.originalPrice !== '' ? parseNumber(out.originalPrice, out.price) : undefined;
    out.discount = out.discount != null && out.discount !== '' ? parseNumber(out.discount, undefined) : undefined;

    // Recompute discount if originalPrice is present and higher than price.
    if (out.originalPrice && out.originalPrice > out.price) {
      out.discount = Math.round(((out.originalPrice - out.price) / out.originalPrice) * 100);
    }
    if (!out.originalPrice && out.discount && out.discount > 0) {
      out.originalPrice = Math.round(out.price * (100 / (100 - out.discount)));
    }

    // Ensure images array
    if (!out.images) out.images = [];
    if (typeof out.images === "string") {
      out.images = out.images.split(",").map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(out.images)) out.images = [];
    if (out.images.length === 0) out.images = ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600"];

    out.colors = parseColors(out.colors);
    out.sizes = parseSizes(out.sizes);

    out.rating = parseNumber(out.rating, 4.5);
    out.reviewCount = parseNumber(out.reviewCount, 0);
    out.description = String(out.description ?? 'Premium quality fashion item.');
    out.material = String(out.material ?? '');

    out.stockCount = Math.max(0, Math.round(parseNumber(out.stockCount, out.inStock ? 10 : 0)));
    out.inStock = out.stockCount > 0;

    out.tags = Array.isArray(out.tags) ? out.tags.map(String) : [];
    out.isFeatured = Boolean(out.isFeatured);
    out.isBestSeller = Boolean(out.isBestSeller);
    out.isNewArrival = Boolean(out.isNewArrival);

    return out;
  }

  function getProducts() {
    seedIfNeeded();
    const arr = JSON.parse(localStorage.getItem(LS_PRODUCTS) || '[]');
    return arr.map(normalizeProduct);
  }

  function setProducts(nextProducts) {
    seedIfNeeded();
    const normalized = (nextProducts || []).map(normalizeProduct).filter(p => p.id);
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(normalized));
  }

  function getAllReviews() {
    seedIfNeeded();
    return JSON.parse(localStorage.getItem(LS_REVIEWS) || '[]');
  }

  function setAllReviews(list) {
    seedIfNeeded();
    localStorage.setItem(LS_REVIEWS, JSON.stringify(list || []));
  }

  function getReviews(productId) {
    const pid = String(productId || '');
    return getAllReviews()
      .filter(r => String(r.productId) === pid)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }

  function addReview(review) {
    const list = getAllReviews();
    const clean = {
      productId: String(review.productId || ''),
      name: String(review.name || 'Customer'),
      email: String(review.email || ''),
      rating: Number(review.rating) || 0,
      message: String(review.message || ''),
      date: review.date || new Date().toISOString().slice(0, 10),
      verified: Boolean(review.verified)
    };
    list.push(clean);
    setAllReviews(list);
  }

  function hasDeliveredPurchase(productId, email) {
    const pid = String(productId || '');
    const em = String(email || '').toLowerCase();
    if (!pid || !em) return false;
    const orders = getOrders();
    return orders.some(o => {
      const delivered = String(o.status || '').toLowerCase() === 'delivered';
      const sameEmail = String(o?.customer?.email || '').toLowerCase() === em;
      if (!delivered || !sameEmail) return false;
      const items = Array.isArray(o.items) ? o.items : [];
      return items.some(i => String(i.productId || i.id || '') === pid);
    });
  }

  function generateProductId() {
    const prods = getProducts();
    const nums = prods
      .map(p => Number(String(p.id).replace(/[^\d]/g, '')))
      .filter(n => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return String(max + 1);
  }

  function upsertProduct(product) {
    const prods = getProducts();
    const normalized = normalizeProduct(product);
    if (!normalized.id) normalized.id = generateProductId();

    const idx = prods.findIndex(p => p.id === normalized.id);
    if (idx >= 0) prods[idx] = normalized;
    else prods.push(normalized);

    setProducts(prods);
    return normalized.id;
  }

  function deleteProduct(productId) {
    const id = String(productId);
    const prods = getProducts().filter(p => p.id !== id);
    setProducts(prods);

    // Remove from cart + wishlist to avoid broken product references.
    const cart = JSON.parse(localStorage.getItem('maison_cart') || '[]');
    localStorage.setItem(
      'maison_cart',
      JSON.stringify(cart.filter(i => i && i.id !== id))
    );
    const wishlist = JSON.parse(localStorage.getItem('maison_wishlist') || '[]');
    localStorage.setItem(
      'maison_wishlist',
      JSON.stringify(wishlist.filter(pid => String(pid) !== id))
    );
  }

  function getOrders() {
    seedIfNeeded();
    return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]');
  }

  function setOrders(nextOrders) {
    seedIfNeeded();
    localStorage.setItem(LS_ORDERS, JSON.stringify(nextOrders || []));
  }

  function createOrder(order) {
    const orders = getOrders();
    const o = { ...order };
    o.orderNum = String(o.orderNum || ('ORD-' + Date.now().toString().slice(-6)));
    o.date = o.date || new Date().toISOString().slice(0, 10);
    o.status = String(o.status || 'pending');
    o.subtotal = parseNumber(o.subtotal, 0);
    o.shipping = parseNumber(o.shipping, 0);
    o.total = parseNumber(o.total, o.subtotal + o.shipping);
    orders.unshift(o);
    setOrders(orders);
  }

  function updateOrderStatus(orderNum, nextStatus) {
    const num = String(orderNum);
    const orders = getOrders();
    const idx = orders.findIndex(o => String(o.orderNum) === num);
    if (idx < 0) return false;
    orders[idx].status = String(nextStatus);
    setOrders(orders);
    return true;
  }

  function monthYearLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return dateStr;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function getCustomerSummaries() {
    const orders = getOrders();
    const byEmail = {};
    for (const o of orders) {
      const email = o?.customer?.email ? String(o.customer.email) : '';
      if (!email) continue;
      if (!byEmail[email]) {
        byEmail[email] = {
          email,
          name: String(o?.customer?.name || 'Customer'),
          ordersCount: 0,
          totalSpent: 0,
          joinedAt: o?.date || ''
        };
      }
      byEmail[email].name = String(o?.customer?.name || byEmail[email].name);
      byEmail[email].ordersCount += 1;
      if (String(o.status) !== 'cancelled') byEmail[email].totalSpent += parseNumber(o.total, 0);
      if (!byEmail[email].joinedAt || new Date(o.date + 'T00:00:00') < new Date(byEmail[email].joinedAt + 'T00:00:00')) {
        byEmail[email].joinedAt = o?.date || byEmail[email].joinedAt;
      }
    }

    const list = Object.values(byEmail).map(c => ({
      name: c.name,
      email: c.email,
      ordersCount: c.ordersCount,
      totalSpent: c.totalSpent,
      joined: monthYearLabel(c.joinedAt)
    }));
    list.sort((a, b) => b.totalSpent - a.totalSpent);
    return list;
  }

  // Expose globals for plain <script> usage.
  window.getProducts = getProducts;
  window.setProducts = setProducts;
  window.upsertProduct = upsertProduct;
  window.deleteProduct = deleteProduct;
  window.getOrders = getOrders;
  window.setOrders = setOrders;
  window.createOrder = createOrder;
  window.updateOrderStatus = updateOrderStatus;
  window.getCustomerSummaries = getCustomerSummaries;
  window.getReviews = getReviews;
  window.addReview = addReview;
  window.hasDeliveredPurchase = hasDeliveredPurchase;
  window.maisonCategories = categories;
})();
