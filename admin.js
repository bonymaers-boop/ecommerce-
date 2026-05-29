(() => {
  let currentAdminPage = 'dashboard';
  let productModalMode = 'add'; // 'add' | 'edit'
  let productModalEditingId = '';
  let productModalBaseImages = [];
  let pendingImageDataUrls = [];
  let pendingImageReadPromise = Promise.resolve([]);
  let pendingImageFiles = [];
  let isUploadingProductImages = false;
  let currentAdminUser = null;
  let adminProducts = [];
  let adminOrders = [];
  let adminCustomers = [];

  const ADMIN_TOKEN_KEY = 'maison_admin_token';
  const API_BASE_URL = 'http://localhost:5000/api';
  const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

  const adminApp = () => document.getElementById('adminApp');
  const adminTitle = () => document.getElementById('adminTitle');
  const adminSubtitle = () => document.getElementById('adminSubtitle');
  const modalOverlay = () => document.getElementById('adminModalOverlay');
  const modalTitleEl = () => document.getElementById('adminModalTitle');
  const modalSubtitleEl = () => document.getElementById('adminModalSubtitle');
  const modalBodyEl = () => document.getElementById('adminModalBody');
  const adminToast = () => document.getElementById('adminToast');

  function money(n) {
    const num = Number(n);
    if (!Number.isFinite(num)) return 'Ksh 0';
    return 'Ksh ' + num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function currency2(n) {
    const num = Number(n);
    if (!Number.isFinite(num)) return 'Ksh 0.00';
    return 'Ksh ' + num.toFixed(2);
  }

  function statusChip(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') return `<span class="admin-chip chip-pending">Pending</span>`;
    if (s === 'confirmed') return `<span class="admin-chip chip-confirmed">Confirmed</span>`;
    if (s === 'shipped') return `<span class="admin-chip chip-shipped">Shipped</span>`;
    if (s === 'delivered') return `<span class="admin-chip chip-delivered">Delivered</span>`;
    if (s === 'cancelled') return `<span class="admin-chip chip-cancelled">Cancelled</span>`;
    return `<span class="admin-chip">${String(status || '')}</span>`;
  }

  function showAdminToast(msg) {
    const t = adminToast();
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  function setSidebarVisible(show) {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) sidebar.style.display = show ? 'block' : 'none';
  }

  function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  }

  function setAdminToken(token) {
    // Added line: store the JWT returned by the backend instead of a fake 'ok' flag.
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    currentAdminUser = null;
  }

  function isAuthed() {
    // Removed line: `return localStorage.getItem(ADMIN_TOKEN_KEY) === 'ok';`
    // Added line: the frontend now treats a backend token as the active admin session.
    return Boolean(getAdminToken());
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

  function normalizeImagePathForSave(src) {
    const value = String(src || '').trim();
    if (!value) return '';
    if (/^(https?:)?\/\//i.test(value) || value.startsWith('/uploads/') || value.startsWith('uploads/')) return value;
    if (/^[a-zA-Z]:\\/.test(value) || value.includes('\\')) {
      const fileName = value.split(/[/\\]+/).pop();
      return fileName ? `assets/products/${fileName}` : value;
    }
    if (/^[^/\\]+\.(png|jpe?g|webp|gif|svg)$/i.test(value)) return `assets/products/${value}`;
    return value;
  }

  async function apiRequest(path, options = {}) {
    const token = getAdminToken();
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

  async function loadAdminProducts({ silent = true } = {}) {
    try {
      const data = await apiRequest('/products');
      adminProducts = Array.isArray(data?.products) ? data.products : [];
      if (typeof setProducts === 'function') {
        setProducts(adminProducts);
      }
      return adminProducts;
    } catch (error) {
      if (!silent) showAdminToast(error.message || 'Could not load products from backend');
      adminProducts = typeof getProducts === 'function' ? getProducts() : [];
      return adminProducts;
    }
  }

  async function getAdminProductById(productId) {
    const data = await apiRequest(`/products/${productId}`);
    return data?.product || null;
  }

  async function loadAdminOrders({ silent = true } = {}) {
    try {
      const data = await apiRequest('/orders');
      adminOrders = Array.isArray(data?.orders) ? data.orders : [];
      return adminOrders;
    } catch (error) {
      if (!silent) showAdminToast(error.message || 'Could not load orders from backend');
      adminOrders = [];
      return adminOrders;
    }
  }

  async function loadAdminCustomers({ silent = true } = {}) {
    try {
      const data = await apiRequest('/customers');
      adminCustomers = Array.isArray(data?.customers) ? data.customers : [];
      return adminCustomers;
    } catch (error) {
      if (!silent) showAdminToast(error.message || 'Could not load customers from backend');
      adminCustomers = summarizeCustomersFromOrders(adminOrders);
      return adminCustomers;
    }
  }

  async function getAdminOrderById(orderId) {
    const data = await apiRequest(`/orders/${orderId}`);
    return data?.order || null;
  }

  function summarizeCustomersFromOrders(orders) {
    const byEmail = new Map();

    for (const order of orders) {
      const email = String(order?.customer?.email || '').trim().toLowerCase();
      if (!email) continue;

      const current = byEmail.get(email) || {
        name: String(order?.customer?.name || 'Customer'),
        email,
        ordersCount: 0,
        totalSpent: 0,
        joinedAt: String(order?.date || order?.createdAt || '')
      };

      current.name = String(order?.customer?.name || current.name);
      current.ordersCount += 1;
      if (String(order?.status || '').toLowerCase() !== 'cancelled') {
        current.totalSpent += Number(order?.total || 0);
      }

      const joinedCandidate = String(order?.date || order?.createdAt || '');
      if (!current.joinedAt || joinedCandidate < current.joinedAt) {
        current.joinedAt = joinedCandidate;
      }

      byEmail.set(email, current);
    }

    return [...byEmail.values()]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .map((customer) => ({
        ...customer,
        joined: customer.joinedAt ? customer.joinedAt.slice(0, 10) : '-'
      }));
  }

  function renderAuthLoading() {
    setSidebarVisible(false);
    if (adminTitle()) adminTitle().textContent = 'Checking Access';
    if (adminSubtitle()) adminSubtitle().textContent = 'Verifying your admin session with the backend.';
    if (!adminApp()) return;
    adminApp().innerHTML = `
      <div style="max-width:420px;margin:60px auto">
        <div class="admin-card">
          <h2 style="margin-bottom:10px">Checking session</h2>
          <p class="admin-muted">Connecting to the backend and verifying admin access.</p>
        </div>
      </div>
    `;
  }

  async function verifyAdminSession() {
    if (!isAuthed()) return false;
    if (currentAdminUser?.role === 'admin') return true;

    try {
      const data = await apiRequest('/auth/me');
      if (data?.user?.role !== 'admin') {
        clearAdminToken();
        showAdminToast('This account does not have admin access');
        return false;
      }

      currentAdminUser = data.user;
      return true;
    } catch (error) {
      clearAdminToken();
      showAdminToast(error.message || 'Session expired. Please sign in again.');
      return false;
    }
  }

  function renderLogin() {
    setSidebarVisible(false);
    if (adminTitle()) adminTitle().textContent = 'Admin Login';
    if (adminSubtitle()) adminSubtitle().textContent = 'Sign in to manage products, orders, and customers.';
    if (adminSubtitle()) adminSubtitle().textContent = 'Access restricted â€“ use demo credentials';
    if (!adminApp()) return;
    adminApp().innerHTML = `
      <div class="admin-login-wrap">
        <div class="admin-login-panel">
          <div class="admin-login-eyebrow">Lavana Store Control Room</div>
          <h2 class="admin-login-title">Welcome back to Lavana Store</h2>
          <p class="admin-login-copy">Use your admin account to access the store dashboard.</p>
          <div class="admin-field admin-login-field">
            <label>Email</label>
            <input id="adminLoginEmail" type="email" placeholder="Enter your admin email" autocomplete="email">
          </div>
          <div class="admin-field admin-login-field">
            <label>Password</label>
            <input id="adminLoginPass" type="password" placeholder="Enter your password" autocomplete="current-password">
          </div>
          <button class="admin-login-link" type="button" onclick="handleAdminForgotPassword()">Forgot password?</button>
          <div class="admin-form-actions admin-login-actions">
            <button class="admin-btn primary admin-login-btn" type="button" onclick="handleAdminLogin()">Sign In</button>
          </div>
        </div>
      </div>
    `;
    if (adminSubtitle()) adminSubtitle().textContent = 'Sign in to manage products, orders, and customers.';
  }

  async function handleLogin() {
    const email = document.getElementById('adminLoginEmail')?.value.trim();
    const pass = document.getElementById('adminLoginPass')?.value;

    if (!email || !pass) return showAdminToast('Email and password are required');

    try {
      // Removed lines:
      // `if (email === ADMIN_DEMO_EMAIL && pass === ADMIN_DEMO_PASS) { ... }`
      // Added lines: send credentials to `/api/auth/login`, then store the JWT from the backend.
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password: pass
        })
      });

      if (data?.user?.role !== 'admin') {
        clearAdminToken();
        return showAdminToast('This account is not allowed into the admin panel');
      }

      setAdminToken(data.token);
      currentAdminUser = data.user;
      showAdminToast('Signed in');
      await renderAdmin();
    } catch (error) {
      clearAdminToken();
      showAdminToast(error.message || 'Invalid admin credentials');
    }
  }
  window.handleAdminLogin = handleLogin;

  window.handleAdminForgotPassword = () => {
    const email = document.getElementById('adminLoginEmail')?.value.trim();
    if (!email) {
      showAdminToast('Enter your admin email first so we can send a reset link later.');
      return;
    }

    // Placeholder flow for now. We will reconnect this to an email service later.
    showAdminToast(`Password recovery for ${email} will be connected to the email service next.`);
  };

  // ===== Navigation =====
  window.navigateAdmin = async (page) => {
    if (!isAuthed()) return renderLogin();
    const allowed = await verifyAdminSession();
    if (!allowed) return renderLogin();
    currentAdminPage = page || 'dashboard';
    syncAdminNavActive();
    await renderAdmin();
  };

  window.signOut = () => {
    clearAdminToken();
    window.location.href = 'index.html';
  };

  function syncAdminNavActive() {
    document.querySelectorAll('.admin-nav-item').forEach(a => {
      a.classList.toggle('active', a.dataset.page === currentAdminPage);
    });

    const titles = {
      dashboard: { t: 'Dashboard', s: 'Overview of orders, stock, and customers.' },
      orders: { t: 'Orders', s: 'Manage fulfillment status and review customer orders.' },
      products: { t: 'Products', s: 'Add, edit, and remove products from your store.' },
      customers: { t: 'Customers', s: 'See who bought what and track totals.' }
    };
    const x = titles[currentAdminPage] || titles.dashboard;
    if (adminTitle()) adminTitle().textContent = x.t;
    if (adminSubtitle()) adminSubtitle().textContent = x.s;
  }

  // ===== Modal =====
  window.closeAdminModal = (event) => {
    // Do not close the modal from backdrop click events.
    // File-picker interactions can trigger awkward overlay click sequences in some browsers.
    // The modal should close only from explicit actions like X, Cancel, Save, or Delete.
    if (event) return;
    if (isUploadingProductImages) {
      showAdminToast('Please wait for the image upload to finish');
      return;
    }
    if (modalOverlay()) modalOverlay().style.display = 'none';
  };

  function openModal({ title, subtitle, bodyHtml }) {
    modalTitleEl().textContent = title || 'Modal';
    modalSubtitleEl().textContent = subtitle || '';
    modalBodyEl().innerHTML = bodyHtml || '';
    modalOverlay().style.display = 'flex';
  }

  // ===== Rendering =====
  async function renderAdmin() {
    if (!isAuthed()) {
      renderLogin();
      return;
    }

    if (!currentAdminUser) renderAuthLoading();
    const allowed = await verifyAdminSession();
    if (!allowed) {
      renderLogin();
      return;
    }

    setSidebarVisible(true);
    const [products, orders] = await Promise.all([
      loadAdminProducts({ silent: false }),
      loadAdminOrders({ silent: false })
    ]);
    const customers = await loadAdminCustomers({ silent: false });

    if (!adminApp()) return;

    if (currentAdminPage === 'dashboard') {
      adminApp().innerHTML = renderDashboard(products, orders, customers);
    } else if (currentAdminPage === 'orders') {
      adminApp().innerHTML = renderOrders(products, orders);
    } else if (currentAdminPage === 'products') {
      adminApp().innerHTML = renderProducts(products);
    } else if (currentAdminPage === 'customers') {
      adminApp().innerHTML = renderCustomers(customers);
    } else {
      adminApp().innerHTML = renderDashboard(products, orders, customers);
    }
  }

  function renderDashboard(products, orders, customers) {
    const sortedOrders = [...orders].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const recentOrders = sortedOrders.slice(0, 5);

    const revenue = sortedOrders
      .filter(o => String(o.status).toLowerCase() !== 'cancelled')
      .reduce((s, o) => s + Number(o.total || 0), 0);

    const orderCount = sortedOrders.filter(o => String(o.status).toLowerCase() !== 'cancelled').length;
    const customersCount = Array.isArray(customers) ? customers.length : 0;

    const lowStock = products.filter(p => p.stockCount > 0 && p.stockCount <= 15).slice(0, 6);
    const outOfStock = products.filter(p => p.stockCount <= 0).slice(0, 6);

    return `
      <div class="admin-grid-4">
        <div class="admin-card">
          <div class="admin-metric-top">
            <div>
              <div class="admin-metric-label">Total Revenue</div>
              <div class="admin-metric-value">${money(revenue)}</div>
              <div class="admin-metric-delta">Updated from orders</div>
            </div>
            <div class="admin-nav-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-metric-top">
            <div>
              <div class="admin-metric-label">Orders</div>
              <div class="admin-metric-value">${orderCount}</div>
              <div class="admin-metric-delta">Fulfillment pipeline</div>
            </div>
            <div class="admin-nav-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M13 2v6h6"/></svg>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-metric-top">
            <div>
              <div class="admin-metric-label">Products</div>
              <div class="admin-metric-value">${products.length}</div>
              <div class="admin-metric-delta">In your catalog</div>
            </div>
            <div class="admin-nav-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4.05a2 2 0 0 0-2 0l-7 4.05A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.05a2 2 0 0 0 2 0l7-4.05A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-metric-top">
            <div>
              <div class="admin-metric-label">Customers</div>
              <div class="admin-metric-value">${customersCount}</div>
              <div class="admin-metric-delta">Based on order email</div>
            </div>
            <div class="admin-nav-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-grid-2">
        <div class="admin-card">
          <div class="admin-metric-top" style="align-items:flex-end">
            <div>
              <div class="admin-metric-label">Recent Orders</div>
              <div style="font-weight:900;font-size:18px;margin-top:8px">Latest activity</div>
            </div>
            <button class="admin-btn" type="button" onclick="navigateAdmin('orders')">View all</button>
          </div>

          <div class="admin-list">
            ${
              recentOrders.length
                ? recentOrders.map(o => `
                  <div class="admin-row">
                    <div>
                      <strong>${o.orderNum}</strong>
                      <div class="admin-muted">${o.customer?.name || 'Customer'}</div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-weight:900">${currency2(o.total)}</div>
                      <div style="margin-top:6px">${statusChip(o.status)}</div>
                    </div>
                  </div>
                `).join('')
                : `<div class="admin-muted">No orders yet.</div>`
            }
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-metric-top" style="align-items:flex-end">
            <div>
              <div class="admin-metric-label">Low Stock Alerts</div>
              <div style="font-weight:900;font-size:18px;margin-top:8px">Keep inventory healthy</div>
            </div>
            <button class="admin-btn" type="button" onclick="navigateAdmin('products')">Manage</button>
          </div>

          <div class="admin-list">
            ${lowStock.length ? lowStock.map(p => `
              <div class="admin-row">
                <div style="display:flex;gap:12px;align-items:center">
                  <div class="admin-thumb">${p.images?.[0] ? `<img src="${resolveImageSrc(p.images[0])}" alt="${p.name}">` : ''}</div>
                  <div>
                    <strong style="display:block;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</strong>
                    <div class="admin-muted">${p.stockCount} left</div>
                  </div>
                </div>
                <div>${statusChip(p.stockCount > 0 ? 'pending' : 'cancelled')}</div>
              </div>
            `).join('') : `<div class="admin-muted">No low-stock items.</div>`}

            ${outOfStock.length
              ? `<div style="height:1px;background:var(--border);margin:12px 0"></div><div class="admin-metric-label" style="margin-bottom:6px">Out of Stock</div>`
              : `<div class="admin-muted" style="margin-top:12px">No out-of-stock items.</div>`}
            ${outOfStock.length ? outOfStock.map(p => `
              <div class="admin-row">
                <div style="display:flex;gap:12px;align-items:center">
                  <div class="admin-thumb">${p.images?.[0] ? `<img src="${resolveImageSrc(p.images[0])}" alt="${p.name}">` : ''}</div>
                  <div>
                    <strong style="display:block;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</strong>
                    <div class="admin-muted">0 left</div>
                  </div>
                </div>
                <div>${statusChip('cancelled')}</div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderOrders(products, orders) {
    const sortedOrders = [...orders].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const rows = sortedOrders.map(o => {
      const actions = renderOrderActions(o);
      return `
        <tr>
          <td style="font-weight:900;white-space:nowrap">${o.orderNum}</td>
          <td>${o.customer?.name || 'Customer'}</td>
          <td class="admin-muted">${o.date || ''}</td>
          <td style="font-weight:900;white-space:nowrap">${currency2(o.total)}</td>
          <td>${statusChip(o.status)}</td>
          <td>${actions}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="admin-card">
        <div class="admin-metric-top" style="align-items:flex-end">
          <div>
            <div class="admin-metric-label">Orders</div>
            <div style="font-weight:900;font-size:18px;margin-top:8px">${sortedOrders.length} total</div>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="6" class="admin-muted">No orders yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderOrderActions(order) {
    const status = String(order.status || '').toLowerCase();
    const view = `<button class="admin-btn" type="button" onclick="openOrderModal('${order.id}')">View</button>`;
    let mainAction = '';

    if (status === 'pending') {
      mainAction = `<button class="admin-btn primary" type="button" onclick="setOrderStatus('${order.id}','confirmed')">Confirm</button>`;
    } else if (status === 'confirmed') {
      mainAction = `<button class="admin-btn primary" type="button" onclick="setOrderStatus('${order.id}','shipped')">Ship</button>`;
    } else if (status === 'shipped') {
      mainAction = `<button class="admin-btn primary" type="button" onclick="setOrderStatus('${order.id}','delivered')">Deliver</button>`;
    }

    return `<div class="admin-actions">${mainAction}${view}</div>`;
  }

  window.setOrderStatus = async (orderId, nextStatus) => {
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      showAdminToast('Order updated');
      await renderAdmin();
    } catch (error) {
      showAdminToast(error.message || 'Could not update order');
    }
  };

  window.openOrderModalLegacyDemo = async (orderId) => {
    let order;
    try {
      order = await getAdminOrderById(orderId);
    } catch (error) {
      showAdminToast(error.message || 'Could not load order details');
      return;
    }
    if (!order) return showAdminToast('Order not found');

    const items = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = items.length
      ? items.map(i => {
        const p = products.find(x => String(x.id) === String(i.productId || i.id));
        const name = p ? p.name : (i.name || 'Unknown item');
        return `
          <tr>
            <td>
              <div style="display:flex;gap:10px;align-items:center">
                <div class="admin-thumb" style="width:34px;height:44px">${p?.images?.[0] ? `<img src="${resolveImageSrc(p.images[0])}" alt="${name}">` : ''}</div>
                <div>
                  <div style="font-weight:900">${name}</div>
                  <div class="admin-muted" style="margin-top:2px;font-size:12px">Size: ${i.size || '-'} · Color: ${i.color || '-'}</div>
                </div>
              </div>
            </td>
            <td style="white-space:nowrap">${i.qty}</td>
            <td style="white-space:nowrap">${currency2(i.unitPrice || 0)}</td>
            <td style="font-weight:900;white-space:nowrap">${currency2((i.unitPrice || 0) * (i.qty || 0))}</td>
          </tr>
        `;
      }).join('')
      : `<tr><td colspan="4" class="admin-muted">No line items stored for this demo order.</td></tr>`;

    openModal({
      title: `Order ${order.orderNum}`,
      subtitle: `${order.customer?.name || 'Customer'} · ${order.date || ''}`,
      bodyHtml: `
        <div class="admin-card" style="padding:14px;margin-bottom:14px">
          <div class="admin-row">
            <div>
              <div class="admin-metric-label">Customer</div>
              <div style="font-weight:900;margin-top:6px">${order.customer?.name || 'Customer'}</div>
              <div class="admin-muted" style="margin-top:4px">${order.customer?.email || '-'}</div>
            </div>
            <div style="text-align:right">
              <div class="admin-metric-label">Status</div>
              <div style="margin-top:10px">${statusChip(order.status)}</div>
            </div>
          </div>

          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
            <div>
              <div class="admin-metric-label">Subtotal</div>
              <div style="font-weight:900;margin-top:6px">${currency2(order.subtotal || 0)}</div>
            </div>
            <div>
              <div class="admin-metric-label">Shipping</div>
              <div style="font-weight:900;margin-top:6px">${currency2(order.shipping || 0)}</div>
            </div>
            <div>
              <div class="admin-metric-label">Total</div>
              <div style="font-weight:900;margin-top:6px">${currency2(order.total || 0)}</div>
            </div>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      `
    });
  };

  function renderProducts(products) {
    const rows = products
      .slice()
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .map(p => {
        const inStock = p.stockCount > 0;
        const stockChip = inStock
          ? `<span class="admin-chip chip-confirmed">In Stock</span>`
          : `<span class="admin-chip chip-cancelled">Out of Stock</span>`;
        return `
          <tr>
            <td>
              <div style="display:flex;gap:12px;align-items:center">
                <div class="admin-thumb">${p.images?.[0] ? `<img src="${resolveImageSrc(p.images[0])}" alt="${p.name}">` : ''}</div>
                <div>
                  <div style="font-weight:900">${p.name}</div>
                  <div class="admin-muted" style="margin-top:2px">${p.category || ''}</div>
                </div>
              </div>
            </td>
            <td>${p.brand || '-'}</td>
            <td style="white-space:nowrap;font-weight:900">${currency2(p.price || 0)}</td>
            <td style="white-space:nowrap;font-weight:900">${p.stockCount ?? 0}</td>
            <td>${stockChip}</td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn primary" type="button" onclick="openProductModal('${p.id}')">Edit</button>
                <button class="admin-btn danger" type="button" onclick="deleteProductModal('${p.id}')">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

    return `
      <div class="admin-card">
        <div class="admin-topbar-actions">
          <button class="admin-btn accent" type="button" onclick="openAddProductModal()">+ Add Product</button>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Availability</th>
                <th style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="6" class="admin-muted">No products found.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderCustomers(customers = adminCustomers) {
    const rows = customers.map(c => `
      <tr>
        <td>
          <div style="font-weight:900">${c.fullName || c.name || 'Customer'}</div>
          <div class="admin-muted" style="margin-top:4px">${c.isActive === false ? 'Inactive account' : 'Active account'}</div>
        </td>
        <td class="admin-muted">${c.email}</td>
        <td style="white-space:nowrap;font-weight:900">${c.ordersCount}</td>
        <td style="white-space:nowrap;font-weight:900">${currency2(c.totalSpent || 0)}</td>
        <td class="admin-muted">${String(c.joinedAt || c.joined || '').slice(0, 10) || '-'}</td>
        <td class="admin-muted">${String(c.lastOrderAt || '').slice(0, 10) || '-'}</td>
      </tr>
    `).join('');

    return `
      <div class="admin-card">
        <div class="admin-metric-top" style="align-items:flex-end">
          <div>
            <div class="admin-metric-label">Customers</div>
            <div style="font-weight:900;font-size:18px;margin-top:8px">${customers.length} total</div>
            <div class="admin-muted" style="margin-top:6px">Sorted by spend and order activity</div>
          </div>
        </div>

        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="6" class="admin-muted">No customers yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  window.openOrderModal = async (orderId) => {
    try {
      const order = await getAdminOrderById(orderId);
      if (!order) return showAdminToast('Order not found');

      const items = Array.isArray(order.items) ? order.items : [];
      const itemsHtml = items.length
        ? items.map((item) => `
          <tr>
            <td>
              <div style="display:flex;gap:10px;align-items:center">
                <div class="admin-thumb" style="width:34px;height:44px">${item.image ? `<img src="${resolveImageSrc(item.image)}" alt="${item.name || 'Order item'}">` : ''}</div>
                <div>
                  <div style="font-weight:900">${item.name || 'Unknown item'}</div>
                  <div class="admin-muted" style="margin-top:2px;font-size:12px">Size: ${item.size || '-'} · Color: ${item.color || '-'}</div>
                </div>
              </div>
            </td>
            <td style="white-space:nowrap">${item.qty}</td>
            <td style="white-space:nowrap">${currency2(item.unitPrice || 0)}</td>
            <td style="font-weight:900;white-space:nowrap">${currency2(item.lineTotal || ((item.unitPrice || 0) * (item.qty || 0)))}</td>
          </tr>
        `).join('')
        : `<tr><td colspan="4" class="admin-muted">No line items stored for this order.</td></tr>`;

      openModal({
        title: `Order ${order.orderNum}`,
        subtitle: `${order.customer?.name || 'Customer'} · ${String(order.date || '').slice(0, 10)}`,
        bodyHtml: `
          <div class="admin-card" style="padding:14px;margin-bottom:14px">
            <div class="admin-row">
              <div>
                <div class="admin-metric-label">Customer</div>
                <div style="font-weight:900;margin-top:6px">${order.customer?.name || 'Customer'}</div>
                <div class="admin-muted" style="margin-top:4px">${order.customer?.email || '-'}</div>
                <div class="admin-muted" style="margin-top:4px">${order.shippingAddress?.address || '-'}</div>
                <div class="admin-muted" style="margin-top:4px">${order.shippingAddress?.city || '-'}${order.shippingAddress?.country ? `, ${order.shippingAddress.country}` : ''}</div>
              </div>
              <div style="text-align:right">
                <div class="admin-metric-label">Status</div>
                <div style="margin-top:10px">${statusChip(order.status)}</div>
              </div>
            </div>

            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
              <div>
                <div class="admin-metric-label">Subtotal</div>
                <div style="font-weight:900;margin-top:6px">${currency2(order.subtotal || 0)}</div>
              </div>
              <div>
                <div class="admin-metric-label">Shipping</div>
                <div style="font-weight:900;margin-top:6px">${currency2(order.shipping || 0)}</div>
              </div>
              <div>
                <div class="admin-metric-label">Total</div>
                <div style="font-weight:900;margin-top:6px">${currency2(order.total || 0)}</div>
              </div>
            </div>
          </div>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
          </div>
        `
      });
    } catch (error) {
      showAdminToast(error.message || 'Could not load order details');
    }
  };

  // ===== Product Modals / Actions =====
  window.openAddProductModal = () => {
    productModalMode = 'add';
    productModalEditingId = '';
    openProductModalBody(null);
  };

  window.openProductModal = (productId) => {
    productModalMode = 'edit';
    productModalEditingId = String(productId);
    getAdminProductById(productModalEditingId)
      .then((product) => openProductModalBody(product || null))
      .catch((error) => showAdminToast(error.message || 'Could not load product details'));
  };

  function openProductModalBody(product) {
    const p = product || {};
    productModalBaseImages = Array.isArray(p.images) ? p.images.slice() : [];
    pendingImageDataUrls = [];
    pendingImageReadPromise = Promise.resolve([]);
    pendingImageFiles = [];
    isUploadingProductImages = false;

    const categoryOptions = (window.maisonCategories || ['Men','Women','Kids','Shoes','Accessories'])
      .map(c => `<option value="${c}" ${String(p.category || '') === c ? 'selected' : ''}>${c}</option>`)
      .join('');

    const colorsRaw = Array.isArray(p.colors)
      ? p.colors.map(c => `${c.name || 'Color'}|${c.hex || '#000000'}`).join(',')
      : (p.colors ? String(p.colors) : '');

    const sizesRaw = Array.isArray(p.sizes) ? p.sizes.join(',') : (p.sizes ? String(p.sizes) : '');

    openModal({
      title: productModalMode === 'add' ? 'Add Product' : 'Edit Product',
      subtitle: 'Upload product images to Cloudinary, or paste a saved URL manually when needed.',
      bodyHtml: `
        <div class="admin-form">
          <div class="admin-field full" style="display:none">
            <label>Product ID</label>
            <input id="p_id" value="${p.id || ''}">
          </div>

          <div class="admin-field">
            <label>Name</label>
            <input id="p_name" value="${p.name || ''}" placeholder="Product name">
          </div>
          <div class="admin-field">
            <label>Brand</label>
            <input id="p_brand" value="${p.brand || ''}" placeholder="Brand">
          </div>

          <div class="admin-field">
            <label>Category</label>
            <select id="p_category">${categoryOptions}</select>
          </div>
          <div class="admin-field">
            <label>Subcategory</label>
            <input id="p_subcategory" value="${p.subcategory || ''}" placeholder="e.g. Sneakers">
          </div>

          <div class="admin-field">
            <label>Price</label>
            <input id="p_price" type="number" min="0" step="1" value="${p.price ?? 0}">
          </div>
          <div class="admin-field">
            <label>Original Price (optional)</label>
            <input id="p_originalPrice" type="number" min="0" step="1" value="${p.originalPrice ?? ''}">
          </div>

          <div class="admin-field">
            <label>Stock Count</label>
            <input id="p_stockCount" type="number" min="0" step="1" value="${p.stockCount ?? 0}">
          </div>
          <div class="admin-field">
            <label>In Stock</label>
            <select id="p_inStock">
              <option value="true" ${p.stockCount > 0 ? 'selected' : ''}>Yes</option>
              <option value="false" ${p.stockCount > 0 ? '' : 'selected'}>No</option>
            </select>
          </div>

          <div class="admin-field full">
            <label>Image Paths or URLs (comma separated)</label>
            <textarea id="p_images" placeholder="sandals.jpeg, assets/products/blazer.jpg, https://...">${productModalBaseImages.join(', ')}</textarea>
            <div class="admin-helper-text">Friendly shortcut: if the image is already inside <strong>assets/products</strong>, you can type just the filename like <strong>sandals.jpeg</strong> and we will save it as <strong>assets/products/sandals.jpeg</strong>.</div>
            <div class="admin-helper-text">You can also use a Cloudinary URL like <strong>https://res.cloudinary.com/...</strong> or a backend-served path like <strong>/uploads/products/item.jpg</strong>.</div>
          </div>

          <div class="admin-field full">
            <div class="admin-image-picker">
              <label>Choose images, preview them, then upload to Cloudinary</label>
              <input id="p_imageFiles" class="admin-file-input" type="file" accept="image/*" multiple>
              <div class="admin-helper-text">This keeps the product form stable: choose files first, then click upload when you are ready.</div>
              <div class="admin-form-actions" style="margin-top:10px">
                <button id="p_uploadBtn" class="admin-btn" type="button" onclick="uploadSelectedProductImages()">Upload Selected Images</button>
              </div>
              <div class="admin-helper-text" id="p_uploadStatus">No upload in progress.</div>
              <div class="admin-image-previews" id="p_imagePreviews"></div>
            </div>
          </div>

          <div class="admin-field">
            <label>Sizes (comma separated)</label>
            <input id="p_sizes" value="${sizesRaw}" placeholder="S,M,L">
          </div>
          <div class="admin-field">
            <label>Colors (Name|Hex, comma separated)</label>
            <input id="p_colors" value="${colorsRaw}" placeholder="Camel|#C19A6B,Black|#000000">
          </div>

          <div class="admin-field full">
            <label>Description</label>
            <textarea id="p_description" placeholder="Short product description">${p.description || ''}</textarea>
          </div>
          <div class="admin-field full">
            <label>Material</label>
            <input id="p_material" value="${p.material || ''}" placeholder="Material">
          </div>

          <div class="admin-field">
            <label style="text-transform:none;letter-spacing:normal;font-size:13px;font-weight:700;color:var(--primary)">Featured</label>
            <select id="p_isFeatured">
              <option value="false" ${!p.isFeatured ? 'selected' : ''}>No</option>
              <option value="true" ${p.isFeatured ? 'selected' : ''}>Yes</option>
            </select>
          </div>
          <div class="admin-field">
            <label style="text-transform:none;letter-spacing:normal;font-size:13px;font-weight:700;color:var(--primary)">Best Seller</label>
            <select id="p_isBestSeller">
              <option value="false" ${!p.isBestSeller ? 'selected' : ''}>No</option>
              <option value="true" ${p.isBestSeller ? 'selected' : ''}>Yes</option>
            </select>
          </div>
          <div class="admin-field">
            <label style="text-transform:none;letter-spacing:normal;font-size:13px;font-weight:700;color:var(--primary)">New Arrival</label>
            <select id="p_isNewArrival">
              <option value="false" ${!p.isNewArrival ? 'selected' : ''}>No</option>
              <option value="true" ${p.isNewArrival ? 'selected' : ''}>Yes</option>
            </select>
          </div>

          <div class="admin-form-actions">
            <button class="admin-btn" type="button" onclick="closeAdminModal()">Cancel</button>
            <button id="p_saveBtn" class="admin-btn primary" type="button" onclick="saveProductFromModal()">Save</button>
          </div>
        </div>
      `
    });

    // Setup image previews + file picker handler.
    const previewEl = document.getElementById('p_imagePreviews');
    const fileInputEl = document.getElementById('p_imageFiles');
    const uploadStatusEl = document.getElementById('p_uploadStatus');
    const uploadBtnEl = document.getElementById('p_uploadBtn');

    const renderPreviews = () => {
      if (!previewEl) return;
      const all = [...productModalBaseImages, ...pendingImageDataUrls];
      const unique = [...new Set(all.filter(Boolean))];
      if (!unique.length) {
        previewEl.innerHTML = `<div class="admin-helper-text">No images selected yet.</div>`;
        return;
      }
      previewEl.innerHTML = unique
        .slice(0, 12)
        .map(src => `<div class="admin-image-thumb"><img src="${resolveImageSrc(src)}" alt="Product image"></div>`)
        .join('');
    };

    renderPreviews();

    if (fileInputEl) {
      fileInputEl.addEventListener('change', () => {
        pendingImageDataUrls = [];
        pendingImageReadPromise = Promise.resolve([]);
        const files = fileInputEl.files;
        const list = files ? Array.from(files) : [];
        pendingImageFiles = list;
        if (uploadBtnEl) uploadBtnEl.disabled = !list.length || isUploadingProductImages;
        if (!list.length) {
          if (uploadStatusEl) uploadStatusEl.textContent = 'No upload in progress.';
          renderPreviews();
          return;
        }

        showAdminToast('Reading selected images...');
        if (uploadStatusEl) uploadStatusEl.textContent = `${list.length} image(s) ready to upload.`;

        const readOne = (file) =>
          new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.onerror = () => reject(new Error('File read error'));
            r.readAsDataURL(file);
          });

        pendingImageReadPromise = Promise.all(list.map(readOne))
          .then((urls) => {
            pendingImageDataUrls = urls;
            return urls;
          })
          .catch(() => {
            pendingImageDataUrls = [];
            return [];
          })
          .finally(() => renderPreviews());
      }, { once: false });
    }
  }

  window.uploadSelectedProductImages = async () => {
    const uploadBtn = document.getElementById('p_uploadBtn');
    const uploadStatus = document.getElementById('p_uploadStatus');
    const imagesField = document.getElementById('p_images');
    const fileInputEl = document.getElementById('p_imageFiles');

    if (!pendingImageFiles.length) {
      showAdminToast('Choose at least one image first');
      return;
    }

    isUploadingProductImages = true;
    if (uploadBtn) uploadBtn.disabled = true;
    if (uploadStatus) uploadStatus.textContent = 'Uploading selected images to Cloudinary...';

    try {
      const formData = new FormData();
      pendingImageFiles.forEach((file) => formData.append('images', file));
      const data = await apiRequest('/uploads/products', {
        method: 'POST',
        body: formData
      });

      const uploadedPaths = Array.isArray(data?.files)
        ? data.files.map((file) => String(file.path || '').trim()).filter(Boolean)
        : [];

      if (!uploadedPaths.length) {
        throw new Error('No image URLs were returned from the upload');
      }

      productModalBaseImages = [...new Set([...productModalBaseImages, ...uploadedPaths])];
      pendingImageFiles = [];
      pendingImageDataUrls = [];
      pendingImageReadPromise = Promise.resolve([]);

      if (imagesField) imagesField.value = productModalBaseImages.join(', ');
      if (fileInputEl) fileInputEl.value = '';
      if (uploadStatus) uploadStatus.textContent = `${uploadedPaths.length} image(s) uploaded to Cloudinary.`;
      showAdminToast('Images uploaded successfully');

      const previewEl = document.getElementById('p_imagePreviews');
      if (previewEl) {
        previewEl.innerHTML = productModalBaseImages
          .map(src => `<div class="admin-image-thumb"><img src="${resolveImageSrc(src)}" alt="Product image"></div>`)
          .join('');
      }
    } catch (error) {
      if (uploadStatus) uploadStatus.textContent = error.message || 'Upload failed.';
      showAdminToast(error.message || 'Image upload failed');
    } finally {
      isUploadingProductImages = false;
      if (uploadBtn) uploadBtn.disabled = pendingImageFiles.length === 0;
    }
  };

  function getSelectBool(id) {
    const el = document.getElementById(id);
    return el ? String(el.value) === 'true' : false;
  }

  function getNum(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = el.value;
    if (v === '' || v == null) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  window.saveProductFromModal = async () => {
    const name = (document.getElementById('p_name')?.value || '').trim();
    const brand = (document.getElementById('p_brand')?.value || '').trim();
    const category = document.getElementById('p_category')?.value || 'Women';
    const subcategory = (document.getElementById('p_subcategory')?.value || '').trim();
    const price = getNum('p_price');
    const originalPriceRaw = document.getElementById('p_originalPrice')?.value;
    const originalPrice = originalPriceRaw === '' || originalPriceRaw == null ? undefined : Number(originalPriceRaw);
    const stockCountRaw = getNum('p_stockCount');
    const inStock = getSelectBool('p_inStock');
    const stockCount = inStock ? Math.max(0, stockCountRaw || 1) : 0;

    const urlText = (document.getElementById('p_images')?.value || '').trim();
    const urlImages = urlText
      ? urlText.split(',').map(s => normalizeImagePathForSave(s)).filter(Boolean)
      : [];
    // Keep only URLs/served file paths in the payload.
    const imagesFinal = [...productModalBaseImages.map(normalizeImagePathForSave), ...urlImages].filter(Boolean);
    const uniqueImages = [...new Set(imagesFinal)];
    const sizes = (document.getElementById('p_sizes')?.value || '').trim();
    const colors = (document.getElementById('p_colors')?.value || '').trim();
    const description = (document.getElementById('p_description')?.value || '').trim();
    const material = (document.getElementById('p_material')?.value || '').trim();

    if (!name) return showAdminToast('Product name is required');
    if (!uniqueImages.length) return showAdminToast('Add at least one image (URL or picker).');
    if (!colors) return showAdminToast('At least one color is required (Name|Hex)');
    if (!sizes) return showAdminToast('At least one size is required');

    const isFeatured = getSelectBool('p_isFeatured');
    const isBestSeller = getSelectBool('p_isBestSeller');
    const isNewArrival = getSelectBool('p_isNewArrival');

    const saveBtn = document.getElementById('p_saveBtn');
    if (saveBtn) saveBtn.disabled = true;

    const payload = {
      name,
      brand,
      category,
      subcategory,
      price,
      originalPrice,
      stockCount,
      images: uniqueImages,
      sizes,
      colors,
      description,
      material,
      isFeatured,
      isBestSeller,
      isNewArrival
    };

    try {
      if (productModalMode === 'edit') {
        await apiRequest(`/products/${productModalEditingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest('/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      await loadAdminProducts({ silent: false });
      closeAdminModal();
      showAdminToast('Product saved');
      await renderAdmin();
    } catch (error) {
      showAdminToast(error.message || 'Could not save product');
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  };

  window.deleteProductModal = async (productId) => {
    const id = String(productId);
    const p = adminProducts.find(x => String(x.id) === id);
    const name = p?.name || 'this product';
    if (!confirm(`Delete ${name} from the catalog?`)) return;

    try {
      await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });
      await loadAdminProducts({ silent: false });
      showAdminToast('Product deleted');
      closeAdminModal();
      await renderAdmin();
    } catch (error) {
      showAdminToast(error.message || 'Could not delete product');
    }
  };

  // Initial render
  syncAdminNavActive();
  renderAdmin();
})();
