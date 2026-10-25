/**
 * EQUINOX - Premium Electronics Store
 * Core Application Logic & State Management
 */

// Product Catalog matching screenshots
const PRODUCTS = [
  {
    id: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    category: 'Laptops',
    categoryKey: 'laptops',
    badge: 'HOT',
    specs: 'Apple M3 Max • 36GB RAM • 1TB SSD',
    price: 249999,
    image: 'images/macbook_pro_16.jpg'
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    category: 'Mobiles',
    categoryKey: 'mobiles',
    badge: 'NEW',
    specs: 'A18 Pro • 256GB • Titanium',
    price: 144900,
    image: 'images/iphone_16_pro.jpg'
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air M2',
    category: 'Tablets',
    categoryKey: 'tablets',
    badge: 'NEW',
    specs: 'M2 Chip • 128GB • Liquid Retina',
    price: 59900,
    image: 'images/ipad_air_m2.jpg'
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Mobiles',
    categoryKey: 'mobiles',
    badge: 'HOT',
    specs: 'Snapdragon 8 Gen 3 • 256GB • S Pen',
    price: 129999,
    image: 'images/samsung_s24_ultra.jpg'
  },
  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15',
    category: 'Laptops',
    categoryKey: 'laptops',
    badge: null,
    specs: 'Intel i9 • 32GB RAM • 1TB SSD',
    price: 154999,
    image: 'images/dell_xps_15.jpg'
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    category: 'Accessories',
    categoryKey: 'accessories',
    badge: 'SALE',
    specs: 'ANC • 30hr Battery • Hi-Res Audio',
    price: 29990,
    image: 'images/sony_xm5.jpg'
  },
  {
    id: 'google-pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    category: 'Mobiles',
    categoryKey: 'mobiles',
    badge: null,
    specs: 'Tensor G4 • 16GB RAM • AI Camera',
    price: 109999,
    image: 'images/pixel_9_pro.jpg'
  },
  {
    id: 'samsung-tab-s9',
    name: 'Samsung Galaxy Tab S9',
    category: 'Tablets',
    categoryKey: 'tablets',
    badge: null,
    specs: 'Snapdragon 8 Gen 2 • 12GB • S Pen',
    price: 85999,
    image: 'images/samsung_tab_s9.jpg'
  },
  {
    id: 'asus-rog-zephyrus',
    name: 'ASUS ROG Zephyrus G16',
    category: 'Laptops',
    categoryKey: 'laptops',
    badge: 'HOT',
    specs: 'Intel Ultra 9 • RTX 4080 • OLED 240Hz',
    price: 219990,
    image: 'images/asus_rog.jpg'
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    category: 'Accessories',
    categoryKey: 'accessories',
    badge: 'SALE',
    specs: 'H2 Chip • USB-C • MagSafe Case',
    price: 24900,
    image: 'images/airpods_pro.jpg'
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    category: 'Mobiles',
    categoryKey: 'mobiles',
    badge: null,
    specs: 'Snapdragon 8 Gen 3 • 16GB • 100W SuperVOOC',
    price: 64999,
    image: 'images/oneplus_12.jpg'
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    category: 'Accessories',
    categoryKey: 'accessories',
    badge: 'NEW',
    specs: 'S9 SiP • Titanium 49mm • 100m Water Resistant',
    price: 89900,
    image: 'images/apple_watch.jpg'
  }
];

// App State
let cart = JSON.parse(localStorage.getItem('equinox_cart')) || [];
let activeCategory = 'all';
let currentOrder = null;

// Helpers
function formatINR(val) {
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `EQX-${part1}-${part2}`;
}

function formatCurrentDateTime(date = new Date()) {
  const day = date.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 12-hour format

  return `${day} ${month} ${year} at ${hours}:${minutes} ${ampm}`;
}

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.categoryKey === activeCategory);

  grid.innerHTML = filtered.map(product => {
    const badgeHtml = product.badge 
      ? `<span class="badge-tag ${product.badge.toLowerCase()}">${product.badge}</span>` 
      : '';

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-img-wrap">
          ${badgeHtml}
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-specs">${product.specs}</div>
          <div class="product-bottom">
            <span class="product-price">${formatINR(product.price)}</span>
            <button class="btn-add" onclick="addToCart('${product.id}')" id="add-btn-${product.id}">
              Add +
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Cart Logic
function saveCart() {
  localStorage.setItem('equinox_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`Added ${product.name} to cart!`);

  // Visual feedback on button
  const btn = document.getElementById(`add-btn-${productId}`);
  if (btn) {
    const originalText = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '✓ Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = originalText;
    }, 1200);
  }
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
    showToast(`Removed from cart`);
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  showToast(`Item removed from cart`);
}

function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const total = subtotal + cgst + sgst;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, cgst, sgst, total, count };
}

function updateCartUI() {
  const { subtotal, cgst, sgst, total, count } = calculateCartTotals();

  // Update nav badge
  const navBadge = document.getElementById('nav-cart-badge');
  if (navBadge) {
    navBadge.textContent = count;
    navBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  // Update cart container
  const cartContainer = document.getElementById('cart-contents');
  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="cart-empty-message">
        Your cart is empty. Add products above!
      </div>
    `;
    return;
  }

  const itemsHtml = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatINR(item.price)}</div>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
      </div>
      <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">✕</button>
    </div>
  `).join('');

  cartContainer.innerHTML = `
    <div class="cart-items-list">
      ${itemsHtml}
    </div>
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span id="cart-subtotal">${formatINR(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>CGST (9%)</span>
        <span id="cart-cgst">${formatINR(cgst)}</span>
      </div>
      <div class="summary-row">
        <span>SGST (9%)</span>
        <span id="cart-sgst">${formatINR(sgst)}</span>
      </div>
      <div class="summary-row free-badge">
        <span>Shipping</span>
        <span>FREE</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-row summary-total">
        <span>Total</span>
        <span id="cart-grand-total">${formatINR(total)}</span>
      </div>
    </div>
  `;
}

// Category filter handlers
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });
}

// Order Placement & Checkout Submission
function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Please add at least one product to your cart before placing an order.');
      return;
    }

    const fullName = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const pincode = document.getElementById('cust-pincode').value.trim();

    if (!fullName || !email || !phone || !city || !address || !pincode) {
      alert('Please fill out all customer details.');
      return;
    }

    const { subtotal, cgst, sgst, total } = calculateCartTotals();
    const orderId = generateOrderId();
    const dateFormatted = formatCurrentDateTime();

    const orderData = {
      orderId,
      date: dateFormatted,
      customer: {
        fullName,
        email,
        phone,
        city,
        address,
        pincode
      },
      items: [...cart],
      financials: {
        subtotal,
        cgst,
        sgst,
        shipping: 0,
        total
      }
    };

    currentOrder = orderData;

    // Save order in history
    const existingOrders = JSON.parse(localStorage.getItem('equinox_orders')) || [];
    existingOrders.unshift(orderData);
    localStorage.setItem('equinox_orders', JSON.stringify(existingOrders));

    // Clear cart
    cart = [];
    saveCart();

    // Render Order Confirmation Screen
    renderOrderConfirmation(orderData);
    showToast('🎉 Order placed successfully!');
  });
}

// Render Order Placed Screen (Screen 3 Top)
function renderOrderConfirmation(order) {
  const mainView = document.getElementById('main-store-view');
  const confirmationView = document.getElementById('order-confirmation-view');
  const ordersView = document.getElementById('orders-history-view');

  if (mainView) mainView.style.display = 'none';
  if (ordersView) ordersView.style.display = 'none';
  if (confirmationView) confirmationView.style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const itemsTotalCount = order.items.reduce((s, i) => s + i.quantity, 0);

  confirmationView.innerHTML = `
    <div class="order-success-card">
      <div class="success-icon-badge">🎉</div>
      <h2 class="order-success-title">Order Placed Successfully!</h2>
      <div class="order-id-line">Order ID: <span class="order-id-cyan">${order.orderId}</span></div>
      <div class="order-date-line">${order.date}</div>

      <div class="success-subheading">Customer Information</div>
      <div class="customer-info-box-grid">
        <div class="info-tile">
          <div class="info-tile-label">Full Name</div>
          <div class="info-tile-val">${order.customer.fullName}</div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">Email</div>
          <div class="info-tile-val">${order.customer.email}</div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">Phone</div>
          <div class="info-tile-val">${order.customer.phone}</div>
        </div>
        <div class="info-tile">
          <div class="info-tile-label">City</div>
          <div class="info-tile-val">${order.customer.city}</div>
        </div>
        <div class="info-tile full-width">
          <div class="info-tile-label">Shipping Address</div>
          <div class="info-tile-val">${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</div>
        </div>
      </div>

      <div class="order-items-preview">
        <div class="success-subheading">Order Items (${itemsTotalCount} ${itemsTotalCount === 1 ? 'Item' : 'Items'})</div>
        <table class="order-items-table">
          <thead>
            <tr>
              <th style="text-align: left;">Product</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="text-align: left;">
                  <div style="font-weight: 700;">${item.name}</div>
                  <div style="font-size: 0.75rem; color: #64748b;">${item.category}</div>
                </td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${formatINR(item.price)}</td>
                <td style="text-align: right; font-weight: 700;">${formatINR(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="confirmation-actions">
        <button class="btn-secondary" onclick="continueShopping()">
          🛍️ Continue Shopping
        </button>
        <button class="btn-invoice" onclick="openInvoiceModal()">
          🖨️ View / Print Invoice
        </button>
      </div>
    </div>
  `;
}

function continueShopping() {
  const mainView = document.getElementById('main-store-view');
  const confirmationView = document.getElementById('order-confirmation-view');
  const ordersView = document.getElementById('orders-history-view');

  if (confirmationView) confirmationView.style.display = 'none';
  if (ordersView) ordersView.style.display = 'none';
  if (mainView) mainView.style.display = 'block';

  setActiveNavLink('nav-products');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Invoice Rendering & Print Management (Screen 3 Bottom)
function openInvoiceModal(order = currentOrder) {
  if (!order) {
    const orders = JSON.parse(localStorage.getItem('equinox_orders')) || [];
    if (orders.length > 0) order = orders[0];
    else return;
  }
  currentOrder = order;

  const modal = document.getElementById('invoice-modal');
  const container = document.getElementById('invoice-modal-content');
  if (!modal || !container) return;

  // Set document title to match chrome print dialog in screenshot
  document.title = `Invoice - ${order.orderId} | Equinox Electronics`;

  container.innerHTML = `
    <div class="invoice-sheet" id="invoice-sheet-printable">
      <div class="invoice-header">
        <div>
          <div class="inv-brand-logo">
            <span class="inv-bolt">⚡</span> EQUINOX
          </div>
          <div class="inv-brand-tagline">Premium Electronics Store</div>
        </div>
        <div class="inv-title-meta">
          <div class="inv-heading-text">INVOICE</div>
          <div class="inv-meta-line">Invoice No: <strong>${order.orderId}</strong></div>
          <div class="inv-meta-line">Date: <strong>${order.date}</strong></div>
          <div class="inv-meta-line">Status: <span class="inv-status-paid">PAID</span></div>
        </div>
      </div>

      <div class="invoice-parties">
        <div class="inv-party-col">
          <div class="inv-party-label">Bill To</div>
          <div class="inv-party-name">${order.customer.fullName}</div>
          <div class="inv-party-detail">${order.customer.address}</div>
          <div class="inv-party-detail">${order.customer.city} - ${order.customer.pincode}</div>
          <div class="inv-party-detail">Phone: ${order.customer.phone}</div>
          <div class="inv-party-detail">Email: ${order.customer.email}</div>
        </div>
        <div class="inv-party-col" style="text-align: right;">
          <div class="inv-party-label">From</div>
          <div class="inv-party-name">Equinox Electronics Pvt. Ltd.</div>
          <div class="inv-party-detail">123 Tech Park, Cyber City</div>
          <div class="inv-party-detail">Gurugram, Haryana - 122002</div>
          <div class="inv-party-detail">GSTIN: 06AABCE1234F1Z5</div>
          <div class="inv-party-detail">support@equinox.in</div>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Product</th>
            <th class="text-right">Unit Price</th>
            <th class="text-center">Qty</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="inv-product-title">${item.name}</div>
                <div class="inv-product-cat">${item.category}</div>
              </td>
              <td class="text-right">${formatINR(item.price)}</td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right" style="font-weight: 700;">${formatINR(item.price * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="invoice-summary-box">
        <table class="inv-calc-table">
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td class="val">${formatINR(order.financials.subtotal)}</td>
            </tr>
            <tr>
              <td>CGST (9%)</td>
              <td class="val">${formatINR(order.financials.cgst)}</td>
            </tr>
            <tr>
              <td>SGST (9%)</td>
              <td class="val">${formatINR(order.financials.sgst)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td class="val free-val">FREE</td>
            </tr>
            <tr class="inv-grand-total-row">
              <td>Grand Total</td>
              <td class="val">${formatINR(order.financials.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-footer">
        <div class="inv-thanks">Thank you for shopping with Equinox! <span class="bolt">⚡</span></div>
        <div class="inv-disclaimer">
          This is a computer-generated invoice and does not require a signature.<br />
          For queries, contact support@equinox.in | +91 1800-123-4567
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoice-modal');
  if (modal) modal.classList.remove('open');
  document.title = 'Equinox - Premium Electronics Store';
}

function printInvoice() {
  window.print();
}

// Orders History Tab
function renderOrdersHistory() {
  const mainView = document.getElementById('main-store-view');
  const confirmationView = document.getElementById('order-confirmation-view');
  const ordersView = document.getElementById('orders-history-view');

  if (mainView) mainView.style.display = 'none';
  if (confirmationView) confirmationView.style.display = 'none';
  if (ordersView) ordersView.style.display = 'block';

  setActiveNavLink('nav-orders');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const orders = JSON.parse(localStorage.getItem('equinox_orders')) || [];

  if (orders.length === 0) {
    ordersView.innerHTML = `
      <div class="section">
        <div class="section-header">
          <div class="section-badge">YOUR ACCOUNT</div>
          <h2 class="section-title">Past <span class="gradient-text">Orders</span></h2>
        </div>
        <div class="cart-empty-message" style="background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-subtle); max-width: 600px; margin: 0 auto; padding: 3.5rem;">
          <div style="font-size: 2.2rem; margin-bottom: 0.8rem;">📦</div>
          <div style="color: #ffffff; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">No orders found</div>
          <div style="color: var(--text-dim); margin-bottom: 1.8rem;">You haven't placed any orders yet.</div>
          <button class="btn-hero" onclick="continueShopping()">Explore Products →</button>
        </div>
      </div>
    `;
    return;
  }

  ordersView.innerHTML = `
    <div class="section">
      <div class="section-header">
        <div class="section-badge">YOUR ACCOUNT</div>
        <h2 class="section-title">Order <span class="gradient-text">History</span></h2>
        <p class="section-subtitle">Review past orders and download official tax invoices</p>
      </div>
      <div class="orders-history-container">
        ${orders.map((order, idx) => `
          <div class="order-history-card">
            <div class="order-history-header">
              <div>
                <div style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Order ID</div>
                <div class="order-id-cyan">${order.orderId}</div>
                <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">${order.date}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Total Amount</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">${formatINR(order.financials.total)}</div>
                <div style="font-size: 0.78rem; color: #10b981; font-weight: 700; margin-top: 0.2rem;">PAID • DELIVERED</div>
              </div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <div style="color: var(--text-muted); font-size: 0.9rem;">
                ${order.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}
              </div>
              <button class="btn-secondary" onclick="viewOrderInvoice(${idx})">
                📄 View Invoice
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function viewOrderInvoice(orderIndex) {
  const orders = JSON.parse(localStorage.getItem('equinox_orders')) || [];
  if (orders[orderIndex]) {
    openInvoiceModal(orders[orderIndex]);
  }
}

// Navigation helpers
function setActiveNavLink(id) {
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeLink = document.getElementById(id);
  if (activeLink) activeLink.classList.add('active');
}

function setupNavigation() {
  const navProducts = document.getElementById('nav-products');
  const navCheckout = document.getElementById('nav-checkout');
  const navOrders = document.getElementById('nav-orders');
  const logo = document.getElementById('site-logo');
  const heroBtn = document.getElementById('hero-explore-btn');

  function showMainView() {
    const mainView = document.getElementById('main-store-view');
    const confirmationView = document.getElementById('order-confirmation-view');
    const ordersView = document.getElementById('orders-history-view');

    if (confirmationView) confirmationView.style.display = 'none';
    if (ordersView) ordersView.style.display = 'none';
    if (mainView) mainView.style.display = 'block';
  }

  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      showMainView();
      setActiveNavLink('nav-products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (navProducts) {
    navProducts.addEventListener('click', (e) => {
      e.preventDefault();
      showMainView();
      setActiveNavLink('nav-products');
      const prodSec = document.getElementById('featured-products-section');
      if (prodSec) prodSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showMainView();
      setActiveNavLink('nav-products');
      const prodSec = document.getElementById('featured-products-section');
      if (prodSec) prodSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (navCheckout) {
    navCheckout.addEventListener('click', (e) => {
      e.preventDefault();
      showMainView();
      setActiveNavLink('nav-checkout');
      const checkoutSec = document.getElementById('checkout-section');
      if (checkoutSec) checkoutSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (navOrders) {
    navOrders.addEventListener('click', (e) => {
      e.preventDefault();
      renderOrdersHistory();
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  setupCategoryFilters();
  updateCartUI();
  setupCheckoutForm();
  setupNavigation();

  // Pre-fill dummy customer details for convenience matching screenshot
  const nameInput = document.getElementById('cust-name');
  const emailInput = document.getElementById('cust-email');
  const phoneInput = document.getElementById('cust-phone');
  const cityInput = document.getElementById('cust-city');
  const addressInput = document.getElementById('cust-address');
  const pincodeInput = document.getElementById('cust-pincode');

  if (nameInput && !nameInput.value) nameInput.value = 'Akshan';
  if (emailInput && !emailInput.value) emailInput.value = 'Akshan@123.com';
  if (phoneInput && !phoneInput.value) phoneInput.value = '1234567890';
  if (cityInput && !cityInput.value) cityInput.value = 'Mumbai';
  if (addressInput && !addressInput.value) addressInput.value = '123, xyz street, Mumbai';
  if (pincodeInput && !pincodeInput.value) pincodeInput.value = '400001';
});
