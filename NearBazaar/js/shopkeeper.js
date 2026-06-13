/* ═══════════════════════════════════════════════════════════════
   NearBazaar — shopkeeper.js (FIXED v1.1)
   Shopkeeper Panel: Real data, built-in delete, bulk select, km+hours settings
═══════════════════════════════════════════════════════════════ */
'use strict';

(function injectShopkeeperScreens() {
  const container = document.getElementById('shopkeeper-screens-container');
  if (!container) return;

  container.innerHTML = `
  <!-- SK HOME -->
  <div class="screen" id="screen-sk-home">
    <div class="sk-header">
      <div class="sk-header-top">
        <div class="sk-shop-row">
          <div class="sk-shop-logo" id="sk-shop-logo">&#127981;</div>
          <div>
            <div class="sk-shop-name" id="sk-shop-name">My Shop</div>
            <div class="sk-shop-cat" id="sk-shop-cat">General Store</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button class="icon-btn" onclick="goTo('screen-sk-notifs')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot" id="sk-notif-dot" style="display:none;"></span>
          </button>
          <div class="avatar" onclick="goTo('screen-sk-profile')">SK</div>
        </div>
      </div>
      <div class="open-toggle-row" onclick="toggleShopStatus()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span class="open-toggle-label">Shop Status</span>
        <div class="toggle orange" id="shop-status-toggle"></div>
        <span class="open-status closed" id="shop-status-text">Closed</span>
      </div>
    </div>
    <div class="sk-stats">
      <div class="sk-stat"><div class="sk-stat-val orange" id="sk-orders-today">0</div><div class="sk-stat-lbl">Today's Orders</div></div>
      <div class="sk-stat"><div class="sk-stat-val green" id="sk-revenue-today">&#8377;0</div><div class="sk-stat-lbl">Revenue</div></div>
      <div class="sk-stat"><div class="sk-stat-val amber" id="sk-rating">—</div><div class="sk-stat-lbl">Rating</div></div>
      <div class="sk-stat"><div class="sk-stat-val blue" id="sk-inventory-count">0</div><div class="sk-stat-lbl">Items</div></div>
    </div>
    <div class="sec-hdr"><span class="sec-hdr-left">Quick Actions</span></div>
    <div class="sk-quick-grid">
      <div class="sk-quick-btn orange" onclick="goTo('screen-sk-inventory')"><div class="sk-quick-icon orange">&#128230;</div><div class="sk-quick-label">Inventory</div></div>
      <div class="sk-quick-btn green"  onclick="loadSKOrders();goTo('screen-sk-orders')"><div class="sk-quick-icon green">&#128203;</div><div class="sk-quick-label">All Orders</div></div>
      <div class="sk-quick-btn blue"   onclick="goTo('screen-sk-analytics')"><div class="sk-quick-icon blue">&#128202;</div><div class="sk-quick-label">Analytics</div></div>
      <div class="sk-quick-btn amber"  onclick="goTo('screen-sk-settings')"><div class="sk-quick-icon amber">&#9881;</div><div class="sk-quick-label">Settings</div></div>
    </div>
    <div class="scroll-area">
      <div class="sec-hdr">
        <span class="sec-hdr-left">&#128308; Live Requests</span>
        <span class="sec-hdr-right" onclick="loadLiveRequests()">Refresh</span>
      </div>
      <div id="sk-live-requests">
        <div style="text-align:center;padding:20px;color:var(--gray-400);font-size:13px;font-weight:600;">Loading requests...</div>
      </div>
      <div class="sec-hdr">
        <span class="sec-hdr-left">&#128338; Incoming Orders</span>
        <span class="sec-hdr-right" id="sk-pending-count" style="background:var(--red);color:white;border-radius:12px;padding:2px 10px;font-size:11px;font-weight:800;display:none;"></span>
      </div>
      <div id="sk-incoming-orders">
        <div style="text-align:center;padding:20px;color:var(--gray-400);font-size:13px;font-weight:600;">Listening for orders...</div>
      </div>
      <div style="height:20px;"></div>
    </div>
    <div class="bottom-nav">
      <div class="nav-item active" onclick="goTo('screen-sk-home')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Dashboard</div>
      <div class="nav-item" onclick="loadSKOrders();goTo('screen-sk-orders')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Orders</div>
      <div class="nav-item" onclick="loadSKInventory();goTo('screen-sk-inventory')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>Inventory</div>
      <div class="nav-item" onclick="goTo('screen-sk-profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Profile</div>
    </div>
  </div>

  <!-- SK ORDERS -->
  <div class="screen" id="screen-sk-orders">
    <div class="top-bar orange">
      <button class="back-btn" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">All Orders</h2>
      <button onclick="loadSKOrders()" style="background:rgba(255,255,255,.2);border:none;color:white;border-radius:8px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;margin-top:4px;font-family:inherit;">&#x21BB; Refresh</button>
    </div>
    <div style="padding:12px 20px;flex-shrink:0;">
      <div class="auth-tabs">
        <button class="auth-tab active" id="sk-otab-new"       onclick="skSwitchOrderTab('new')">New</button>
        <button class="auth-tab"        id="sk-otab-active"    onclick="skSwitchOrderTab('active')">Active</button>
        <button class="auth-tab"        id="sk-otab-completed" onclick="skSwitchOrderTab('completed')">Completed</button>
      </div>
    </div>
    <div class="scroll-area">
      <div id="sk-orders-new"><div style="text-align:center;padding:40px;color:var(--gray-400);">No new orders</div></div>
      <div id="sk-orders-active" style="display:none;"><div style="text-align:center;padding:40px;color:var(--gray-400);">No active orders</div></div>
      <div id="sk-orders-completed" style="display:none;"><div style="text-align:center;padding:40px;color:var(--gray-400);">No completed orders</div></div>
    </div>
  </div>

  <!-- SK INVENTORY -->
  <div class="screen" id="screen-sk-inventory">
    <div class="top-bar orange">
      <button class="back-btn" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Inventory</h2>
      <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;align-items:center;">
        <button class="btn btn-sm" style="background:white;color:var(--orange-dark);font-weight:700;font-size:12px;" onclick="showAddItemModal()">&#43; Add Product</button>
        <button class="btn btn-sm" style="background:rgba(255,255,255,.2);color:white;font-size:12px;" id="sk-bulk-del-btn" style="display:none;" onclick="bulkDeleteSelected()">&#128465; Delete Selected</button>
        <label style="display:flex;align-items:center;gap:6px;color:white;font-size:12px;font-weight:600;cursor:pointer;">
          <input type="checkbox" id="sk-select-all" onchange="toggleSelectAll(this.checked)" style="width:16px;height:16px;"> Select All
        </label>
      </div>
    </div>
    <div style="padding:10px 20px;flex-shrink:0;">
      <div class="search-wrap">
        <svg class="search-icon dark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-input light" placeholder="Search inventory..." oninput="skSearchInventory(this.value)" id="sk-inv-search">
      </div>
    </div>
    <div class="scroll-area" id="sk-inventory-list">
      <div style="text-align:center;padding:40px;"><div class="spinner"></div></div>
    </div>

  </div>

  <!-- SK ANALYTICS -->
  <div class="screen" id="screen-sk-analytics">
    <div class="top-bar blue">
      <button class="back-btn" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Analytics</h2>
    </div>
    <div class="scroll-area" id="sk-analytics-content">
      <div style="text-align:center;padding:40px;"><div class="spinner"></div></div>
    </div>
  </div>

  <!-- SK SETTINGS -->
  <div class="screen" id="screen-sk-settings">
    <div class="top-bar amber" style="background:linear-gradient(160deg,var(--amber-dark),var(--amber));">
      <button class="back-btn" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Shop Settings</h2>
    </div>
    <div class="scroll-area">
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
        <!-- Delivery Radius — MANUAL INPUT + SLIDER -->
        <div style="background:white;border-radius:var(--radius);padding:16px;border:1.5px solid var(--gray-100);">
          <div style="font-size:14px;font-weight:800;color:var(--gray-900);margin-bottom:12px;">&#128205; Delivery Radius</div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <input type="number" id="sk-radius-input" min="1" max="50" placeholder="km" style="width:70px;padding:8px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:14px;font-weight:700;outline:none;text-align:center;font-family:var(--font-body);">
            <span style="font-size:14px;font-weight:700;color:var(--gray-600);">km</span>
            <input type="range" id="sk-radius-slider" min="1" max="50" style="flex:1;" oninput="document.getElementById('sk-radius-input').value=this.value">
          </div>
          <p style="font-size:11px;color:var(--gray-400);">Customers within this distance will see your shop and receive broadcast requests.</p>
          <button class="btn btn-amber btn-sm" onclick="saveRadiusSetting()" style="margin-top:8px;background:var(--amber-dark);color:white;">Save Radius</button>
        </div>
        <!-- Min Order -->
        <div style="background:white;border-radius:var(--radius);padding:16px;border:1.5px solid var(--gray-100);">
          <div style="font-size:14px;font-weight:800;color:var(--gray-900);margin-bottom:8px;">&#128178; Minimum Order Amount</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:16px;font-weight:700;">&#8377;</span>
            <input type="number" id="sk-minorder" min="0" placeholder="100" style="flex:1;padding:8px 12px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:14px;font-weight:700;outline:none;font-family:var(--font-body);">
          </div>
          <button class="btn btn-green btn-sm" onclick="saveMinOrder()" style="margin-top:8px;">Save</button>
        </div>
        <!-- Opening Hours -->
        <div style="background:white;border-radius:var(--radius);padding:16px;border:1.5px solid var(--gray-100);">
          <div style="font-size:14px;font-weight:800;color:var(--gray-900);margin-bottom:12px;">&#128336; Opening Hours</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
            <div>
              <label style="font-size:11px;font-weight:700;color:var(--gray-500);display:block;margin-bottom:4px;">Opens At</label>
              <input type="time" id="sk-open-time" style="width:100%;padding:8px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;outline:none;font-family:var(--font-body);">
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:var(--gray-500);display:block;margin-bottom:4px;">Closes At</label>
              <input type="time" id="sk-close-time" style="width:100%;padding:8px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;outline:none;font-family:var(--font-body);">
            </div>
          </div>
          <button class="btn btn-green btn-sm" onclick="saveOpeningHours()">Save Hours</button>
        </div>
        <!-- Shop Details -->
        <div style="background:white;border-radius:var(--radius);padding:16px;border:1.5px solid var(--gray-100);">
          <div style="font-size:14px;font-weight:800;color:var(--gray-900);margin-bottom:8px;">&#127981; Shop Details</div>
          <button class="btn btn-orange btn-full btn-sm" onclick="editShopDetails()">Edit Shop Name, Category &amp; Address</button>
        </div>
        <!-- Danger Zone -->
        <div style="background:#fef2f2;border-radius:var(--radius);padding:16px;border:1.5px solid #fecaca;">
          <div style="font-size:14px;font-weight:800;color:var(--red-dark);margin-bottom:8px;">&#9888; Danger Zone</div>
          <button class="btn btn-red btn-full btn-sm" onclick="confirmSignOutSK()">Sign Out</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SK NOTIFS -->
  <div class="screen" id="screen-sk-notifs">
    <div class="top-bar orange">
      <button class="back-btn" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Notifications</h2>
        <div style="display:flex;gap:8px;">
          <button style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;" onclick="markNotifsRead()">Mark read</button>
          <button id="sk-notif-clear-btn" style="background:rgba(239,68,68,.3);border:1px solid rgba(239,68,68,.5);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;">Clear all</button>
        </div>
      </div>
    </div>
    <div class="scroll-area" id="sk-notifs-list">
      <div style="text-align:center;padding:60px 20px;color:var(--gray-400);"><div style="font-size:40px;margin-bottom:8px;">&#128276;</div><div style="font-weight:700;">No notifications</div></div>
    </div>
  </div>

  <!-- SK PROFILE -->
  <div class="screen" id="screen-sk-profile">
    <div style="flex-shrink:0;">
      <div class="profile-hero" style="background:linear-gradient(160deg,var(--orange-dark),var(--orange));">
        <button class="back-btn" style="position:absolute;top:calc(env(safe-area-inset-top,0px)+14px);left:16px;" onclick="goTo('screen-sk-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
        <div class="profile-avatar-lg" id="sk-profile-avatar">SK<div class="profile-cam-btn" onclick="changeSkProfilePhoto()">&#128247;</div></div>
        <div class="profile-name" id="sk-profile-name">Shopkeeper</div>
        <div class="profile-email" id="sk-profile-email">shop@email.com</div>
        <div class="profile-role-badge" style="background:rgba(255,255,255,.2);">&#127981; Shopkeeper</div>
      </div>
      <div class="stat-strip">
        <div class="stat-pill"><div class="stat-pill-val orange" id="sk-prof-orders">0</div><div class="stat-pill-lbl">Orders</div></div>
        <div class="stat-pill green"><div class="stat-pill-val green" id="sk-prof-revenue">&#8377;0</div><div class="stat-pill-lbl">Revenue</div></div>
        <div class="stat-pill amber"><div class="stat-pill-val amber" id="sk-prof-rating">—</div><div class="stat-pill-lbl">Rating</div></div>
      </div>
      <div class="switch-role-bar">
        <span style="font-size:11px;font-weight:700;color:var(--gray-500);white-space:nowrap;align-self:center;">Switch to:</span>
        <div class="switch-role-btn" onclick="switchRole('customer')">&#128100; Customer</div>
        <div class="switch-role-btn" onclick="switchRole('delivery')">&#128666; Delivery</div>
      </div>
    </div>
    <div class="scroll-area">
      <div class="profile-menu-item" onclick="loadSKOrders();goTo('screen-sk-orders')"><div class="profile-menu-icon orange">&#128203;</div><div><div class="profile-menu-label">Orders</div><div class="profile-menu-sub">Manage all orders</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="goTo('screen-sk-analytics')"><div class="profile-menu-icon blue">&#128202;</div><div><div class="profile-menu-label">Analytics</div><div class="profile-menu-sub">Sales &amp; performance</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="goTo('screen-sk-settings')"><div class="profile-menu-icon amber">&#9881;</div><div><div class="profile-menu-label">Shop Settings</div><div class="profile-menu-sub">Manage delivery radius, hours etc.</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="confirmSignOutSK()"><div class="profile-menu-icon red">&#128682;</div><div><div class="profile-menu-label" style="color:var(--red-dark);">Sign Out</div></div></div>
    </div>
  </div>

  `;
})();

/* ══════════════════════════════════════
   INIT SHOPKEEPER
══════════════════════════════════════ */
window.initShopkeeper = function() {
  updateHeaderUser('shopkeeper');
  var data = window.currentUserData || {};

  // Update UI elements
  var nameEl = document.getElementById('sk-shop-name');
  var catEl  = document.getElementById('sk-shop-cat');
  var pn     = document.getElementById('sk-profile-name');
  var pe     = document.getElementById('sk-profile-email');
  var pa     = document.getElementById('sk-profile-avatar');
  var po     = document.getElementById('sk-prof-orders');
  var pRev   = document.getElementById('sk-prof-revenue');
  var pRat   = document.getElementById('sk-prof-rating');
  var rat    = document.getElementById('sk-rating');

  if (nameEl) nameEl.textContent = data.shopName || data.name || 'My Shop';
  if (catEl)  catEl.textContent  = data.shopCategory || 'General';
  if (pn)     pn.textContent     = data.shopName || data.name || 'Shopkeeper';
  if (pe)     pe.textContent     = data.email || '';
  if (po)     po.textContent     = data.totalOrders || 0;
  if (pRev)   pRev.innerHTML     = '&#8377;' + (data.totalRevenue || 0);
  if (pRat)   pRat.textContent   = data.rating ? data.rating.toFixed(1) : '—';
  if (rat)    rat.textContent    = data.rating ? data.rating.toFixed(1) : '—';
  // Also update review count from Firestore shop doc
  if (window.FB && window.currentUser) {
    window.FB.getDoc(window.FB.doc(window.FB.db, 'shops', window.currentUser.uid)).then(function(snap) {
      if (snap.exists()) {
        var shopData = snap.data();
        var ratEl  = document.getElementById('sk-rating');
        var pRatEl = document.getElementById('sk-prof-rating');
        var revCnt = shopData.reviewCount || 0;
        var rating = shopData.rating ? shopData.rating.toFixed(1) : '—';
        if (ratEl)  ratEl.textContent  = revCnt > 0 ? rating : '—';
        if (pRatEl) pRatEl.textContent = revCnt > 0 ? rating + ' (' + revCnt + ')' : '—';
      }
    }).catch(function() {});
  }

  if (pa) {
    var photoHtml = data.photoURL
      ? '<img src="' + data.photoURL + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
      : getUserInitials(data.name || 'SK');
    pa.innerHTML = photoHtml + '<div class="profile-cam-btn" onclick="changeSkProfilePhoto()">&#128247;</div>';
  }

  // Shop status toggle
  var toggle = document.getElementById('shop-status-toggle');
  var text   = document.getElementById('shop-status-text');
  if (toggle) toggle.classList.toggle('on', !!data.shopOpen);
  if (text)   { text.textContent = data.shopOpen ? 'Open' : 'Closed'; text.className = 'open-status ' + (data.shopOpen ? 'open' : 'closed'); }

  // Settings
  var radInput  = document.getElementById('sk-radius-input');
  var radSlider = document.getElementById('sk-radius-slider');
  var minOrd    = document.getElementById('sk-minorder');
  var openT     = document.getElementById('sk-open-time');
  var closeT    = document.getElementById('sk-close-time');
  if (radInput)  radInput.value  = data.deliveryRadius || 5;
  if (radSlider) radSlider.value = data.deliveryRadius || 5;
  if (minOrd)    minOrd.value    = data.minOrder || 100;
  if (openT)     openT.value     = data.openingHours  || '09:00';
  if (closeT)    closeT.value    = data.closingHours  || '21:00';

  // Sync radius input <-> slider
  var ri = document.getElementById('sk-radius-input');
  if (ri) {
    ri.addEventListener('input', function() {
      var sl = document.getElementById('sk-radius-slider');
      if (sl) sl.value = Math.min(parseInt(this.value) || 5, 50);
    });
  }

  loadSKInventory();
  loadLiveRequests();
  listenShopOrders();
  loadSKAnalytics();
  loadSKOrders(); // Pre-load orders for All Orders tab
  // Setup real-time notifications for shopkeeper
  if (typeof setupNotifScreen === 'function') {
    setupNotifScreen('sk-notifs-list', 'sk-notif-dot', 'sk-notif-clear-btn');
  }
};

/* ══════════════════════════════════════
   SETTINGS
══════════════════════════════════════ */
window.saveRadiusSetting = async function() {
  var val = parseInt(document.getElementById('sk-radius-input') ? document.getElementById('sk-radius-input').value : 5) || 5;
  await updateUserProfile({ deliveryRadius: val });
  if (window.FB && window.currentUser) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'shops', window.currentUser.uid), { deliveryRadius: val }).catch(function() {});
  }
  showToast('Delivery radius set to ' + val + ' km', 2200, 'success');
};

window.saveMinOrder = async function() {
  var val = parseInt(document.getElementById('sk-minorder') ? document.getElementById('sk-minorder').value : 100) || 100;
  await updateUserProfile({ minOrder: val });
  showToast('Minimum order updated', 2000, 'success');
};

window.saveOpeningHours = async function() {
  var openT  = document.getElementById('sk-open-time')  ? document.getElementById('sk-open-time').value  : '';
  var closeT = document.getElementById('sk-close-time') ? document.getElementById('sk-close-time').value : '';
  if (!openT || !closeT) { showToast('Please set both times', 2200, 'error'); return; }
  await updateUserProfile({ openingHours: openT, closingHours: closeT });
  if (window.FB && window.currentUser) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'shops', window.currentUser.uid), { openingHours: openT, closingHours: closeT }).catch(function() {});
  }
  showToast('Opening hours saved', 2000, 'success');
};

/* ══════════════════════════════════════
   SHOP STATUS TOGGLE
══════════════════════════════════════ */
window.toggleShopStatus = async function() {
  var toggle = document.getElementById('shop-status-toggle');
  var text   = document.getElementById('shop-status-text');
  if (!toggle) return;
  toggle.classList.toggle('on');
  var isOpen = toggle.classList.contains('on');
  if (text) { text.textContent = isOpen ? 'Open' : 'Closed'; text.className = 'open-status ' + (isOpen ? 'open' : 'closed'); }
  showToast(isOpen ? 'Shop is now Open' : 'Shop is now Closed', 2200, isOpen ? 'success' : 'default');
  if (window.FB && window.currentUser) {
    var uid = window.currentUser.uid;
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'users', uid), { shopOpen: isOpen }).catch(function() {});
    window.FB.setDoc(window.FB.doc(window.FB.db, 'shops', uid), { shopOpen: isOpen, ownerId: uid }, { merge: true }).catch(function() {});
  }
};

/* ══════════════════════════════════════
   ALL ORDERS — REAL-TIME (onSnapshot)
   Sorted: oldest first within each status group
══════════════════════════════════════ */
var _skOrdersUnsub = null;

window.loadSKOrders = function() {
  if (!window.FB || !window.currentUser) return;

  // Cancel previous listener
  if (_skOrdersUnsub) {
    try { _skOrdersUnsub(); } catch(e) {}
    _skOrdersUnsub = null;
  }

  var db         = window.FB.db;
  var collection = window.FB.collection;
  var query      = window.FB.query;
  var where      = window.FB.where;
  var onSnapshot = window.FB.onSnapshot;

  var q = query(collection(db, 'orders'), where('shopId', '==', window.currentUser.uid));

  _skOrdersUnsub = onSnapshot(q, function(snapRaw) {
    // Sort OLDEST first (ascending by createdAt) within status groups
    var docs = snapRaw.docs.slice().sort(function(a, b) {
      var ta = 0, tb = 0;
      var ad = a.data(), bd = b.data();
      if (ad.createdAt && ad.createdAt.toDate) ta = ad.createdAt.toDate().getTime();
      if (bd.createdAt && bd.createdAt.toDate) tb = bd.createdAt.toDate().getTime();
      return ta - tb; // oldest first
    });

    var newHtml       = '';
    var activeHtml    = '';
    var completedHtml = '';
    var todayOrders   = 0;
    var todayRevenue  = 0;
    var today         = new Date().toDateString();

    docs.forEach(function(docSnap) {
      var o      = docSnap.data();
      o.id       = docSnap.id;
      var oId    = docSnap.id;

      var dateStr = '';
      var isToday = false;
      if (o.createdAt && o.createdAt.toDate) {
        var d   = o.createdAt.toDate();
        dateStr = formatTime(o.createdAt);
        isToday = d.toDateString() === today;
      }

      if (isToday && (o.status === 'confirmed' || o.status === 'packed' || o.status === 'otw' || o.status === 'delivered')) {
        todayOrders++;
        todayRevenue += o.grandTotal || 0;
      }

      var idShort  = '#' + oId.slice(-8).toUpperCase();
      var itemsStr = '';
      if (o.items && o.items.length) {
        var parts = [];
        o.items.forEach(function(it) { parts.push(it.qty + 'x ' + it.name); });
        itemsStr = parts.join(', ');
      }

      var baseCard =
        '<div class="sk-order-card" id="sk-ord-' + oId + '">' +
          '<div class="sk-order-header">' +
            '<div class="sk-order-id">' + idShort + '</div>' +
            '<div class="sk-order-meta">' + dateStr + (dateStr ? ' &bull; ' : '') + '&#8377;' + (o.grandTotal || 0) + '</div>' +
          '</div>' +
          '<div class="sk-order-customer">' + (o.customerName || '') + ' &bull; ' + (o.orderType || '') + '</div>' +
          '<div class="sk-order-items">' + itemsStr + '</div>';

      if (o.status === 'placed') {
        newHtml += baseCard +
          '<div class="sk-order-actions">' +
            '<button class="btn btn-green btn-sm" style="flex:2;" onclick="skAcceptOrder(\'' + oId + '\')">&#10003; Accept</button>' +
            '<button class="btn btn-red btn-sm" style="flex:1;" onclick="skRejectOrder(\'' + oId + '\')">&#10007; Reject</button>' +
          '</div>' +
        '</div>';

      } else if (o.status === 'confirmed') {
        activeHtml += baseCard +
          '<div class="sk-order-status-row">' +
            '<span class="badge badge-orange">&#9989; Confirmed</span>' +
            '<span class="sk-order-time-hint">Prepare the order</span>' +
          '</div>' +
          '<button class="btn btn-green btn-full btn-sm" style="margin-top:8px;" onclick="skMarkPacked(\'' + oId + '\')">&#128092; Mark as Packed &amp; Ready</button>' +
        '</div>';

      } else if (o.status === 'packed') {
        activeHtml += baseCard +
          '<div class="sk-order-status-row">' +
            '<span class="badge badge-blue badge-pulse">&#128092; Packed &amp; Ready</span>' +
            '<span class="sk-order-time-hint">Waiting for rider</span>' +
          '</div>' +
        '</div>';

      } else if (o.status === 'otw') {
        activeHtml += baseCard +
          '<div class="sk-order-status-row">' +
            '<span class="badge badge-orange badge-pulse">&#128666; On the Way</span>' +
            '<span class="sk-order-time-hint">' + (o.driverName ? 'Driver: ' + o.driverName : 'En route') + '</span>' +
          '</div>' +
        '</div>';

      } else if (o.status === 'delivered') {
        completedHtml += baseCard +
          '<div class="sk-order-status-row">' +
            '<span class="badge badge-green">&#10003; Delivered</span>' +
            '<span style="font-size:12px;color:#166534;font-weight:700;">&#8377;' + (o.grandTotal || 0) + ' earned</span>' +
          '</div>' +
        '</div>';

      } else if (o.status === 'rejected') {
        completedHtml += baseCard +
          '<div class="sk-order-status-row">' +
            '<span class="badge badge-gray">&#10060; Rejected</span>' +
          '</div>' +
        '</div>';
      }
    });

    var newEl  = document.getElementById('sk-orders-new');
    var actEl  = document.getElementById('sk-orders-active');
    var comEl  = document.getElementById('sk-orders-completed');

    if (newEl)  newEl.innerHTML  = newHtml       || '<div class="sk-orders-empty"><div style="font-size:36px;margin-bottom:8px;">&#128203;</div><div style="font-weight:700;color:#374151;">No new orders</div><div style="font-size:12px;color:#9ca3af;margin-top:4px;">New orders will appear here</div></div>';
    if (actEl)  actEl.innerHTML  = activeHtml    || '<div class="sk-orders-empty"><div style="font-size:36px;margin-bottom:8px;">&#9989;</div><div style="font-weight:700;color:#374151;">No active orders</div><div style="font-size:12px;color:#9ca3af;margin-top:4px;">Accept orders to see them here</div></div>';
    if (comEl)  comEl.innerHTML  = completedHtml || '<div class="sk-orders-empty"><div style="font-size:36px;margin-bottom:8px;">&#127881;</div><div style="font-weight:700;color:#374151;">No completed orders yet</div></div>';

    var toEl  = document.getElementById('sk-orders-today');
    var revEl = document.getElementById('sk-revenue-today');
    if (toEl)  toEl.textContent  = todayOrders;
    if (revEl) revEl.innerHTML   = '&#8377;' + todayRevenue;

  }, function(err) {
    console.error('SK orders listener error:', err);
    var newEl = document.getElementById('sk-orders-new');
    if (newEl) newEl.innerHTML = '<div class="sk-orders-empty"><div style="font-size:13px;color:#ef4444;">Could not load orders. Check connection.</div><button class="btn btn-sm btn-orange" style="margin-top:10px;" onclick="loadSKOrders()">Retry</button></div>';
  });

  // Track unsubscribe
  window.NearBazaar.unsubscribers.push(function() {
    if (_skOrdersUnsub) { try { _skOrdersUnsub(); } catch(e) {} }
  });
};

/* ══════════════════════════════════════
   ORDERS TAB SWITCH
══════════════════════════════════════ */
window.skSwitchOrderTab = function(tab) {
  var tabs = ['new', 'active', 'completed'];
  tabs.forEach(function(t) {
    var tabEl  = document.getElementById('sk-otab-' + t);
    var listEl = document.getElementById('sk-orders-' + t);
    if (tabEl)  tabEl.classList.toggle('active', t === tab);
    if (listEl) listEl.style.display = (t === tab) ? '' : 'none';
  });
};

/* ══════════════════════════════════════
   HOME SCREEN — INCOMING ORDERS LISTENER (placed only)
══════════════════════════════════════ */
function listenShopOrders() {
  if (!window.FB || !window.currentUser) return;
  var db         = window.FB.db;
  var collection = window.FB.collection;
  var query      = window.FB.query;
  var where      = window.FB.where;
  var onSnapshot = window.FB.onSnapshot;
  var limit      = window.FB.limit;

  var q = query(collection(db, 'orders'), where('shopId', '==', window.currentUser.uid), where('status', '==', 'placed'), limit(30));

  var unsub = onSnapshot(q, function(snap) {
    var dot     = document.getElementById('sk-notif-dot');
    var pending = document.getElementById('sk-pending-count');
    if (dot)     dot.style.display     = snap.size > 0 ? '' : 'none';
    if (pending) {
      pending.textContent  = snap.size || '';
      pending.style.display = snap.size > 0 ? '' : 'none';
    }

    var container = document.getElementById('sk-incoming-orders');
    if (!container) return;

    if (snap.empty) {
      container.innerHTML = '<div style="text-align:center;padding:20px;color:#9ca3af;font-size:13px;font-weight:600;">No incoming orders right now</div>';
      return;
    }

    container.innerHTML = '';
    snap.docs.forEach(function(docSnap) {
      var o   = docSnap.data();
      var oid = docSnap.id;

      var itemsStr = '';
      if (o.items && o.items.length) {
        var parts = [];
        o.items.forEach(function(it) { parts.push(it.qty + 'x ' + it.name); });
        itemsStr = parts.join(' &bull; ');
      }

      var div = document.createElement('div');
      div.className = 'incoming-card';
      div.id = 'sk-order-' + oid;
      div.innerHTML =
        '<div class="incoming-card-header">' +
          '<div class="incoming-order-id">#' + oid.slice(-8).toUpperCase() + '</div>' +
          '<div class="incoming-time">' + timeAgo(o.createdAt) + ' &bull; ' + (o.paymentMode || '') + ' &bull; &#8377;' + (o.grandTotal || 0) + '</div>' +
        '</div>' +
        '<div class="incoming-card-body">' +
          '<div class="incoming-customer">' + (o.customerName || '') + ' &bull; ' + (o.orderType || '') + '</div>' +
          '<div class="incoming-items">' + itemsStr + '</div>' +
          '<div class="incoming-total">Total: &#8377;' + (o.grandTotal || 0) + '</div>' +
        '</div>' +
        '<div class="incoming-actions">' +
          '<button class="btn btn-green btn-sm" style="flex:2;" onclick="skAcceptOrder(\'' + oid + '\')">&#10003; Accept</button>' +
          '<button class="btn btn-red btn-sm" style="flex:1;" onclick="skRejectOrder(\'' + oid + '\')">&#10007; Reject</button>' +
        '</div>';
      container.appendChild(div);
    });
  }, function() {});

  window.NearBazaar.unsubscribers.push(unsub);
}

/* ══════════════════════════════════════
   ORDER ACTIONS
══════════════════════════════════════ */
window.skAcceptOrder = function(id) {
  if (!window.FB) return;
  // Disable button immediately
  var card = document.getElementById('sk-order-' + id);
  if (card) {
    var btn = card.querySelector('.btn-green');
    if (btn) { btn.disabled = true; btn.textContent = 'Accepting...'; }
  }

  window.FB.updateDoc(window.FB.doc(window.FB.db, 'orders', id), { status: 'confirmed' })
    .then(function() {
      showToast('Order accepted! Now prepare and pack it.', 2800, 'success');
      // Notify customer that order is confirmed
      window.FB.getDoc(window.FB.doc(window.FB.db, 'orders', id)).then(function(snap) {
        if (snap.exists()) {
          var ord = snap.data();
          if (ord.customerId) {
            sendNotif(ord.customerId, 'order_confirmed',
              (window.currentUserData && window.currentUserData.shopName ? window.currentUserData.shopName : 'Shop') +
              ' accepted your order #' + id.slice(-8).toUpperCase() + ' and is now preparing it!',
              { orderId: id });
          }
        }
      }).catch(function() {});
      // Remove from home screen incoming
      if (card) {
        card.style.opacity = '0';
        card.style.transition = 'opacity 0.3s';
        setTimeout(function() { if (card.parentNode) card.parentNode.removeChild(card); }, 300);
      }
      // Navigate to All Orders → Active tab
      goTo('screen-sk-orders');
      setTimeout(function() { skSwitchOrderTab('active'); }, 200);
    })
    .catch(function(e) {
      showToast('Failed to accept order. Please try again.', 3000, 'error');
      if (card) {
        var btn = card.querySelector('.btn-green');
        if (btn) { btn.disabled = false; btn.innerHTML = '&#10003; Accept'; }
      }
    });
};

window.skRejectOrder = function(id) {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:42px;margin-bottom:10px;">&#10060;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Reject Order?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">The customer will be notified that their order was rejected.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-red btn-full" onclick="closeGlobalModal();doRejectOrder(\'' + id + '\')">Yes, Reject</button>' +
    '</div></div>'
  );
};

window.doRejectOrder = function(id) {
  if (window.FB) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'orders', id), { status: 'rejected' }).catch(function() {});
  }
  var card = document.getElementById('sk-order-' + id);
  if (card) {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s';
    setTimeout(function() { if (card.parentNode) card.parentNode.removeChild(card); }, 300);
  }
  showToast('Order rejected', 2000);
};

window.skMarkPacked = function(id) {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:48px;margin-bottom:12px;">&#128092;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Mark as Packed &amp; Ready?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">This will notify nearby delivery partners to pick up this order.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-green btn-full" onclick="closeGlobalModal();skConfirmPacked(\'' + id + '\')">&#10003; Yes, Packed!</button>' +
    '</div></div>'
  );
};

window.skConfirmPacked = function(id) {
  if (!window.FB) return;
  window.FB.updateDoc(window.FB.doc(window.FB.db, 'orders', id), { status: 'packed' })
    .then(function() {
      showToast('Order packed! Nearby drivers will be notified.', 3000, 'success');
      // Notify customer
      window.FB.getDoc(window.FB.doc(window.FB.db, 'orders', id)).then(function(snap) {
        if (snap.exists()) {
          var ord = snap.data();
          if (ord.customerId) {
            sendNotif(ord.customerId, 'order_packed',
              'Your order from ' + (window.currentUserData && window.currentUserData.shopName ? window.currentUserData.shopName : 'Shop') +
              ' is packed & ready. A delivery partner will pick it up soon!',
              { orderId: id });
          }
        }
      }).catch(function() {});
    })
    .catch(function(e) {
      showToast('Error updating order. Please try again.', 3000, 'error');
    });
};

window.skDispatch = function(id) {
  if (window.FB) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'orders', id), { status: 'otw' }).catch(function() {});
  }
  showToast('Order dispatched to rider!', 2200, 'success');
};

/* ══════════════════════════════════════
   LIVE REQUESTS (Broadcast from customers)
══════════════════════════════════════ */
window.loadLiveRequests = function() {
  if (!window.FB || !window.currentUser) return;
  var db         = window.FB.db;
  var collection = window.FB.collection;
  var query      = window.FB.query;
  var where      = window.FB.where;
  var onSnapshot = window.FB.onSnapshot;
  var limit      = window.FB.limit;

  var radius = (window.currentUserData && window.currentUserData.deliveryRadius) ? window.currentUserData.deliveryRadius : 10;
  var q = query(collection(db, 'requests'), where('status', '==', 'active'), limit(30));

  var unsub = onSnapshot(q, function(snap) {
    var container = document.getElementById('sk-live-requests');
    if (!container) return;

    if (snap.empty) {
      container.innerHTML = '<div style="text-align:center;padding:16px;color:#9ca3af;font-size:13px;font-weight:600;">No broadcast requests right now</div>';
      return;
    }

    var html = '';
    snap.docs.forEach(function(docSnap) {
      var r   = docSnap.data();
      var rid = docSnap.id;

      var dist = '—';
      if (window.NearBazaar.userLocation && window.NearBazaar.userLocation.lat && r.location && r.location.lat) {
        dist = calcDistance(window.NearBazaar.userLocation.lat, window.NearBazaar.userLocation.lng, r.location.lat, r.location.lng).toFixed(1);
        // Only filter if both parties have real coordinates and dist > radius
        if (parseFloat(dist) > radius) return;
      }

      var rcName  = (r.customerName || 'Customer').replace(/'/g, "\\'");
      var rItems  = (r.items || []).join(',').replace(/'/g, "\\'");
      var noteH   = r.note ? '<div class="live-req-note">&quot;' + r.note + '&quot;</div>' : '';
      var itemStr = (r.items || []).join(', ');
      var ago     = timeAgo(r.createdAt);

      html +=
        '<div class="live-req-card">' +
          '<div class="live-req-header">' +
            '<div class="live-req-dot"></div>' +
            '<div class="live-req-title">' + (r.customerName || 'Customer') + (dist !== '—' ? ' &bull; ' + dist + ' km' : '') + '</div>' +
            '<div class="live-req-time">' + ago + '</div>' +
          '</div>' +
          '<div class="live-req-body">' +
            '<div class="live-req-customer">Wants: ' + itemStr + '</div>' +
            noteH +
          '</div>' +
          '<div class="live-req-actions">' +
            '<button class="btn btn-blue btn-sm" style="flex:2;" onclick="showRespondModal(\'' + rid + '\',\'' + rcName + '\',\'' + rItems + '\')">Send Quote</button>' +
            '<button class="btn btn-light btn-sm" style="flex:1;" onclick="ignoreRequest(this)">Ignore</button>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html || '<div style="text-align:center;padding:16px;color:#9ca3af;font-size:13px;font-weight:600;">No requests within ' + radius + ' km</div>';
  }, function() {});

  window.NearBazaar.unsubscribers.push(unsub);
};

window.ignoreRequest = function(btn) {
  var card = btn.parentNode;
  while (card && !card.classList.contains('live-req-card')) card = card.parentNode;
  if (card) {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s';
    setTimeout(function() { if (card.parentNode) card.parentNode.removeChild(card); }, 300);
  }
};

/* ══════════════════════════════════════
   RESPOND / SEND QUOTE
══════════════════════════════════════ */
var _currentRespondReqId = null;

window.showRespondModal = function(reqId, customerName, items) {
  _currentRespondReqId = reqId;

  var info = document.getElementById('respond-customer-info');
  var form = document.getElementById('respond-items-form');
  var eta  = document.getElementById('respond-eta');
  var note = document.getElementById('respond-note');

  if (info) info.textContent = 'Customer: ' + customerName + ' — Wants: ' + items.replace(/,/g, ', ');
  if (eta)  eta.value = '30';
  if (note) note.value = '';

  if (form) {
    form.innerHTML = '';
    var header = document.createElement('div');
    header.style.cssText = 'font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:10px;';
    header.textContent = 'Set price per item:';
    form.appendChild(header);

    var itemList = items ? items.split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [];
    itemList.forEach(function(itemName, idx) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;';

      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-size:13px;font-weight:700;color:#1f2937;flex:1;';
      nameEl.textContent = itemName;

      var priceWrap = document.createElement('div');
      priceWrap.style.cssText = 'display:flex;align-items:center;gap:4px;';

      var rupee = document.createElement('span');
      rupee.style.cssText = 'font-size:13px;font-weight:700;color:#374151;';
      rupee.textContent = '\u20B9';

      var input = document.createElement('input');
      input.type = 'number';
      input.className = 'respond-price-input';
      input.id = 'rp-' + idx;
      input.placeholder = '0';
      input.min = '0';
      input.style.cssText = 'width:80px;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-weight:700;outline:none;font-family:inherit;text-align:center;';

      priceWrap.appendChild(rupee);
      priceWrap.appendChild(input);
      row.appendChild(nameEl);
      row.appendChild(priceWrap);
      form.appendChild(row);
    });

    if (!itemList.length) {
      var emptyEl = document.createElement('div');
      emptyEl.style.cssText = 'font-size:13px;color:#9ca3af;padding:10px 0;';
      emptyEl.textContent = 'No items specified';
      form.appendChild(emptyEl);
    }
  }

  var overlay = document.getElementById('respond-overlay');
  if (overlay) overlay.classList.add('open');
};

window.closeRespondModal = function() {
  var overlay = document.getElementById('respond-overlay');
  if (overlay) overlay.classList.remove('open');
};

window.sendQuote = async function() {
  var prices     = document.querySelectorAll('#respond-items-form .respond-price-input');
  var totalPrice = 0;
  prices.forEach(function(inp) { totalPrice += parseFloat(inp.value) || 0; });
  if (!totalPrice) { showToast('Enter at least one price', 2200, 'error'); return; }

  var eta  = document.getElementById('respond-eta')  ? document.getElementById('respond-eta').value  : 30;
  var note = document.getElementById('respond-note') ? document.getElementById('respond-note').value : '';
  var data = window.currentUserData || {};

  if (window.FB && _currentRespondReqId) {
    var db         = window.FB.db;
    var doc        = window.FB.doc;
    var updateDoc  = window.FB.updateDoc;
    var arrayUnion = window.FB.arrayUnion;
    try {
      await updateDoc(doc(db, 'requests', _currentRespondReqId), {
        responses: arrayUnion({
          shopId:    window.currentUser ? window.currentUser.uid : '',
          shopName:  data.shopName || data.name || 'Shop',
          totalPrice: totalPrice,
          eta:       parseInt(eta) || 30,
          note:      note
        })
      });
    } catch(e) { console.error('sendQuote error:', e); }
  }

  closeRespondModal();
  showToast('Quote sent to customer!', 2500, 'success');
};

/* ══════════════════════════════════════
   INVENTORY — REAL DATA
══════════════════════════════════════ */
var skInventoryData = [];
var skSelectedItems = new Set();

window.loadSKInventory = async function() {
  if (!window.FB || !window.currentUser) return;
  var list = document.getElementById('sk-inventory-list');
  if (list) list.innerHTML = '<div style="text-align:center;padding:40px;"><div class="spinner"></div></div>';

  try {
    var db         = window.FB.db;
    var collection = window.FB.collection;
    var query      = window.FB.query;
    var where      = window.FB.where;
    var getDocs    = window.FB.getDocs;

    var q    = query(collection(db, 'inventory'), where('shopId', '==', window.currentUser.uid));
    var snap = await getDocs(q);
    skInventoryData = snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); });
    renderSKInventory();

    var countEl = document.getElementById('sk-inventory-count');
    if (countEl) countEl.textContent = skInventoryData.length;
  } catch(e) {
    console.error('loadSKInventory error:', e);
    if (list) list.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128230;</div><div class="empty-title">Could not load inventory</div><button class="btn btn-orange btn-sm" onclick="loadSKInventory()" style="margin-top:10px;">Retry</button></div>';
  }
};

function renderSKInventory(filter) {
  filter = filter || '';
  var list = document.getElementById('sk-inventory-list');
  if (!list) return;
  var items = filter
    ? skInventoryData.filter(function(i) { return i.name && i.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1; })
    : skInventoryData;

  if (!items.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128230;</div><div class="empty-title">' + (filter ? 'No results found' : 'No products yet') + '</div><div class="empty-sub">Tap + Add Product to get started.</div></div>';
    return;
  }

  var html = '';
  items.forEach(function(item) {
    var imgHtml    = item.imageUrl ? '<img src="' + item.imageUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="">' : (item.emoji || '&#127873;');
    var mrpHtml    = (item.mrp && item.mrp > item.price) ? ' <s style="color:#d1d5db;">&#8377;' + item.mrp + '</s>' : '';
    var stockBadge = item.inStock ? '<span class="badge badge-green" style="font-size:9px;">In Stock</span>' : '<span class="badge badge-gray" style="font-size:9px;">Out of Stock</span>';
    var safeName   = String(item.name || '').replace(/'/g, "\\'");
    var stockVal   = (item.stock !== undefined && item.stock !== null) ? item.stock : '—';

    html +=
      '<div class="inv-item-row" id="inv-row-' + item.id + '">' +
        '<input type="checkbox" class="inv-checkbox" id="inv-chk-' + item.id + '" onchange="toggleItemSelect(\'' + item.id + '\',this.checked)" style="width:18px;height:18px;flex-shrink:0;cursor:pointer;">' +
        '<div class="inv-img" style="overflow:hidden;">' + imgHtml + '</div>' +
        '<div class="inv-info">' +
          '<div class="inv-name">' + (item.name || '') + '</div>' +
          '<div class="inv-meta">&#8377;' + item.price + mrpHtml + ' &bull; Stock: ' + stockVal + '</div>' +
          '<div style="margin-top:2px;">' + stockBadge + '<span class="badge badge-gray" style="font-size:9px;margin-left:4px;">' + (item.category || 'General') + '</span></div>' +
        '</div>' +
        '<div class="inv-actions" style="display:flex;flex-direction:column;gap:4px;">' +
          '<button class="btn btn-blue btn-sm" style="font-size:11px;padding:6px 10px;" onclick="editInvItem(\'' + item.id + '\')">&#9998; Edit</button>' +
          '<button class="btn btn-red btn-sm" style="font-size:11px;padding:6px 10px;" onclick="showDeleteConfirm(\'' + item.id + '\',\'' + safeName + '\')">&#128465;</button>' +
        '</div>' +
      '</div>';
  });
  list.innerHTML = html;
}

window.skSearchInventory = function(q) { renderSKInventory(q); };

window.toggleItemSelect = function(id, checked) {
  if (checked) skSelectedItems.add(id); else skSelectedItems.delete(id);
  var bulkBtn = document.getElementById('sk-bulk-del-btn');
  if (bulkBtn) bulkBtn.style.display = skSelectedItems.size > 0 ? '' : 'none';
};

window.toggleSelectAll = function(checked) {
  skInventoryData.forEach(function(item) {
    var chk = document.getElementById('inv-chk-' + item.id);
    if (chk) { chk.checked = checked; window.toggleItemSelect(item.id, checked); }
  });
};

window.showDeleteConfirm = function(id, name) {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:42px;margin-bottom:12px;">&#128465;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Delete Product?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">"' + name + '" will be permanently removed.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-red btn-full" onclick="closeGlobalModal();deleteInvItem(\'' + id + '\')">Delete</button>' +
    '</div></div>'
  );
};

window.deleteInvItem = async function(id) {
  skInventoryData = skInventoryData.filter(function(i) { return i.id !== id; });
  var row = document.getElementById('inv-row-' + id);
  if (row) { row.style.opacity = '0'; row.style.transition = 'opacity 0.3s'; setTimeout(function() { if (row.parentNode) row.parentNode.removeChild(row); }, 300); }
  showToast('Product removed', 2000, 'success');
  if (window.FB && window.currentUser) {
    try { await window.FB.deleteDoc(window.FB.doc(window.FB.db, 'inventory', id)); } catch(e) {}
  }
  var countEl = document.getElementById('sk-inventory-count');
  if (countEl) countEl.textContent = skInventoryData.length;
};

window.bulkDeleteSelected = function() {
  if (!skSelectedItems.size) return;
  var count = skSelectedItems.size;
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:42px;margin-bottom:12px;">&#128465;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Delete ' + count + ' item' + (count === 1 ? '' : 's') + '?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">These products will be permanently removed.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-red btn-full" onclick="closeGlobalModal();confirmBulkDelete()">Delete All</button>' +
    '</div></div>'
  );
};

window.confirmBulkDelete = async function() {
  var ids = Array.from(skSelectedItems);
  skInventoryData = skInventoryData.filter(function(i) { return ids.indexOf(i.id) === -1; });
  ids.forEach(function(id) {
    var row = document.getElementById('inv-row-' + id);
    if (row && row.parentNode) row.parentNode.removeChild(row);
    if (window.FB) window.FB.deleteDoc(window.FB.doc(window.FB.db, 'inventory', id)).catch(function() {});
  });
  skSelectedItems.clear();
  var bulkBtn  = document.getElementById('sk-bulk-del-btn');
  var allChk   = document.getElementById('sk-select-all');
  var countEl  = document.getElementById('sk-inventory-count');
  if (bulkBtn) bulkBtn.style.display = 'none';
  if (allChk)  allChk.checked = false;
  if (countEl) countEl.textContent = skInventoryData.length;
  showToast(ids.length + ' products deleted', 2000, 'success');
};

window.editInvItem = function(id) {
  var item = null;
  for (var i = 0; i < skInventoryData.length; i++) { if (skInventoryData[i].id === id) { item = skInventoryData[i]; break; } }
  if (!item) return;
  var titleEl = document.getElementById('add-item-modal-title');
  if (titleEl) titleEl.textContent = 'Edit Product';
  var fields = { 'item-name': item.name, 'item-desc': item.desc, 'item-price': item.price, 'item-mrp': item.mrp, 'item-stock': item.stock, 'item-img-url': item.imageUrl, 'edit-item-id': id };
  for (var fId in fields) { var el = document.getElementById(fId); if (el && fields[fId] !== undefined) el.value = fields[fId]; }
  var catEl = document.getElementById('item-category');
  if (catEl && item.category) catEl.value = item.category;
  if (item.imageUrl) {
    var prev = document.getElementById('item-img-preview');
    var src  = document.getElementById('item-img-preview-src');
    var area = document.getElementById('item-upload-area');
    if (src)  src.src = item.imageUrl;
    if (prev) prev.style.display = '';
    if (area) area.style.display = 'none';
  }
  showAddItemModal();
};

window.showAddItemModal = function() {
  var overlay = document.getElementById('add-item-overlay');
  if (overlay) overlay.classList.add('open');
};

window.closeAddItemModal = function() {
  var overlay = document.getElementById('add-item-overlay');
  if (overlay) overlay.classList.remove('open');
  var fields = ['item-name','item-desc','item-price','item-mrp','item-stock','item-img-url','edit-item-id'];
  fields.forEach(function(fId) { var el = document.getElementById(fId); if (el) el.value = ''; });
  var prev  = document.getElementById('item-img-preview');
  var area  = document.getElementById('item-upload-area');
  var title = document.getElementById('add-item-modal-title');
  if (prev)  prev.style.display  = 'none';
  if (area)  area.style.display  = '';
  if (title) title.textContent   = 'Add Product';
};

window.clearItemImage = function() {
  var imgUrl = document.getElementById('item-img-url');
  var prev   = document.getElementById('item-img-preview');
  var area   = document.getElementById('item-upload-area');
  if (imgUrl) imgUrl.value = '';
  if (prev)   prev.style.display = 'none';
  if (area)   area.style.display = '';
};

window.triggerItemImageUpload = function() {
  var inp = document.getElementById('item-img-input');
  if (inp) inp.click();
};

window.handleItemImageUpload = async function(input) {
  var file = input.files[0];
  if (!file) return;
  showToast('Uploading image...', 2000);
  var url = await uploadToCloudinary(file, 'NearBazaar/products');
  if (url) {
    var imgUrl = document.getElementById('item-img-url');
    var prev   = document.getElementById('item-img-preview');
    var src    = document.getElementById('item-img-preview-src');
    var area   = document.getElementById('item-upload-area');
    if (imgUrl) imgUrl.value = url;
    if (src)    src.src      = url;
    if (prev)   prev.style.display = '';
    if (area)   area.style.display = 'none';
    showToast('Image uploaded!', 1800, 'success');
  }
};

window.saveInventoryItem = async function() {
  var nameEl  = document.getElementById('item-name');
  var priceEl = document.getElementById('item-price');
  var editId  = document.getElementById('edit-item-id') ? document.getElementById('edit-item-id').value : '';
  var name    = nameEl  ? nameEl.value.trim()  : '';
  var price   = priceEl ? parseFloat(priceEl.value) : 0;
  if (!name)         { showToast('Product name is required', 2200, 'error'); return; }
  if (!price || price <= 0) { showToast('Enter a valid price', 2200, 'error'); return; }

  var getVal = function(id) { var el = document.getElementById(id); return el ? el.value : ''; };
  var itemData = {
    name:     name,
    price:    price,
    desc:     getVal('item-desc'),
    mrp:      parseFloat(getVal('item-mrp'))   || price,
    stock:    parseInt(getVal('item-stock'))   || 0,
    category: getVal('item-category') || 'General',
    imageUrl: getVal('item-img-url')  || '',
    inStock:  true,
    shopId:   window.currentUser ? window.currentUser.uid : '',
    shopName: (window.currentUserData && window.currentUserData.shopName) || ''
  };

  if (editId) {
    for (var i = 0; i < skInventoryData.length; i++) {
      if (skInventoryData[i].id === editId) { Object.assign(skInventoryData[i], itemData); break; }
    }
    if (window.FB) {
      var db         = window.FB.db;
      var doc        = window.FB.doc;
      var updateDoc  = window.FB.updateDoc;
      var serverTimestamp = window.FB.serverTimestamp;
      await updateDoc(doc(db, 'inventory', editId), Object.assign({}, itemData, { updatedAt: serverTimestamp() })).catch(function() {});
    }
    showToast(name + ' updated!', 2200, 'success');
  } else {
    var newId = 'local-' + Date.now();
    if (window.FB) {
      var db2         = window.FB.db;
      var collection2 = window.FB.collection;
      var addDoc      = window.FB.addDoc;
      var sTs         = window.FB.serverTimestamp;
      try {
        var ref = await addDoc(collection2(db2, 'inventory'), Object.assign({}, itemData, { createdAt: sTs() }));
        newId = ref.id;
      } catch(e) { console.error('addDoc inventory error:', e); }
    }
    skInventoryData.unshift(Object.assign({ id: newId }, itemData));
    showToast(name + ' added!', 2200, 'success');
  }

  renderSKInventory();
  closeAddItemModal();
  var countEl = document.getElementById('sk-inventory-count');
  if (countEl) countEl.textContent = skInventoryData.length;
};

/* ══════════════════════════════════════
   ANALYTICS
══════════════════════════════════════ */
window.loadSKAnalytics = async function() {
  if (!window.FB || !window.currentUser) return;
  var content = document.getElementById('sk-analytics-content');
  if (!content) return;
  content.innerHTML = '<div style="text-align:center;padding:40px;"><div class="spinner"></div></div>';

  try {
    var db         = window.FB.db;
    var collection = window.FB.collection;
    var query      = window.FB.query;
    var where      = window.FB.where;
    var getDocs    = window.FB.getDocs;

    var q    = query(collection(db, 'orders'), where('shopId', '==', window.currentUser.uid));
    var snap = await getDocs(q);

    var total      = 0;
    var count      = 0;
    var itemCounts = {};
    var validSts   = ['delivered', 'confirmed', 'packed', 'otw'];

    snap.docs.forEach(function(d) {
      var o = d.data();
      if (validSts.indexOf(o.status) === -1) return;
      total += o.grandTotal || 0;
      count++;
      if (o.items && o.items.length) {
        o.items.forEach(function(it) {
          itemCounts[it.name] = (itemCounts[it.name] || 0) + (it.qty || 1);
        });
      }
    });

    var topItems = Object.keys(itemCounts).map(function(k) { return [k, itemCounts[k]]; });
    topItems.sort(function(a, b) { return b[1] - a[1]; });
    topItems = topItems.slice(0, 5);

    var topHtml = '';
    if (topItems.length) {
      topItems.forEach(function(item) {
        topHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #f3f4f6;"><span style="font-size:13px;font-weight:600;color:#374151;">' + item[0] + '</span><span style="font-size:12px;font-weight:800;color:#166534;">' + item[1] + ' sold</span></div>';
      });
    } else {
      topHtml = '<div style="text-align:center;padding:20px;color:#9ca3af;">No data yet</div>';
    }

    var avgOrder = count ? Math.round(total / count) : 0;
    content.innerHTML =
      '<div style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;text-align:center;"><div style="font-size:24px;font-weight:900;color:#166534;">&#8377;' + Math.round(total) + '</div><div style="font-size:11px;color:#6b7280;font-weight:600;margin-top:4px;">Total Revenue</div></div>' +
          '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;text-align:center;"><div style="font-size:24px;font-weight:900;color:#b45309;">' + count + '</div><div style="font-size:11px;color:#6b7280;font-weight:600;margin-top:4px;">Total Orders</div></div>' +
        '</div>' +
        '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;">' +
          '<div style="font-size:13px;font-weight:800;color:#111827;margin-bottom:12px;">&#127775; Top Products</div>' + topHtml +
        '</div>' +
        '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;">' +
          '<div style="font-size:13px;font-weight:800;color:#111827;margin-bottom:8px;">&#128202; Avg Order Value</div>' +
          '<div style="font-size:22px;font-weight:900;color:#1d4ed8;">&#8377;' + avgOrder + '</div>' +
        '</div>' +
      '</div>';
  } catch(e) {
    if (content) content.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128202;</div><div class="empty-title">Analytics unavailable</div></div>';
  }
};

/* ══════════════════════════════════════
   SHOP DETAILS EDIT
══════════════════════════════════════ */
window.editShopDetails = function() {
  var data       = window.currentUserData || {};
  var shopName   = (data.shopName   || '').replace(/"/g, '&quot;');
  var phone      = (data.phone      || '').replace(/"/g, '&quot;');
  var address    = (data.address    || '').replace(/"/g, '&quot;');
  var categories = ['General','Grocery','Medical','Food','Vegetables','Electronics','Bakery','Dairy'];
  var catOptions = categories.map(function(c) {
    return '<option' + (data.shopCategory === c ? ' selected' : '') + '>' + c + '</option>';
  }).join('');
  showModal(
    '<div class="form-group"><label>Shop Name</label><input type="text" id="es-shopname" value="' + shopName + '"></div>' +
    '<div class="form-group"><label>Shop Phone</label><input type="tel" id="es-phone" value="' + phone + '" placeholder="10-digit mobile"></div>' +
    '<div class="form-group"><label>Shop Address</label><input type="text" id="es-address" value="' + address + '"></div>' +
    '<div class="form-group"><label>Category</label><select id="es-category" style="width:100%;padding:11px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;outline:none;font-family:inherit;background:white;">' + catOptions + '</select></div>' +
    '<button class="btn btn-orange btn-full" onclick="saveShopDetails()" style="margin-top:8px;">Save Changes</button>',
    'Edit Shop Details'
  );
};

window.saveShopDetails = async function() {
  var shopName     = document.getElementById('es-shopname')  ? document.getElementById('es-shopname').value.trim()  : '';
  var phone        = document.getElementById('es-phone')     ? document.getElementById('es-phone').value.trim()     : '';
  var address      = document.getElementById('es-address')   ? document.getElementById('es-address').value.trim()   : '';
  var shopCategory = document.getElementById('es-category')  ? document.getElementById('es-category').value         : '';
  if (!shopName) { showToast('Shop name cannot be empty', 2200, 'error'); return; }
  var ok = await updateUserProfile({ shopName: shopName, phone: phone, address: address, shopCategory: shopCategory });
  if (ok) {
    closeGlobalModal();
    initShopkeeper();
    if (window.FB && window.currentUser) {
      window.FB.setDoc(window.FB.doc(window.FB.db, 'shops', window.currentUser.uid), {
        shopName: shopName, shopCategory: shopCategory, address: address, phone: phone,
        ownerId: window.currentUser.uid,
        rating: (window.currentUserData && window.currentUserData.rating) || 0,
        reviewCount: (window.currentUserData && window.currentUserData.reviewCount) || 0,
        shopOpen: (window.currentUserData && window.currentUserData.shopOpen) || false,
        location: window.NearBazaar.userLocation || null
      }, { merge: true }).catch(function() {});
    }
  }
};

window.changeSkProfilePhoto = function() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async function(e) {
    var file = e.target.files[0];
    if (!file) return;
    showToast('Uploading...', 2000);
    var url = await uploadToCloudinary(file, 'NearBazaar/avatars');
    if (url) { await updateUserProfile({ photoURL: url }); initShopkeeper(); }
  };
  input.click();
};

window.confirmSignOutSK = function() {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:48px;margin-bottom:12px;">&#128682;</div>' +
    '<div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:6px;">Sign Out?</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-red btn-full" onclick="signOut()">Sign Out</button>' +
    '</div></div>'
  );
};

// Legacy aliases
window.acceptOrder    = window.skAcceptOrder;
window.rejectOrder    = window.doRejectOrder;
window.markOrderReady = window.skConfirmPacked;
