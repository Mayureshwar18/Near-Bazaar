/* ═══════════════════════════════════════════════════════════════
   NearBazaar — driver.js (FIXED v1.1)
   Delivery Partner Panel: Real orders from Firestore, live location
═══════════════════════════════════════════════════════════════ */
'use strict';

(function injectDriverScreens() {
  const container = document.getElementById('driver-screens-container');
  if (!container) return;

  container.innerHTML = `
  <!-- DRIVER HOME -->
  <div class="screen" id="screen-drv-home">
    <div class="drv-header">
      <div class="drv-header-top">
        <div class="drv-name-row">
          <div class="drv-greeting">Good Morning,</div>
          <div class="drv-name">Rider</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button class="icon-btn" onclick="goTo('screen-drv-notifs')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot" id="drv-notif-dot" style="display:none;"></span>
          </button>
          <div class="avatar" onclick="goTo('screen-drv-profile')">DV</div>
        </div>
      </div>
      <div class="drv-online-bar" onclick="toggleDriverOnline()">
        <div class="drv-online-text">
          <div class="drv-online-label">Go Online to Accept Orders</div>
          <div class="drv-online-sub">You are currently <span id="drv-status-sub">offline</span></div>
        </div>
        <div class="toggle blue" id="drv-online-toggle"></div>
        <div class="drv-status-badge offline" id="drv-status-badge">Offline</div>
      </div>
    </div>

    <div class="drv-stats">
      <div class="drv-stat"><div class="drv-stat-val blue" id="drv-today-orders">0</div><div class="drv-stat-lbl">Today's Deliveries</div></div>
      <div class="drv-stat"><div class="drv-stat-val green" id="drv-today-earn">&#8377;0</div><div class="drv-stat-lbl">Today's Earnings</div></div>
      <div class="drv-stat"><div class="drv-stat-val amber" id="drv-rating">—</div><div class="drv-stat-lbl">Rating</div></div>
    </div>

    <div class="scroll-area">
      <!-- Location bar -->
      <div style="margin:12px 20px 0;background:var(--blue-light,#dbeafe);border:1.5px solid #93c5fd;border-radius:var(--radius-sm);padding:10px 14px;display:flex;align-items:center;gap:10px;" onclick="drvDetectLocation()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span id="drv-location-text" style="font-size:12px;font-weight:700;color:#1d4ed8;flex:1;">Tap to detect your location</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      <!-- New orders nearby -->
      <div class="sec-hdr" style="margin-top:14px;">
        <span class="sec-hdr-left">&#128308; Available Orders Nearby</span>
        <span class="sec-hdr-right" onclick="loadNearbyOrders()">Refresh</span>
      </div>
      <div id="drv-new-orders-list">
        <div style="text-align:center;padding:32px;color:var(--gray-400);">
          <div style="font-size:36px;margin-bottom:8px;">&#128666;</div>
          <div style="font-weight:700;font-size:14px;">Go online to see nearby orders</div>
        </div>
      </div>

      <!-- Active delivery -->
      <div id="drv-active-delivery-section" style="display:none;">
        <div class="sec-hdr"><span class="sec-hdr-left">&#128666; Active Delivery</span></div>
        <div id="drv-active-delivery-card"></div>
      </div>

      <div style="height:24px;"></div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active" onclick="goTo('screen-drv-home')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Home</div>
      <div class="nav-item" onclick="loadDrvOrders();goTo('screen-drv-orders')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>History</div>
      <div class="nav-item" onclick="goTo('screen-drv-earnings')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Earnings</div>
      <div class="nav-item" onclick="goTo('screen-drv-profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Profile</div>
    </div>
  </div>

  <!-- DRIVER ORDERS HISTORY -->
  <div class="screen" id="screen-drv-orders">
    <div class="top-bar blue" style="background:linear-gradient(160deg,var(--blue-dark),var(--blue));">
      <button class="back-btn" onclick="goTo('screen-drv-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Delivery History</h2>
    </div>
    <div class="scroll-area" id="drv-orders-list">
      <div style="text-align:center;padding:40px;"><div class="spinner"></div></div>
    </div>
  </div>

  <!-- DRIVER EARNINGS -->
  <div class="screen" id="screen-drv-earnings">
    <div class="top-bar blue" style="background:linear-gradient(160deg,var(--blue-dark),var(--blue));">
      <button class="back-btn" onclick="goTo('screen-drv-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Earnings</h2>
    </div>
    <div class="scroll-area" id="drv-earnings-content">
      <div style="text-align:center;padding:40px;"><div class="spinner"></div></div>
    </div>
  </div>

  <!-- DRIVER NOTIFICATIONS -->
  <div class="screen" id="screen-drv-notifs">
    <div class="top-bar blue" style="background:linear-gradient(160deg,var(--blue-dark),var(--blue));">
      <button class="back-btn" onclick="goTo('screen-drv-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Notifications</h2>
        <div style="display:flex;gap:8px;">
          <button style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;" onclick="markNotifsRead()">Mark read</button>
          <button id="drv-notif-clear-btn" style="background:rgba(239,68,68,.3);border:1px solid rgba(239,68,68,.5);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;">Clear all</button>
        </div>
      </div>
    </div>
    <div class="scroll-area" id="drv-notifs-list">
      <div style="text-align:center;padding:60px 20px;color:var(--gray-400);"><div style="font-size:40px;margin-bottom:8px;">&#128276;</div><div style="font-weight:700;">No notifications</div></div>
    </div>
  </div>

  <!-- DRIVER PROFILE -->
  <div class="screen" id="screen-drv-profile">
    <div style="flex-shrink:0;">
      <div class="profile-hero" style="background:linear-gradient(160deg,var(--blue-dark),var(--blue));">
        <button class="back-btn" style="position:absolute;top:calc(env(safe-area-inset-top,0px)+14px);left:16px;" onclick="goTo('screen-drv-home')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back</button>
        <div class="profile-avatar-lg" id="drv-profile-avatar">DV<div class="profile-cam-btn" onclick="changeDrvPhoto()">&#128247;</div></div>
        <div class="profile-name" id="drv-profile-name">Driver</div>
        <div class="profile-email" id="drv-profile-email">driver@email.com</div>
        <div class="profile-role-badge" style="background:rgba(255,255,255,.2);">&#128666; Delivery Partner</div>
      </div>
      <div class="stat-strip">
        <div class="stat-pill"><div class="stat-pill-val blue" id="drv-prof-deliveries">0</div><div class="stat-pill-lbl">Deliveries</div></div>
        <div class="stat-pill green"><div class="stat-pill-val green" id="drv-prof-earnings">&#8377;0</div><div class="stat-pill-lbl">Earnings</div></div>
        <div class="stat-pill amber"><div class="stat-pill-val amber" id="drv-prof-rating">—</div><div class="stat-pill-lbl">Rating</div></div>
      </div>
      <div class="switch-role-bar">
        <span style="font-size:11px;font-weight:700;color:var(--gray-500);white-space:nowrap;align-self:center;">Switch to:</span>
        <div class="switch-role-btn" onclick="switchRole('customer')">&#128100; Customer</div>
        <div class="switch-role-btn" onclick="switchRole('shopkeeper')">&#127981; Shopkeeper</div>
      </div>
    </div>
    <div class="scroll-area">
      <!-- Vehicle details -->
      <div style="margin:16px 20px 0;background:white;border-radius:var(--radius);padding:16px;border:1.5px solid var(--gray-100);">
        <div style="font-size:13px;font-weight:800;color:var(--gray-900);margin-bottom:12px;">&#128663; Vehicle Details</div>
        <div class="form-group"><label>Vehicle Number</label><input type="text" id="drv-vehicle-num" placeholder="e.g. MH12 AB 1234"></div>
        <div class="form-group"><label>Vehicle Type</label>
          <select id="drv-vehicle-type" style="width:100%;padding:10px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;outline:none;font-family:var(--font-body);">
            <option>Bike</option><option>Scooter</option><option>Cycle</option><option>Auto</option><option>Car</option>
          </select>
        </div>
        <button class="btn btn-blue btn-full btn-sm" onclick="saveDrvVehicle()">Save Vehicle Details</button>
      </div>
      <div class="profile-menu-item" style="margin-top:8px;" onclick="confirmSignOutDrv()"><div class="profile-menu-icon red">&#128682;</div><div><div class="profile-menu-label" style="color:var(--red-dark);">Sign Out</div></div></div>
    </div>
  </div>
  `;
})();

/* ══════════════════════════════════════
   INIT DRIVER
══════════════════════════════════════ */
window.initDriver = function() {
  updateHeaderUser('delivery');
  const data = window.currentUserData || {};

  const pn  = document.getElementById('drv-profile-name');
  const pe  = document.getElementById('drv-profile-email');
  const pa  = document.getElementById('drv-profile-avatar');
  const pd  = document.getElementById('drv-prof-deliveries');
  const pe2 = document.getElementById('drv-prof-earnings');
  const pr  = document.getElementById('drv-prof-rating');
  const rat = document.getElementById('drv-rating');

  if (pn)  pn.textContent  = data.name || 'Rider';
  if (pe)  pe.textContent  = data.email || '';
  if (pa) {
    var drvPhoto = data.photoURL
      ? '<img src="' + data.photoURL + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
      : getUserInitials(data.name || 'DV');
    pa.innerHTML = drvPhoto + '<div class="profile-cam-btn" onclick="changeDrvPhoto()">&#128247;</div>';
  }
  if (pd)  pd.textContent  = data.totalDeliveries || 0;
  if (pe2) pe2.innerHTML   = '&#8377;' + (data.totalEarnings || 0);
  if (pr)  pr.textContent  = data.rating ? data.rating.toFixed(1) : '—';
  if (rat) rat.textContent = data.rating ? data.rating.toFixed(1) : '—';
  // Update from live data
  var profDel = document.getElementById('drv-prof-deliveries');
  var profEarn = document.getElementById('drv-prof-earnings');
  if (profDel) profDel.textContent = data.totalDeliveries || 0;
  if (profEarn) profEarn.innerHTML = '&#8377;' + (data.totalEarnings || 0);

  // Vehicle details
  const vNum  = document.getElementById('drv-vehicle-num');
  const vType = document.getElementById('drv-vehicle-type');
  if (vNum && data.vehicleNumber)  vNum.value  = data.vehicleNumber;
  if (vType && data.vehicleType)   vType.value = data.vehicleType;

  // Online status
  const toggle = document.getElementById('drv-online-toggle');
  const badge  = document.getElementById('drv-status-badge');
  const sub    = document.getElementById('drv-status-sub');
  if (toggle) toggle.classList.toggle('on', data.isOnline);
  if (badge)  { badge.textContent = data.isOnline ? 'Online' : 'Offline'; badge.className = 'drv-status-badge ' + (data.isOnline ? 'online' : 'offline'); }
  if (sub)    sub.textContent = data.isOnline ? 'online' : 'offline';

  // Location
  if (window.NearBazaar.userLocation?.label) {
    const locEl = document.getElementById('drv-location-text');
    if (locEl) locEl.textContent = window.NearBazaar.userLocation.label;
  } else {
    drvDetectLocation();
  }

  if (data.isOnline) loadNearbyOrders();
  loadDrvEarnings();
  // Use shared notification system
  if (typeof setupNotifScreen === 'function') {
    setupNotifScreen('drv-notifs-list', 'drv-notif-dot', 'drv-notif-clear-btn');
  }
};

/* ══════════════════════════════════════
   DRIVER LOCATION
══════════════════════════════════════ */
window.drvDetectLocation = function() {
  const locEl = document.getElementById('drv-location-text');
  if (locEl) locEl.textContent = 'Detecting location...';

  navigator.geolocation?.getCurrentPosition(async (pos) => {
    window.NearBazaar.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=en`);
      const data = await res.json();
      const addr = data.address || {};
      const label = [addr.suburb||addr.neighbourhood||'', addr.city||addr.town||''].filter(Boolean).join(', ');
      window.NearBazaar.userLocation.label = label;
      if (locEl) locEl.textContent = label || 'Location detected';
    } catch(e) { if (locEl) locEl.textContent = 'Location detected'; }

    // Update driver location in Firestore
    if (window.currentUser && window.FB) {
      window.FB.updateDoc(window.FB.doc(window.FB.db, 'users', window.currentUser.uid), {
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
      }).catch(() => {});
    }
  }, (err) => {
    if (locEl) locEl.textContent = 'Tap to enable location';
    showToast('Enable location to see nearby orders', 3000, 'error');
  }, { enableHighAccuracy: true, timeout: 12000 });
};

/* ══════════════════════════════════════
   ONLINE TOGGLE
══════════════════════════════════════ */
window.toggleDriverOnline = async function() {
  const toggle = document.getElementById('drv-online-toggle');
  const badge  = document.getElementById('drv-status-badge');
  const sub    = document.getElementById('drv-status-sub');
  if (!toggle) return;

  toggle.classList.toggle('on');
  const isOnline = toggle.classList.contains('on');

  if (badge) { badge.textContent = isOnline ? 'Online' : 'Offline'; badge.className = 'drv-status-badge ' + (isOnline ? 'online' : 'offline'); }
  if (sub)   sub.textContent = isOnline ? 'online' : 'offline';

  showToast(isOnline ? 'You are now Online ✓' : 'You are now Offline', 2200, isOnline ? 'success' : 'default');

  if (window.FB && window.currentUser) {
    await window.FB.updateDoc(window.FB.doc(window.FB.db, 'users', window.currentUser.uid), { isOnline }).catch(() => {});
  }

  if (isOnline) {
    drvDetectLocation();
    loadNearbyOrders();
  } else {
    const list = document.getElementById('drv-new-orders-list');
    if (list) list.innerHTML = '<div style="text-align:center;padding:32px;color:#9ca3af;"><div style="font-size:36px;margin-bottom:8px;">&#128666;</div><div style="font-weight:700;font-size:14px;">Go online to see nearby orders</div></div>';
  }
};

/* ══════════════════════════════════════
   LOAD NEARBY ORDERS — REAL FROM FIRESTORE
══════════════════════════════════════ */
window.loadNearbyOrders = async function() {
  if (!window.FB || !window.currentUser) return;
  const isOnline = document.getElementById('drv-online-toggle')?.classList.contains('on');
  if (!isOnline) return;

  const list = document.getElementById('drv-new-orders-list');
  if (list) list.innerHTML = '<div style="text-align:center;padding:32px;"><div class="spinner"></div></div>';

  try {
    const { db, collection, query, where, getDocs, orderBy, limit } = window.FB;
    // Orders that are packed (ready for pickup) with no driver assigned
    // No orderBy - avoids composite index requirement
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'packed'),
      where('driverId', '==', ''),
      limit(20)
    );
    const snap = await getDocs(q);

    // Sort by createdAt desc in JS
    const sortedDocs = snap.docs.slice().sort(function(a,b){ var ta=(a.data().createdAt?.toDate?.()?.getTime?.()||0),tb=(b.data().createdAt?.toDate?.()?.getTime?.()||0); return tb-ta; });
    const snap2 = { docs: sortedDocs, empty: snap.empty };

    if (snap2.empty) {
      if (list) list.innerHTML = `<div style="text-align:center;padding:32px;color:var(--gray-400);"><div style="font-size:36px;margin-bottom:8px;">&#128666;</div><div style="font-weight:700;font-size:14px;">No orders nearby right now</div><div style="font-size:12px;margin-top:4px;">Pull to refresh</div></div>`;
      return;
    }

    const userLat = window.NearBazaar.userLocation?.lat;
    const userLng = window.NearBazaar.userLocation?.lng;

    let html = '';
    snap.forEach(docSnap => {
      const o = { id: docSnap.id, ...docSnap.data() };
      const pickupDist = (userLat && o.location?.lat)
        ? calcDistance(userLat, userLng, o.location.lat, o.location.lng).toFixed(1)
        : '—';
      const earn = Math.round((o.grandTotal || 0) * 0.1 + 15); // 10% + base ₹15

      var oid    = o.id;
      var sName  = (o.shopName     || 'Shop').replace(/'/g, "\\'");
      var cName  = (o.customerName || 'Customer').replace(/'/g, "\\'");
      var cLoc   = (o.location && o.location.label) ? o.location.label : 'Customer location';
      var payLbl = o.paymentMode === 'cod' ? '&#128181; COD' : '&#9989; Prepaid';
      var estMin = Math.ceil(parseFloat(pickupDist || 0) * 5) || 20;
      html +=
        '<div class="drv-order-card drv-order-pulse" id="drv-ord-' + oid + '">' +
          '<div class="drv-order-header">' +
            '<div class="drv-order-id">#' + oid.slice(-8).toUpperCase() + '</div>' +
            '<div class="drv-order-dist">' + pickupDist + ' km pickup</div>' +
          '</div>' +
          '<div class="drv-order-body">' +
            '<div class="drv-route">' +
              '<div class="drv-route-item">' +
                '<div class="drv-route-dot pickup"></div>' +
                '<div><div class="drv-route-label">Pickup from</div>' +
                '<div class="drv-route-addr">' + (o.shopName || 'Shop') + '</div></div>' +
              '</div>' +
              '<div style="display:flex;align-items:stretch;padding:0 4px;"><div class="drv-route-line"></div></div>' +
              '<div class="drv-route-item">' +
                '<div class="drv-route-dot drop"></div>' +
                '<div><div class="drv-route-label">Drop to</div>' +
                '<div class="drv-route-addr">' + (o.customerName || 'Customer') + ' · ' + cLoc + '</div></div>' +
              '</div>' +
            '</div>' +
            '<div class="drv-order-meta">' +
              '<div class="drv-meta-item">~' + estMin + ' min</div>' +
              '<div class="drv-meta-item">&#128205; ' + pickupDist + ' km</div>' +
              '<div class="drv-meta-item">' + payLbl + '</div>' +
              '<div class="drv-order-earn">&#8377;' + earn + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="drv-order-actions">' +
            '<button class="btn btn-green btn-sm" style="flex:2;" onclick="acceptDelivery(\'' + oid + '\',\'' + sName + '\',\'' + cName + '\',' + earn + ')">&#10003; Accept Delivery</button>' +
            '<button class="btn btn-light btn-sm" style="flex:1;" onclick="ignoreDelivery(\'' + oid + '\')">Ignore</button>' +
          '</div>' +
        '</div>';
    }); // end snap.forEach

    if (list) list.innerHTML = html || '<div style="text-align:center;padding:32px;color:#9ca3af;">No orders in your area right now</div>';
  } catch(e) {
    if (list) list.innerHTML = '<div style="text-align:center;padding:32px;color:#9ca3af;">Could not load orders. Check connection.</div>';
  }
};

/* ══════════════════════════════════════
   ACCEPT / IGNORE DELIVERY
══════════════════════════════════════ */
window.acceptDelivery = async function(orderId, shopName, customerName, earn) {
  if (!window.currentUser || !window.FB) return;

  try {
    const { db, doc, updateDoc } = window.FB;
    await updateDoc(doc(db, 'orders', orderId), {
      driverId:    window.currentUser.uid,
      driverName:  window.currentUserData?.name || 'Driver',
      driverPhone: window.currentUserData?.phone || '',
      vehicleNumber: window.currentUserData?.vehicleNumber || '',
      vehicleType: window.currentUserData?.vehicleType || 'Bike',
      status:      'otw',
    });

    showToast('Delivery accepted! Navigate to pickup.', 2500, 'success');
    // Notify customer that driver is assigned and on the way
    window.FB.getDoc(window.FB.doc(window.FB.db, 'orders', orderId)).then(function(snap) {
      if (snap.exists()) {
        var ord = snap.data();
        if (ord.customerId) {
          sendNotif(ord.customerId, 'order_otw',
            'Great news! ' + (window.currentUserData && window.currentUserData.name ? window.currentUserData.name : 'Your delivery partner') +
            ' is on the way with your order. Show them your OTP to confirm delivery.',
            { orderId: orderId });
        }
        // Notify shopkeeper too
        if (ord.shopId) {
          sendNotif(ord.shopId, 'order_otw',
            'Order #' + orderId.slice(-8).toUpperCase() + ' picked up by ' +
            (window.currentUserData && window.currentUserData.name ? window.currentUserData.name : 'rider') + '.',
            { orderId: orderId });
        }
      }
    }).catch(function() {});

    // Show active delivery card
    window._activeDelivery = { orderId, shopName, customerName, earn };
    renderActiveDelivery(orderId, shopName, customerName, earn);

    // Remove from list
    const card = document.getElementById('drv-ord-' + orderId);
    if (card) { card.style.opacity='0'; card.style.transition='opacity .3s'; setTimeout(()=>card.remove(),300); }

    // Listen for status updates
    listenActiveDelivery(orderId);

    // Update stats
    const toEl  = document.getElementById('drv-today-orders');
    const earnEl = document.getElementById('drv-today-earn');
    if (toEl)  toEl.textContent = (parseInt(toEl.textContent)||0) + 1;
    if (earnEl) earnEl.innerHTML = '&#8377;' + ((parseInt(earnEl.textContent.replace(/[^\d]/g,''))||0) + earn);
  } catch(e) {
    showToast('Could not accept delivery. Try again.', 3000, 'error');
  }
};

function renderActiveDelivery(orderId, shopName, customerName, earn) {
  var section = document.getElementById('drv-active-delivery-section');
  var card    = document.getElementById('drv-active-delivery-card');
  if (!section || !card) return;
  section.style.display = '';
  var idShort = orderId.slice(-8).toUpperCase();
  card.innerHTML =
    '<div style="background:white;border-radius:14px;padding:16px 18px;margin:0 20px;border:2px solid #166534;box-shadow:0 4px 16px rgba(22,101,52,.15);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<div style="font-weight:800;font-size:14px;color:#111827;">#' + idShort + '</div>' +
        '<span class="badge badge-green badge-pulse">Active Delivery</span>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">&#127981; Pickup: ' + shopName + '</div>' +
      '<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:14px;">&#128100; Drop to: ' + customerName + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">' +
        '<button class="btn btn-blue btn-sm" style="flex:1;" onclick="openOrderDirections(\'' + orderId + '\')">&#128204; Directions</button>' +
        '<button class="btn btn-green btn-sm" style="flex:1;" onclick="showDeliveryConfirm(\'' + orderId + '\')">&#10003; Delivered?</button>' +
      '</div>' +
      '<div style="background:#f0fdf4;border-radius:8px;padding:8px 12px;text-align:center;">' +
        '<span style="font-size:13px;font-weight:800;color:#166534;">You earn: &#8377;' + earn + '</span>' +
      '</div>' +
    '</div>';
}

function listenActiveDelivery(orderId) {
  if (!window.FB) return;
  const { db, doc, onSnapshot } = window.FB;
  const unsub = onSnapshot(doc(db, 'orders', orderId), snap => {
    if (!snap.exists()) return;
    const o = snap.data();
    if (o.status === 'delivered') {
      const section = document.getElementById('drv-active-delivery-section');
      if (section) section.style.display = 'none';
      showToast('Delivery completed! &#127881; Earnings credited.', 3000, 'success');
    }
  });
  window.NearBazaar.unsubscribers.push(unsub);
}

// Driver taps "Delivered?" → shows OTP entry modal
window.showDeliveryConfirm = function(orderId) {
  showModal(
    '<div style="padding:8px 0 16px;">' +
    '<div style="text-align:center;margin-bottom:16px;">' +
    '<div style="font-size:48px;margin-bottom:8px;">&#128273;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:4px;">Enter Delivery OTP</div>' +
    '<div style="font-size:13px;color:#6b7280;">Ask the customer for their 4-digit OTP to confirm delivery</div>' +
    '</div>' +
    '<div style="margin-bottom:16px;">' +
    '<input type="number" id="drv-otp-input" maxlength="4" placeholder="Enter 4-digit OTP" ' +
    'style="width:100%;padding:16px;font-size:24px;font-weight:900;text-align:center;border:2px solid #e5e7eb;border-radius:12px;outline:none;font-family:monospace;letter-spacing:6px;box-sizing:border-box;" ' +
    'oninput="this.value=this.value.slice(0,4)">' +
    '</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-green btn-full" onclick="verifyDeliveryOTP(\'' + orderId + '\')">Verify & Complete</button>' +
    '</div></div>',
    'Confirm Delivery'
  );
  // Focus input after modal opens
  setTimeout(function() {
    var inp = document.getElementById('drv-otp-input');
    if (inp) inp.focus();
  }, 300);
};

// Verify OTP entered by driver against stored OTP in Firestore
window.verifyDeliveryOTP = async function(orderId) {
  var enteredOTP = document.getElementById('drv-otp-input') ? document.getElementById('drv-otp-input').value.trim() : '';
  if (!enteredOTP || enteredOTP.length !== 4) {
    showToast('Please enter the 4-digit OTP', 2500, 'error');
    return;
  }
  if (!window.FB) return;
  try {
    var snap = await window.FB.getDoc(window.FB.doc(window.FB.db, 'orders', orderId));
    if (!snap.exists()) { showToast('Order not found', 2500, 'error'); return; }
    var orderData = snap.data();
    if (orderData.deliveryOTP && orderData.deliveryOTP === enteredOTP) {
      // OTP matches - complete delivery
      document.getElementById('global-modal').classList.remove('show');
      await markDelivered(orderId);
    } else {
      showToast('Incorrect OTP. Ask customer to check their tracking screen.', 3500, 'error');
      var inp = document.getElementById('drv-otp-input');
      if (inp) { inp.value = ''; inp.style.borderColor = '#ef4444'; inp.focus(); }
    }
  } catch(e) {
    showToast('Verification failed. Check connection.', 3000, 'error');
  }
};

window.markDelivered = async function(orderId) {
  if (!orderId) return;
  if (!window.FB) return;
  try {
    const { db, doc, updateDoc, serverTimestamp } = window.FB;
    await updateDoc(doc(db, 'orders', orderId), { status: 'delivered', deliveredAt: serverTimestamp() });

    // Update driver stats
    const earn = window._activeDelivery?.earn || 0;
    await updateDoc(doc(db, 'users', window.currentUser.uid), {
      totalDeliveries: (window.currentUserData?.totalDeliveries || 0) + 1,
      totalEarnings:   (window.currentUserData?.totalEarnings   || 0) + earn,
      isOnline: true,
    }).catch(() => {});

    const section = document.getElementById('drv-active-delivery-section');
    if (section) section.style.display = 'none';
    showToast('Delivery Completed! Earnings credited.', 2500, 'success');
    // Notify customer and shopkeeper
    if (window.FB) {
      window.FB.getDoc(window.FB.doc(window.FB.db, 'orders', orderId)).then(function(snap) {
        if (snap.exists()) {
          var ord = snap.data();
          if (ord.customerId) {
            sendNotif(ord.customerId, 'order_delivered',
              'Your order has been delivered successfully! Please rate your experience.',
              { orderId: orderId });
          }
          if (ord.shopId) {
            sendNotif(ord.shopId, 'order_delivered',
              'Order #' + orderId.slice(-8).toUpperCase() + ' delivered! Payment released.',
              { orderId: orderId });
          }
        }
      }).catch(function() {});
    }
    window._activeDelivery = null;
    setTimeout(function() { loadNearbyOrders(); }, 1000);
  } catch(e) {
    showToast('Could not update delivery status.', 3000, 'error');
  }
};

window.openOrderDirections = async function(orderId) {
  if (!window.FB) return;
  try {
    const { db, doc, getDoc } = window.FB;
    const snap = await getDoc(doc(db, 'orders', orderId));
    if (snap.exists()) {
      const o = snap.data();
      if (o.location?.lat) openDirections(o.location.lat, o.location.lng, o.customerName);
      else showToast('Customer location not available', 2000);
    }
  } catch(e) {}
};

window.ignoreDelivery = function(orderId) {
  const card = document.getElementById('drv-ord-' + orderId);
  if (card) { card.style.opacity='0'; card.style.transition='opacity .3s'; setTimeout(()=>card.remove(),300); }
  showToast('Order ignored', 1800);
};

/* ══════════════════════════════════════
   DRIVER ORDER HISTORY
══════════════════════════════════════ */
window.loadDrvOrders = async function() {
  if (!window.currentUser || !window.FB) return;
  const list = document.getElementById('drv-orders-list');
  if (list) list.innerHTML = `<div style="text-align:center;padding:40px;"><div class="spinner"></div></div>`;

  try {
    const { db, collection, query, where, orderBy, getDocs } = window.FB;
    // No orderBy - avoids composite index requirement. Sort in JS.
    const q = query(
      collection(db, 'orders'),
      where('driverId', '==', window.currentUser.uid)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      if (list) list.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128666;</div><div class="empty-title">No deliveries yet</div><div class="empty-sub">Accept orders to see your history here.</div></div>';
      return;
    }

    let html = '';
    snap.forEach(docSnap => {
      const o = { id: docSnap.id, ...docSnap.data() };
      const earn = Math.round((o.grandTotal || 0) * 0.1 + 15);
      var hBadge = o.status === 'delivered' ? 'badge-green' : 'badge-orange';
      var hLabel = o.status === 'delivered' ? 'Delivered' : 'In Progress';
      var hDate  = o.createdAt ? formatDate(o.createdAt) : '';
      html +=
        '<div style="background:white;border-radius:14px;padding:14px 16px;margin:10px 20px;border:1.5px solid #f3f4f6;">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">' +
            '<div style="font-weight:800;font-size:13px;">#' + o.id.slice(-8).toUpperCase() + '</div>' +
            '<span class="badge ' + hBadge + '">' + hLabel + '</span>' +
          '</div>' +
          '<div style="font-size:12px;color:#4b5563;margin-bottom:4px;">&#127981; ' + (o.shopName||'') + ' → &#128100; ' + (o.customerName||'') + '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">' +
            '<span style="font-size:11px;color:#9ca3af;">' + hDate + '</span>' +
            '<span style="font-size:13px;font-weight:800;color:#166534;">&#8377;' + earn + ' earned</span>' +
          '</div>' +
        '</div>';
    });
    if (list) list.innerHTML = html;
  } catch(e) {
    if (list) list.innerHTML = `<div class="empty-state"><div class="empty-icon">&#128666;</div><div class="empty-title">Could not load history</div></div>`;
  }
};

/* ══════════════════════════════════════
   EARNINGS
══════════════════════════════════════ */
window.loadDrvEarnings = async function() {
  if (!window.currentUser || !window.FB) return;
  const content = document.getElementById('drv-earnings-content');
  if (!content) return;

  try {
    const { db, collection, query, where, getDocs } = window.FB;
    // No composite index needed - single where clause
    const q = query(collection(db, 'orders'), where('driverId','==',window.currentUser.uid));
    const snap = await getDocs(q);

    let total = 0, count = 0;
    const today = new Date().toDateString();
    let todayEarn = 0, todayCount = 0;

    snap.forEach(d => {
      const o = d.data();
      if (o.status !== 'delivered') return;  // filter in JS
      const earn = Math.round((o.grandTotal||0)*0.1 + 15);
      total += earn; count++;
      if (o.createdAt?.toDate?.()?.toDateString() === today) { todayEarn += earn; todayCount++; }
    });

    var avgVal = count ? Math.round(total/count) : 0;
    content.innerHTML =
      '<div style="padding:20px;display:flex;flex-direction:column;gap:14px;">' +
        '<div style="background:linear-gradient(160deg,#1e3a8a,#3b82f6);border-radius:14px;padding:20px;color:white;text-align:center;">' +
          '<div style="font-size:11px;font-weight:700;opacity:.7;text-transform:uppercase;letter-spacing:.5px;">Total Earnings</div>' +
          '<div style="font-size:36px;font-weight:900;margin:8px 0;">&#8377;' + total + '</div>' +
          '<div style="font-size:12px;opacity:.7;">' + count + ' deliveries completed</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
          '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;text-align:center;">' +
            '<div style="font-size:22px;font-weight:900;color:#166534;">&#8377;' + todayEarn + '</div>' +
            '<div style="font-size:11px;color:#6b7280;font-weight:600;margin-top:4px;">Today\'s Earnings</div>' +
          '</div>' +
          '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;text-align:center;">' +
            '<div style="font-size:22px;font-weight:900;color:#1d4ed8;">' + todayCount + '</div>' +
            '<div style="font-size:11px;color:#6b7280;font-weight:600;margin-top:4px;">Today\'s Deliveries</div>' +
          '</div>' +
        '</div>' +
        '<div style="background:white;border-radius:14px;padding:16px;border:1.5px solid #f3f4f6;">' +
          '<div style="font-size:13px;font-weight:800;color:#111827;margin-bottom:8px;">&#128202; Earnings Breakdown</div>' +
          '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;"><span style="font-size:12px;color:#4b5563;">Per delivery (avg)</span><span style="font-size:12px;font-weight:700;">&#8377;' + avgVal + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="font-size:12px;color:#4b5563;">Commission rate</span><span style="font-size:12px;font-weight:700;">10% + &#8377;15 base</span></div>' +
        '</div>' +
      '</div>';

    // Update header stats
    const toEl  = document.getElementById('drv-today-orders');
    const earnEl = document.getElementById('drv-today-earn');
    if (toEl)  toEl.textContent  = todayCount;
    if (earnEl) earnEl.innerHTML = '&#8377;' + todayEarn;
  } catch(e) {
    if (content) content.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128181;</div><div class="empty-title">No earnings data yet</div></div>';
  }
};

/* ══════════════════════════════════════
   DRIVER NOTIFICATIONS
══════════════════════════════════════ */
function listenDrvNotifs() {
  if (!window.currentUser || !window.FB) return;
  const { db, collection, query, where, onSnapshot, orderBy, limit } = window.FB;
  // No orderBy to avoid composite index
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', window.currentUser.uid),
    limit(20)
  );
  const unsub = onSnapshot(q, snap => {
    const unread = snap.docs.filter(d => !d.data().read).length;
    const dot = document.getElementById('drv-notif-dot');
    if (dot) dot.style.display = unread > 0 ? '' : 'none';
    const list = document.getElementById('drv-notifs-list');
    if (!list || snap.empty) return;
    list.innerHTML = snap.docs.map(d => {
      const n = d.data();
      return `<div class="notif-item ${n.read?'':'unread'}"><div class="notif-icon-wrap">&#128666;</div><div class="notif-text"><div class="notif-msg">${n.message||n.title||''}</div><div class="notif-time">${timeAgo(n.createdAt)}</div></div></div>`;
    }).join('');
  }, () => {});
  window.NearBazaar.unsubscribers.push(unsub);
}

/* ══════════════════════════════════════
   PROFILE ACTIONS
══════════════════════════════════════ */
window.saveDrvVehicle = async function() {
  const vNum  = document.getElementById('drv-vehicle-num')?.value.trim();
  const vType = document.getElementById('drv-vehicle-type')?.value;
  if (!vNum) { showToast('Enter vehicle number', 2200, 'error'); return; }
  await updateUserProfile({ vehicleNumber: vNum, vehicleType: vType });
  showToast('Vehicle details saved!', 2000, 'success');
};

window.changeDrvPhoto = function() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('Uploading...', 2000);
    const url = await uploadToCloudinary(file, 'NearBazaar/avatars');
    if (url) { await updateUserProfile({ photoURL: url }); initDriver(); }
  };
  input.click();
};

window.confirmSignOutDrv = function() {
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
window.acceptDeliveryOrder = window.acceptDelivery;
window.ignoreDeliveryOrder = window.ignoreDelivery;
