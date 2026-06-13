/* ═══════════════════════════════════════════════════════════════
   NearBazaar — customer.js (FIXED v1.1)
   Customer Panel: All real data from Firestore, no fake entities
═══════════════════════════════════════════════════════════════ */
'use strict';

(function injectCustomerScreens() {
  const container = document.getElementById('customer-screens-container');
  if (!container) return;

  container.innerHTML = `
  <!-- CUSTOMER HOME -->
  <div class="screen" id="screen-cust-home">
    <div class="cust-header">
      <div class="cust-header-top">
        <div>
          <div class="cust-greeting">Good Morning,</div>
          <div class="cust-name">User</div>
        </div>
        <div class="cust-header-actions">
          <button class="icon-btn" onclick="goTo('screen-cust-notifs')" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-dot" id="cust-notif-dot" style="display:none"></span>
          </button>
          <div class="avatar" onclick="goTo('screen-cust-profile')">U</div>
        </div>
      </div>
      <div class="loc-bar" onclick="detectLocation()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div class="loc-bar-text">
          <div class="loc-bar-main user-location-text">Tap to set location</div>
          <div class="loc-bar-sub">Tap to update</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="search-wrap" style="margin-top:10px;">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="search" class="search-input" placeholder="Search products, shops..." oninput="custSearchShops(this.value)" id="cust-main-search">
      </div>
    </div>

    <div class="scroll-area">
      <div class="request-card" onclick="goTo('screen-cust-request')">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;">
          <div>
            <div class="request-card-title">&#128722; Send Product Request</div>
            <div class="request-card-sub">Broadcast to nearby shops &amp; get the best price instantly.</div>
            <div class="request-card-cta">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send Request
            </div>
          </div>
          <div style="font-size:48px;opacity:.2;margin-top:-4px;">&#128722;</div>
        </div>
      </div>

     <div class="sec-hdr">
  <span class="sec-hdr-left">&#128722; Categories :-</span>
</div>

<div class="chip-scroll" id="cust-cat-scroll">
  <div class="chip active" data-cat="all" onclick="custFilterCategory(this,'all')">All</div>

  <div class="chip" data-cat="food" onclick="custFilterCategory(this,'food')">Food</div>

  <div class="chip" data-cat="grocery" onclick="custFilterCategory(this,'grocery')">Grocery</div>

  <div class="chip" data-cat="medical" onclick="custFilterCategory(this,'medical')">Medical</div>

  <div class="chip" data-cat="vegetables" onclick="custFilterCategory(this,'vegetables')">Vegetables</div>

  <div class="chip" data-cat="electronics" onclick="custFilterCategory(this,'electronics')">Electronics</div>

  <div class="chip" data-cat="bakery" onclick="custFilterCategory(this,'bakery')">Bakery</div>

  <div class="chip" data-cat="dairy" onclick="custFilterCategory(this,'dairy')">Dairy</div>

  <div class="chip" data-cat="general" onclick="custFilterCategory(this,'general')">General</div>
</div>

      <!-- Active Request -->
      <div id="cust-active-request-section" style="display:none;">
        <div class="sec-hdr"><span class="sec-hdr-left">&#128308; Active Request</span><span class="sec-hdr-right" onclick="cancelActiveRequest()">Cancel</span></div>
        <div class="active-req-card" id="active-req-card-inner">
          <div class="active-req-header">
            <div class="active-req-title" id="ar-title">Waiting for responses...</div>
            <span class="badge badge-orange badge-pulse">Live</span>
          </div>
          <div class="active-req-body">
            <div class="active-req-items" id="ar-items">—</div>
            <div class="active-req-meta" id="ar-meta">Broadcast within 5 km</div>
          </div>
          <div id="ar-responses-list" style="padding:4px 0;"></div>
        </div>
      </div>

      <!-- Nearby Shops -->
      <div class="sec-hdr">
        <span class="sec-hdr-left">&#127981; Nearby Shops</span>
        <span class="sec-hdr-right" onclick="loadNearbyShops()">&#x21bb; Refresh</span>
      </div>
      <div id="cust-shops-list">
        <div style="text-align:center;padding:40px 20px;color:var(--gray-400);">
          <div style="font-size:40px;margin-bottom:8px;">&#127981;</div>
          <div style="font-weight:700;font-size:14px;">Loading nearby shops...</div>
        </div>
      </div>
      <div style="height:20px;"></div>
    </div>

    <div class="bottom-nav">
      <div class="nav-item active" onclick="goTo('screen-cust-home')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Home
      </div>
      <div class="nav-item" onclick="goTo('screen-cust-request')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Request
      </div>
      <div class="nav-item" onclick="loadMyOrders();goTo('screen-cust-orders')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Orders
      </div>
      <div class="nav-item" onclick="goTo('screen-cust-profile')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profile
      </div>
    </div>
  </div>

  <!-- SEND REQUEST -->
  <div class="screen" id="screen-cust-request">
    <div class="top-bar green">
      <button class="back-btn" onclick="goTo('screen-cust-home')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h2 style="font-family:var(--font-display);font-size:22px;font-weight:800;color:white;">&#128722; Send Request</h2>
      <p style="font-size:12px;color:rgba(255,255,255,.7);font-weight:500;margin-top:4px;">Shops within range will respond with prices.</p>
    </div>
    <div class="scroll-area">
  <div style="padding:20px;display:flex;flex-direction:column;gap:16px;">

    <!-- ITEMS NEEDED -->
    <div class="form-group">
      <label>Items Needed <span class="req">*</span></label>

      <div class="tag-input-wrap" id="req-tag-wrap"
           onclick="document.getElementById('req-item-field').focus()">

        <input type="text"
               class="tag-field"
               id="req-item-field"
               placeholder="Type item, tap + to add"
               onkeydown="reqHandleTag(event)"
               style="flex:1;min-width:0;">

        <button onclick="reqAddByButton()"
                style="flex-shrink:0;width:38px;height:38px;background:#166534;color:white;border:none;border-radius:10px;font-size:22px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;margin-left:6px;">
          +
        </button>
      </div>

      <p style="font-size:11px;color:var(--gray-400);margin-top:6px;">
        Type an item then tap <strong>+</strong> or press Enter to add it
      </p>
    </div>

    <!-- ADDITIONAL NOTE -->
    <div class="form-group">
      <label>Additional Note</label>

      <textarea id="req-note"
                rows="3"
                placeholder="e.g. Preferably Amul brand, urgent delivery..."
                style="resize:none;width:100%;padding:12px 16px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;font-weight:500;outline:none;font-family:var(--font-body);">
      </textarea>
    </div>

  </div>
</div>
        <!-- Location: detect or type -->
        <div class="form-group">
          <label>Your Location</label>
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <button class="btn btn-green" style="flex:1;font-size:12px;padding:10px;" onclick="reqDetectLocation()">&#128204; Detect Live</button>
            <button class="btn btn-light" style="flex:1;font-size:12px;padding:10px;" onclick="toggleReqManualLoc()">&#9998; Type Manually</button>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--green-pale);border:1.5px solid var(--green-light);border-radius:var(--radius-sm);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span id="req-location-text" style="font-size:13px;font-weight:600;color:var(--green-dark);flex:1;">Tap Detect to get location</span>
          </div>
          <div id="req-manual-loc" style="display:none;margin-top:8px;">
            <input type="text" id="req-manual-address" placeholder="Type your area / locality" style="width:100%;padding:10px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;outline:none;font-family:var(--font-body);box-sizing:border-box;">
          </div>
        </div>
        <div class="form-group">
          <label>Broadcast Radius</label>
          <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
            <div class="req-km-val"><span id="req-km-val">5</span> km</div>
            <input type="number" id="req-km-manual" placeholder="Type km" min="1" max="50" style="width:90px;padding:6px 10px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;outline:none;font-family:var(--font-body);" oninput="document.getElementById('req-km-val').textContent=this.value;document.getElementById('req-km-slider').value=Math.min(this.value,15)">
          </div>
          <input type="range" class="req-km-slider" id="req-km-slider" min="1" max="15" value="5" oninput="document.getElementById('req-km-val').textContent=this.value;document.getElementById('req-km-manual').value=this.value">
          <div class="req-km-labels"><span>1 km</span><span>15 km</span></div>
        </div>
        <button class="btn btn-orange btn-full btn-lg" onclick="broadcastRequest()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Broadcast to Nearby Shops
        </button>
      </div>
    </div>
  </div>

  <!-- SHOP DETAIL -->
  <div class="screen" id="screen-shop-detail">
    <div style="position:relative;flex-shrink:0;">
      <div class="shop-detail-hero" id="shop-hero" style="background:linear-gradient(160deg,var(--green-deep),var(--green-dark));">
        <div class="shop-detail-hero-overlay"></div>
        <button class="back-btn" style="position:absolute;top:calc(env(safe-area-inset-top,0px)+14px);left:16px;z-index:10;" onclick="goTo('screen-cust-home')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="shop-detail-hero-info">
          <div class="shop-detail-name" id="shop-detail-name">Shop Name</div>
          <div class="shop-detail-sub" id="shop-detail-sub">Category</div>
        </div>
      </div>
    </div>
    <div class="shop-actions-row">
      <div class="shop-action-btn" onclick="openShopDirections()"><div class="shop-action-icon">&#128204;</div><div class="shop-action-label">Directions</div></div>
      <div class="shop-action-btn" onclick="callShop()"><div class="shop-action-icon">&#128222;</div><div class="shop-action-label">Call Shop</div></div>
      <div class="shop-action-btn" onclick="loadMyOrders();goTo('screen-cust-orders')"><div class="shop-action-icon">&#128203;</div><div class="shop-action-label">My Orders</div></div>
      <div class="shop-action-btn" onclick="showShopReviews()"><div class="shop-action-icon">&#11088;</div><div class="shop-action-label">Reviews</div></div>
      <div class="shop-action-btn" onclick="shareShop()"><div class="shop-action-icon">&#128257;</div><div class="shop-action-label">Share</div></div>
    </div>
    <div class="sec-divider"></div>
    <div class="scroll-area">
      <div style="padding:12px 20px 0;">
        <div class="search-wrap">
          <svg class="search-icon dark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" class="search-input light" placeholder="Search products in this shop..." oninput="shopSearchProducts(this.value)" id="shop-product-search">
        </div>
      </div>
      <div class="sec-hdr"><span class="sec-hdr-left">Catalogue</span></div>
      <div id="shop-catalog-list"></div>
      <div class="cart-float" style="display:none;" onclick="goTo('screen-cust-cart')">
        <div class="cart-float-left">
          <div class="cart-float-count">0 items</div>
          <div class="cart-float-total">&#8377;0</div>
        </div>
        <div class="cart-float-cta">View Cart <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>
      </div>
      <div style="height:24px;"></div>
    </div>
  </div>

  <!-- CART -->
  <div class="screen" id="screen-cust-cart">
    <div class="top-bar green">
      <button class="back-btn" onclick="goTo('screen-shop-detail')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Your Cart</h2>
      <p id="cart-shop-name" style="font-size:12px;color:rgba(255,255,255,.7);font-weight:500;margin-top:2px;"></p>
    </div>
    <div class="scroll-area">
      <div id="cart-items-list"></div>
      <div class="sec-divider"></div>
      <div class="sec-hdr"><span class="sec-hdr-left">Order Type</span></div>
      <div style="display:flex;flex-direction:column;gap:10px;padding:0 20px 8px;">
        <div class="payment-opt selected" id="otype-delivery" onclick="selectOrderType('delivery')">
          <div class="payment-opt-icon">&#128666;</div>
          <div><div class="payment-opt-label">Home Delivery</div><div class="payment-opt-sub">Delivered to your door</div></div>
          <div class="payment-radio" id="radio-otype-delivery"><div style="width:10px;height:10px;border-radius:50%;background:var(--green);" id="radio-otype-delivery-dot"></div></div>
        </div>
        <div class="payment-opt" id="otype-pickup" onclick="selectOrderType('pickup')">
          <div class="payment-opt-icon">&#127981;</div>
          <div><div class="payment-opt-label">Self Pickup</div><div class="payment-opt-sub">Pick up from the shop yourself</div></div>
          <div class="payment-radio" id="radio-otype-pickup"><div style="width:10px;height:10px;border-radius:50%;background:var(--green);display:none;" id="radio-otype-pickup-dot"></div></div>
        </div>
      </div>
      <div class="sec-divider"></div>
      <div class="sec-hdr"><span class="sec-hdr-left">Payment Method</span></div>
      <div style="display:flex;flex-direction:column;gap:10px;padding:0 20px 8px;">
        <div class="payment-opt selected" id="pay-online" onclick="selectPayment('online')">
          <div class="payment-opt-icon">&#128179;</div>
          <div><div class="payment-opt-label">Online Payment</div><div class="payment-opt-sub">UPI / Card / Net Banking</div></div>
          <div class="payment-radio" id="radio-pay-online"><div style="width:10px;height:10px;border-radius:50%;background:var(--green);" id="radio-pay-online-dot"></div></div>
        </div>
        <div class="payment-opt" id="pay-cod" onclick="selectPayment('cod')">
          <div class="payment-opt-icon">&#128181;</div>
          <div><div class="payment-opt-label">Cash on Delivery</div><div class="payment-opt-sub">Pay when you receive</div></div>
          <div class="payment-radio" id="radio-pay-cod"><div style="width:10px;height:10px;border-radius:50%;background:var(--green);display:none;" id="radio-pay-cod-dot"></div></div>
        </div>
      </div>
      <div class="sec-divider"></div>
      <div class="sec-hdr"><span class="sec-hdr-left">Bill Summary</span></div>
      <div class="order-summary-row"><span>Item Total</span><span id="cart-subtotal">&#8377;0</span></div>
      <div class="order-summary-row" id="cart-delivery-row"><span>Delivery Fee</span><span id="cart-delivery-fee">&#8377;20</span></div>
      <div class="order-summary-row"><span>Platform Fee</span><span>&#8377;5</span></div>
      <div class="order-summary-row total"><span>Total Amount</span><span class="price" id="cart-grand-total">&#8377;0</span></div>
      <div style="padding:16px 20px 28px;">
        <button class="btn btn-green btn-full btn-lg" onclick="placeOrder()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Place Order
        </button>
      </div>
    </div>
  </div>

  <!-- ORDER TRACKING -->
  <div class="screen" id="screen-cust-tracking">
    <div class="tracking-hero">
      <button class="back-btn" style="position:absolute;top:calc(env(safe-area-inset-top,0px)+14px);left:16px;" onclick="goTo('screen-cust-orders')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Orders
      </button>
      <div class="tracking-status-icon" id="track-icon">&#127981;</div>
      <div class="tracking-status-label">Order Status</div>
      <div class="tracking-status-text" id="track-status">Placed</div>
      <div class="tracking-eta" id="track-eta">Waiting for shop confirmation...</div>
    </div>
    <div class="tracking-steps">
      <div class="track-step done" id="step-placed"><div class="track-step-circle">&#10003;</div><div class="track-step-label">Order<br>Placed</div></div>
      <div class="track-step" id="step-confirmed"><div class="track-step-circle">&#9679;</div><div class="track-step-label">Shop<br>Confirmed</div></div>
      <div class="track-step" id="step-packed"><div class="track-step-circle">&#9679;</div><div class="track-step-label">Packed &amp;<br>Ready</div></div>
      <div class="track-step" id="step-otw"><div class="track-step-circle">&#9679;</div><div class="track-step-label">On the<br>Way</div></div>
      <div class="track-step" id="step-delivered"><div class="track-step-circle">&#9679;</div><div class="track-step-label">Delivered</div></div>
    </div>
    <div class="scroll-area">
      <div class="sec-hdr"><span class="sec-hdr-left">Delivery Partner</span></div>
      <div class="driver-card" id="track-driver-section">
        <div class="driver-card-header">
          <div class="driver-avatar" id="track-driver-avatar">--</div>
          <div>
            <div class="driver-name" id="track-driver-name">Waiting for assignment...</div>
            <div class="driver-meta" id="track-driver-meta">A driver will be assigned once shop confirms</div>
          </div>
          <button class="driver-call-btn" id="track-driver-call-btn" style="display:none;" onclick="callNumber(window._trackDriverPhone)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>
          </button>
        </div>
      </div>
      <div class="sec-hdr"><span class="sec-hdr-left">Order Summary</span></div>
      <div id="track-order-items"></div>
      <div class="order-summary-row total"><span>Total Paid</span><span class="price" id="track-total">&#8377;0</span></div>
      <!-- OTP section - shown when status is 'confirmed' or later -->
      <div id="track-otp-section" style="display:none;padding:16px 20px 8px;">
        <div style="background:linear-gradient(135deg,#1a5c2a,#166534);border-radius:14px;padding:16px;text-align:center;">
          <div style="font-size:12px;font-weight:700;color:rgba(255,255,255,.8);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Your Delivery OTP</div>
          <div id="track-otp-display" style="font-size:38px;font-weight:900;color:white;letter-spacing:8px;font-family:monospace;">----</div>
          <div style="font-size:11px;color:rgba(255,255,255,.7);margin-top:6px;">Share this code with your delivery partner to confirm receipt</div>
        </div>
      </div>
      <!-- Confirm receipt section - shown when driver is on the way -->
      <div id="track-confirm-section" style="display:none;padding:8px 20px 8px;">
        <div style="background:#fef3c7;border:1.5px solid #fcd34d;border-radius:12px;padding:14px 16px;text-align:center;">
          <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:4px;">&#128666; Rider is at your door!</div>
          <div style="font-size:12px;color:#78350f;margin-bottom:0;">Show your OTP above to the rider to confirm delivery.</div>
        </div>
      </div>
      <div style="padding:8px 20px 28px;" id="track-rate-section" style="display:none;">
        <button class="btn btn-green btn-full" onclick="goTo('screen-cust-review')">&#11088; Rate Your Experience</button>
      </div>
    </div>
  </div>

  <!-- REVIEW -->
  <div class="screen" id="screen-cust-review">
    <div class="top-bar green">
      <button class="back-btn" onclick="goTo('screen-cust-tracking')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Rate Experience</h2>
    </div>
    <div class="scroll-area">
      <div style="padding:28px 20px;">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:52px;margin-bottom:12px;">&#127981;</div>
          <div style="font-size:18px;font-weight:800;color:var(--gray-900);margin-bottom:4px;">Rate the Shop</div>
          <div style="font-size:13px;color:var(--gray-500);" id="review-shop-name">Shop</div>
          <div class="review-stars" id="shop-stars" style="margin-top:14px;">
            <span class="review-star empty" onclick="setReview('shop',1)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('shop',2)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('shop',3)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('shop',4)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('shop',5)">&#11088;</span>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:28px;padding-top:24px;border-top:1px solid var(--gray-100);">
          <div style="font-size:52px;margin-bottom:12px;">&#128666;</div>
          <div style="font-size:18px;font-weight:800;color:var(--gray-900);margin-bottom:4px;">Rate Delivery Partner</div>
          <div style="font-size:13px;color:var(--gray-500);">How was the delivery experience?</div>
          <div class="review-stars" id="driver-stars" style="margin-top:14px;">
            <span class="review-star empty" onclick="setReview('driver',1)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('driver',2)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('driver',3)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('driver',4)">&#11088;</span>
            <span class="review-star empty" onclick="setReview('driver',5)">&#11088;</span>
          </div>
        </div>
        <div class="form-group">
          <label>Your Feedback (optional)</label>
          <textarea id="review-comment" rows="3" placeholder="Tell us about your experience..." style="resize:none;width:100%;padding:12px 16px;border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;font-family:var(--font-body);outline:none;"></textarea>
        </div>
        <button class="btn btn-green btn-full btn-lg" onclick="submitReview()" style="margin-top:8px;">Submit Review</button>
      </div>
    </div>
  </div>

  <!-- ORDERS HISTORY -->
  <div class="screen" id="screen-cust-orders">
    <div class="top-bar green">
      <button class="back-btn" onclick="goTo('screen-cust-home')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">My Orders</h2>
    </div>
    <div style="padding:12px 20px;flex-shrink:0;">
      <div class="auth-tabs">
        <button class="auth-tab active" id="otab-active" onclick="switchOrderTab('active')">Active</button>
        <button class="auth-tab" id="otab-history" onclick="switchOrderTab('history')">Past Orders</button>
      </div>
    </div>
    <div class="scroll-area">
      <div id="orders-active-list">
        <div style="text-align:center;padding:40px 20px;color:var(--gray-400);">
          <div style="font-size:40px;margin-bottom:8px;">&#128203;</div>
          <div style="font-weight:700;">Loading orders...</div>
        </div>
      </div>
      <div id="orders-history-list" style="display:none;"></div>
    </div>
  </div>

  <!-- NOTIFICATIONS -->
  <div class="screen" id="screen-cust-notifs">
    <div class="top-bar green">
      <button class="back-btn" onclick="goTo('screen-cust-home')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h2 style="font-family:var(--font-display);font-size:20px;font-weight:800;color:white;">Notifications</h2>
        <div style="display:flex;gap:8px;">
          <button style="background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;" onclick="markNotifsRead()">Mark read</button>
          <button id="cust-notif-clear-btn" style="background:rgba(239,68,68,.3);border:1px solid rgba(239,68,68,.5);color:white;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;padding:4px 10px;border-radius:8px;">Clear all</button>
        </div>
      </div>
    </div>
    <div class="scroll-area" id="cust-notifs-list">
      <div style="text-align:center;padding:60px 20px;color:var(--gray-400);">
        <div style="font-size:40px;margin-bottom:8px;">&#128276;</div>
        <div style="font-weight:700;font-size:14px;">No notifications yet</div>
      </div>
    </div>
  </div>

  <!-- CUSTOMER PROFILE -->
  <div class="screen" id="screen-cust-profile">
    <div style="flex-shrink:0;">
      <div class="profile-hero">
        <button class="back-btn" style="position:absolute;top:calc(env(safe-area-inset-top,0px)+14px);left:16px;" onclick="goTo('screen-cust-home')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="profile-avatar-lg" id="profile-avatar-lg">U
          <div class="profile-cam-btn" onclick="changeProfilePhoto()">&#128247;</div>
        </div>
        <div class="profile-name" id="profile-name-display">User</div>
        <div class="profile-email" id="profile-email-display">user@email.com</div>
        <div class="profile-role-badge">&#128100; Customer</div>
      </div>
      <div class="stat-strip">
        <div class="stat-pill"><div class="stat-pill-val green" id="prof-orders">0</div><div class="stat-pill-lbl">Orders</div></div>
        <div class="stat-pill orange"><div class="stat-pill-val orange" id="prof-spent">&#8377;0</div><div class="stat-pill-lbl">Spent</div></div>
        <div class="stat-pill amber"><div class="stat-pill-val amber" id="prof-reviews">0</div><div class="stat-pill-lbl">Reviews</div></div>
      </div>
      <div class="switch-role-bar">
        <span style="font-size:11px;font-weight:700;color:var(--gray-500);white-space:nowrap;align-self:center;">Switch to:</span>
        <div class="switch-role-btn" onclick="switchRole('shopkeeper')">&#127981; Shopkeeper</div>
        <div class="switch-role-btn" onclick="switchRole('delivery')">&#128666; Delivery Partner</div>
      </div>
    </div>
    <div class="scroll-area">
      <div class="profile-menu-item" onclick="loadMyOrders();goTo('screen-cust-orders')"><div class="profile-menu-icon orange">&#128203;</div><div><div class="profile-menu-label">Order History</div><div class="profile-menu-sub">View all past orders</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="editProfile()"><div class="profile-menu-icon blue">&#9997;</div><div><div class="profile-menu-label">Edit Profile</div><div class="profile-menu-sub">Update your personal details</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="goTo('screen-cust-notifs')"><div class="profile-menu-icon amber">&#128276;</div><div><div class="profile-menu-label">Notifications</div><div class="profile-menu-sub">Manage alerts &amp; updates</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="showHelpSupport()"><div class="profile-menu-icon blue">&#10067;</div><div><div class="profile-menu-label">Help &amp; Support</div><div class="profile-menu-sub">FAQs &amp; contact us</div></div><svg class="profile-menu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      <div class="profile-menu-item" onclick="confirmSignOut()"><div class="profile-menu-icon red">&#128682;</div><div><div class="profile-menu-label" style="color:var(--red-dark);">Sign Out</div><div class="profile-menu-sub">See you soon!</div></div></div>
      <div style="padding:24px;text-align:center;">
        <p style="font-size:11px;color:var(--gray-400);">Designed &amp; Developed by <strong style="color:var(--green-dark);">Siddhesh</strong></p>
        <p style="font-size:10px;color:var(--gray-300);margin-top:4px;">NearBazaar v1.0 — Shop Nearby, Save Easy</p>
      </div>
    </div>
  </div>
  `;
})();

/* ══════════════════════════════════════
   INIT CUSTOMER
══════════════════════════════════════ */
window.initCustomer = function () {
  updateHeaderUser('customer');

  // Update location display
  if (window.NearBazaar.userLocation?.label) {
    document.querySelectorAll('.user-location-text').forEach(el => el.textContent = window.NearBazaar.userLocation.label);
    const rl = document.getElementById('req-location-text');
    if (rl) rl.textContent = window.NearBazaar.userLocation.label;
  } else {
    // Try to detect location now
    detectLocation();
  }

  const data = window.currentUserData;
  if (data) {
    const pn = document.getElementById('profile-name-display');
    const pe = document.getElementById('profile-email-display');
    const pa = document.getElementById('profile-avatar-lg');
    const po = document.getElementById('prof-orders');
    const ps = document.getElementById('prof-spent');
    if (pn) pn.textContent = data.name || 'User';
    if (pe) pe.textContent = data.email || '';
    if (pa) pa.innerHTML = (data.photoURL ? `<img src="${data.photoURL}" alt="">` : getUserInitials(data.name || 'U')) + `<div class="profile-cam-btn" onclick="changeProfilePhoto()">&#128247;</div>`;
    if (po) po.textContent = data.totalOrders || 0;
    if (ps) ps.innerHTML = '&#8377;' + (data.totalSpent || 0);
    var prEl = document.getElementById('prof-reviews');
    if (prEl) prEl.textContent = data.totalReviews || 0;
    document.querySelectorAll('#screen-cust-home .avatar').forEach(a => { a.textContent = getUserInitials(data.name || 'U'); });
  }

  loadNearbyShops();
  loadMyOrders();
  listenCustomerNotifs();
};

/* ══════════════════════════════════════
   LOAD NEARBY SHOPS — REAL DATA ONLY
══════════════════════════════════════ */
window.loadNearbyShops = async function () {
  if (!window.FB) return;
  const container = document.getElementById('cust-shops-list');
  if (!container) return;
  container.innerHTML = `<div style="text-align:center;padding:32px;"><div class="spinner"></div></div>`;

  try {
    const { db, collection, getDocs, query, where } = window.FB;
    // Fetch all shops (Firestore doesn't support geo-queries without GeoFire, so filter by radius in JS)
    const snap = await getDocs(collection(db, 'shops'));

    if (snap.empty) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#127981;</div><div class="empty-title">No shops nearby</div><div class="empty-sub">Be the first to register your shop!</div></div>`;
      return;
    }

    const userLat = window.NearBazaar.userLocation?.lat;
    const userLng = window.NearBazaar.userLocation?.lng;

    let shops = [];
    snap.forEach(docSnap => {
      const s = docSnap.data();
      const dist = (userLat && userLng && s.location?.lat)
        ? calcDistance(userLat, userLng, s.location.lat, s.location.lng)
        : 999;
      shops.push({ id: docSnap.id, ...s, dist });
    });

    // Sort by distance
    shops.sort((a, b) => a.dist - b.dist);

    if (!shops.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#127981;</div><div class="empty-title">No shops registered yet</div><div class="empty-sub">Shops will appear here once registered.</div></div>`;
      return;
    }

    container.innerHTML = shops.map(s => {
      const distLabel = s.dist < 900 ? s.dist.toFixed(1) + ' km' : 'Far';
      const catColors = { General: 'var(--green-deep)', Grocery: '#166534', Medical: 'var(--blue-dark)', Food: 'var(--orange-dark)', Vegetables: '#15803d', Bakery: '#92400e', Electronics: '#1e40af', Dairy: '#7c3aed' };
      return `
        <div class="shop-card-nb" data-category="${(s.shopCategory || '').toLowerCase()}" onclick="openShop('${s.id}','${(s.shopName || 'Shop').replace(/'/g, "\\'")}','${s.shopCategory || 'General'}',${s.rating || 0},${s.reviewCount || 0},'${distLabel}',${s.shopOpen || false},${s.location?.lat || 0},${s.location?.lng || 0},'${s.phone || ''}')">
          <div class="shop-card-header">
            <div class="shop-logo-wrap" style="background:${catColors[s.shopCategory] || 'var(--green-light)'};overflow:hidden;">${s.photoURL ? `<img src="${s.photoURL}" style="width:100%;height:100%;object-fit:cover;">` : '<span style="font-size:26px;">&#127981;</span>'}</div>
            <div class="shop-info">
              <div class="shop-name">${s.shopName || 'Shop'}</div>
              <div class="shop-category">${s.shopCategory || 'General'}</div>
              <div class="shop-rating-row">
                <span class="badge ${s.shopOpen ? 'badge-green' : 'badge-gray'}">${s.shopOpen ? 'Open' : 'Closed'}</span>
                ${s.rating ? `<span class="shop-star">&#11088; ${s.rating.toFixed(1)}</span>` : ''}
                ${s.reviewCount ? `<span class="shop-reviews">(${s.reviewCount})</span>` : ''}
              </div>
            </div>
          </div>
          <div class="shop-card-footer">
            <div class="shop-meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg> ${distLabel}</div>
            ${s.openingHours ? `<div class="shop-meta-item">&#128336; ${s.openingHours}–${s.closingHours || '9 PM'}</div>` : ''}
            ${s.shopOpen ? `<div class="shop-meta-item" style="margin-left:auto;"><span class="badge badge-green" style="font-size:9px;">Open Now</span></div>` : ''}
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#127981;</div><div class="empty-title">Could not load shops</div><div class="empty-sub">Check your internet connection.</div><div class="empty-action"><button class="btn btn-green btn-sm" onclick="loadNearbyShops()">Try Again</button></div></div>`;
  }
};

/* ══════════════════════════════════════
   OPEN SHOP
══════════════════════════════════════ */
window.currentShop = { id: null, name: '', category: '', rating: 0, isOpen: true, dist: '—', lat: 0, lng: 0, phone: '' };

window.openShop = function (shopId, name, category, rating, reviews, dist, isOpen, lat, lng, phone) {
  window.currentShop = { id: shopId, name, category, rating, reviews, dist, isOpen, lat, lng, phone };
  const nameEl = document.getElementById('shop-detail-name');
  const subEl = document.getElementById('shop-detail-sub');
  if (nameEl) nameEl.textContent = name;
  if (subEl) subEl.textContent = `${category} · ${dist} · ${reviews || 0} reviews`;
  const heroColors = { General: 'linear-gradient(160deg,var(--green-deep),var(--green-dark))', Vegetables: 'linear-gradient(160deg,#166534,#16a34a)', Medical: 'linear-gradient(160deg,var(--blue-dark),var(--blue))', Bakery: 'linear-gradient(160deg,#92400e,var(--amber))', Food: 'linear-gradient(160deg,var(--orange-dark),var(--orange))' };
  const hero = document.getElementById('shop-hero');
  if (hero) hero.style.background = heroColors[category] || heroColors.General;
  loadShopCatalog(shopId);
  goTo('screen-shop-detail');
};

/* ══════════════════════════════════════
   LOAD SHOP CATALOG — REAL DATA ONLY
══════════════════════════════════════ */
window.loadShopCatalog = async function (shopId) {
  const container = document.getElementById('shop-catalog-list');
  if (!container) return;
  container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;padding:32px;"><div class="spinner"></div></div>`;

  if (!window.FB || !shopId) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#128722;</div><div class="empty-title">No products</div></div>`;
    return;
  }

  try {
    const { db, collection, query, where, getDocs, orderBy } = window.FB;
    const q = query(collection(db, 'inventory'), where('shopId', '==', shopId), where('inStock', '==', true));
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#128722;</div><div class="empty-title">No products yet</div><div class="empty-sub">This shop hasn't added inventory yet.</div></div>`;
      return;
    }

    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCatalog(container, products);
  } catch (e) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128722;</div><div class="empty-title">Could not load products</div><div class="empty-sub">Check your connection.</div><button class="btn btn-green btn-sm" onclick="loadShopCatalog(\'' + shopId + '\')">Retry</button></div>';
  }
};

function renderCatalog(container, products) {
  container.innerHTML = products.map(p => {
    const qty = window.cart.getQty(p.id);
    const disc = p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    const pJson = JSON.stringify({ id: p.id, name: p.name, price: p.price, mrp: p.mrp, emoji: p.emoji || '', imageUrl: p.imageUrl || '', desc: p.desc || '' }).replace(/"/g, '&quot;');
    return `
    <div class="product-row" id="prod-row-${p.id}">
      <div class="product-img">${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : (p.emoji || '&#127873;')}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc || p.unit || ''}</div>
        <div class="product-price-row">
          <span class="product-price">&#8377;${p.price}</span>
          ${p.mrp > p.price ? `<span class="product-mrp">&#8377;${p.mrp}</span><span class="product-off">${disc}% off</span>` : ''}
        </div>
      </div>
      <div class="product-ctrl" id="prod-ctrl-${p.id}">
        ${qty > 0
        ? `<div class="qty-ctrl"><button class="qty-btn" onclick="removeFromCart('${p.id}')">&#8722;</button><span class="qty-val">${qty}</span><button class="qty-btn plus" onclick="addToCart('${pJson}')">&#43;</button></div>`
        : `<button class="add-btn" onclick="addToCart('${pJson}')">&#43;</button>`}
      </div>
    </div>`;
  }).join('');
}

/* ══════════════════════════════════════
   CART
══════════════════════════════════════ */
window.addToCart = function (productJson) {
  let p;
  try { p = typeof productJson === 'string' ? JSON.parse(productJson.replace(/&quot;/g, '"')) : productJson; }
  catch (e) { showToast('Could not add item', 2000, 'error'); return; }
  window.cart.add(p, window.currentShop.id, window.currentShop.name);
  _updateProductCtrl(p.id);
  showToast(`${p.name} added to cart`, 1800, 'success');
};

window.removeFromCart = function (itemId) {
  window.cart.remove(itemId);
  _updateProductCtrl(itemId);
};

function _updateProductCtrl(itemId) {
  const qty = window.cart.getQty(itemId);
  const ctrl = document.getElementById(`prod-ctrl-${itemId}`);
  if (!ctrl) return;
  const item = window.cart.items.find(i => i.id === itemId) || { id: itemId, name: '', price: 0 };
  const pJson = JSON.stringify({ id: item.id, name: item.name, price: item.price, mrp: item.mrp, emoji: item.emoji || '' }).replace(/"/g, '&quot;');
  ctrl.innerHTML = qty > 0
    ? `<div class="qty-ctrl"><button class="qty-btn" onclick="removeFromCart('${itemId}')">&#8722;</button><span class="qty-val">${qty}</span><button class="qty-btn plus" onclick="addToCart('${pJson}')">&#43;</button></div>`
    : `<button class="add-btn" onclick="addToCart('${pJson}')">&#43;</button>`;
}

window._orderType = 'delivery';
window._paymentMode = 'online';

function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  const shopName = document.getElementById('cart-shop-name');
  if (shopName) shopName.textContent = window.cart.shopName;
  if (!list) return;

  if (!window.cart.items.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">&#128722;</div><div class="empty-title">Cart is empty</div><div class="empty-sub">Add items from a shop to get started.</div><div class="empty-action"><button class="btn btn-green" onclick="goTo('screen-cust-home')">Browse Shops</button></div></div>`;
    return;
  }

  list.innerHTML = window.cart.items.map(item => `
    <div class="product-row">
      <div class="product-img">${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : (item.emoji || '&#127873;')}</div>
      <div class="product-info"><div class="product-name">${item.name}</div><div class="product-desc">&#8377;${item.price} each</div></div>
      <div class="product-ctrl"><div class="qty-ctrl">
        <button class="qty-btn" onclick="cartDecrement('${item.id}')">&#8722;</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn plus" onclick="cartIncrement('${item.id}')">&#43;</button>
      </div></div>
    </div>
  `).join('');
  updateCartBill();
}

function updateCartBill() {
  const sub = window.cart.total;
  const delFee = window._orderType === 'pickup' ? 0 : 20;
  const grand = sub + delFee + 5;
  const sub_el = document.getElementById('cart-subtotal');
  const del_el = document.getElementById('cart-delivery-fee');
  const g_el = document.getElementById('cart-grand-total');
  if (sub_el) sub_el.innerHTML = '&#8377;' + sub;
  if (del_el) del_el.innerHTML = delFee === 0 ? 'FREE' : '&#8377;' + delFee;
  if (g_el) g_el.innerHTML = '&#8377;' + grand;
}

window.cartDecrement = (id) => { window.cart.remove(id); renderCartItems(); _updateProductCtrl(id); };
window.cartIncrement = (id) => { const p = window.cart.items.find(i => i.id === id); if (p) { window.cart.add(p, window.cart.shopId, window.cart.shopName); renderCartItems(); _updateProductCtrl(id); } };

window.selectOrderType = function (type) {
  window._orderType = type;
  document.getElementById('otype-delivery')?.classList.toggle('selected', type === 'delivery');
  document.getElementById('otype-pickup')?.classList.toggle('selected', type === 'pickup');
  const dRow = document.getElementById('cart-delivery-row');
  if (dRow) dRow.style.display = type === 'pickup' ? 'none' : '';
  updateCartBill();
};

window.selectPayment = function (mode) {
  window._paymentMode = mode;
  document.getElementById('pay-online')?.classList.toggle('selected', mode === 'online');
  document.getElementById('pay-cod')?.classList.toggle('selected', mode === 'cod');
  document.getElementById('radio-pay-online-dot').style.display = mode === 'online' ? '' : 'none';
  document.getElementById('radio-pay-cod-dot').style.display = mode === 'cod' ? '' : 'none';
};

/* ══════════════════════════════════════
   PLACE ORDER → FIRESTORE
══════════════════════════════════════ */
window.placeOrder = async function () {
  if (!window.cart.items.length) { showToast('Your cart is empty!', 2200, 'error'); return; }
  if (!window.currentUser) { showToast('Please log in to place order', 2500, 'error'); goTo('screen-auth'); return; }

  const sub = window.cart.total;
  const delFee = window._orderType === 'pickup' ? 0 : 20;
  const grand = sub + delFee + 5;

  const btn = document.querySelector('#screen-cust-cart .btn-green');
  if (btn) { btn.disabled = true; btn.textContent = 'Placing...'; }

  // Generate unique 4-digit OTP for delivery confirmation
  const deliveryOTP = String(Math.floor(1000 + Math.random() * 9000));

  const orderData = {
    customerId: window.currentUser.uid,
    customerName: window.currentUserData?.name || 'User',
    customerPhone: window.currentUserData?.phone || '',
    shopId: window.cart.shopId,
    shopName: window.cart.shopName,
    items: JSON.parse(JSON.stringify(window.cart.items)),
    itemTotal: sub, deliveryFee: delFee, platformFee: 5, grandTotal: grand,
    orderType: window._orderType,
    paymentMode: window._paymentMode,
    paymentStatus: window._paymentMode === 'online' ? 'paid' : 'pending',
    status: 'placed',
    location: window.NearBazaar.userLocation || null,
    driverName: '', driverId: '', driverPhone: '',
    deliveryOTP: deliveryOTP,
  };

  try {
    const { db, collection, addDoc, serverTimestamp, doc, updateDoc } = window.FB;
    orderData.createdAt = serverTimestamp();
    const ref = await addDoc(collection(db, 'orders'), orderData);
    window._activeOrderId = ref.id;
    window._activeOrder = { ...orderData, id: ref.id };

    // Update user stats
    await updateDoc(doc(db, 'users', window.currentUser.uid), {
      totalOrders: (window.currentUserData?.totalOrders || 0) + 1,
      totalSpent: (window.currentUserData?.totalSpent || 0) + grand,
    }).catch(() => { });

    showToast('Order placed successfully!', 2800, 'success');
    // Notify customer
    sendNotif(window.currentUser.uid, 'order_placed',
      'Your order #' + ref.id.slice(-8).toUpperCase() + ' has been placed at ' + (orderData.shopName || 'Shop') + '. Waiting for confirmation.',
      { orderId: ref.id });
    // Notify shopkeeper
    sendNotif(orderData.shopId, 'new_order',
      'New order #' + ref.id.slice(-8).toUpperCase() + ' from ' + (orderData.customerName || 'Customer') + ' • ₹' + grand,
      { orderId: ref.id });
    window.cart.clear();
    renderCartItems();
    goTo('screen-cust-tracking');
    listenOrderStatus(ref.id);
  } catch (e) {
    showToast('Could not place order. Check your connection.', 3000, 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Place Order'; }
  }
};

/* ══════════════════════════════════════
   LIVE ORDER STATUS LISTENER
══════════════════════════════════════ */
function listenOrderStatus(orderId) {
  if (!window.FB) return;
  const { db, doc, onSnapshot } = window.FB;

  // Show initial state
  _renderTrackingState('placed', window._activeOrder);

  const unsub = onSnapshot(doc(db, 'orders', orderId), snap => {
    if (!snap.exists()) return;
    const order = { id: snap.id, ...snap.data() };
    window._activeOrder = order;
    _renderTrackingState(order.status, order);
  });
  window.NearBazaar.unsubscribers.push(unsub);
}

const STATUS_CONFIG = {
  placed: { icon: '&#127981;', label: 'Order Placed', step: 'step-placed', eta: 'Waiting for shop confirmation...' },
  confirmed: { icon: '&#9989;', label: 'Shop Confirmed', step: 'step-confirmed', eta: 'Shop is preparing your order...' },
  packed: { icon: '&#128092;', label: 'Packed & Ready', step: 'step-packed', eta: 'Looking for delivery partner...' },
  otw: { icon: '&#128666;', label: 'On the Way', step: 'step-otw', eta: 'Your order is on the way!' },
  delivered: { icon: '&#10003;', label: 'Delivered!', step: 'step-delivered', eta: 'Order delivered successfully!' },
  rejected: { icon: '&#10060;', label: 'Order Rejected', step: null, eta: 'Your order was rejected by the shop.' },
};

function _renderTrackingState(status, order) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.placed;
  const steps = ['step-placed', 'step-confirmed', 'step-packed', 'step-otw', 'step-delivered'];
  const stepIdx = steps.indexOf(cfg.step);

  steps.forEach((s, i) => {
    const el = document.getElementById(s);
    if (!el) return;
    el.classList.toggle('done', i <= stepIdx);
    el.classList.toggle('active', i === stepIdx);
  });

  const icon = document.getElementById('track-icon');
  const stat = document.getElementById('track-status');
  const eta = document.getElementById('track-eta');
  if (icon) icon.innerHTML = cfg.icon;
  if (stat) stat.textContent = cfg.label;
  if (eta) eta.textContent = cfg.eta;

  // Order summary
  const trackItems = document.getElementById('track-order-items');
  const trackTotal = document.getElementById('track-total');
  if (trackItems && order?.items) {
    trackItems.innerHTML = order.items.map(item =>
      `<div class="order-summary-row"><span>${item.qty}x ${item.name}</span><span>&#8377;${item.price * item.qty}</span></div>`
    ).join('');
  }
  if (trackTotal && order?.grandTotal) trackTotal.innerHTML = '&#8377;' + order.grandTotal;

  // Driver info
  if (order?.driverName) {
    const avatar = document.getElementById('track-driver-avatar');
    const name = document.getElementById('track-driver-name');
    const meta = document.getElementById('track-driver-meta');
    const callBtn = document.getElementById('track-driver-call-btn');
    if (avatar) avatar.textContent = getUserInitials(order.driverName);
    if (name) name.textContent = order.driverName;
    if (meta) meta.textContent = order.vehicleNumber ? `${order.vehicleType || 'Bike'} · ${order.vehicleNumber}` : 'Assigned';
    if (callBtn) { callBtn.style.display = ''; window._trackDriverPhone = order.driverPhone || ''; }
  }

  // OTP section - show from confirmed onwards
  var otpSection = document.getElementById('track-otp-section');
  var confirmSection = document.getElementById('track-confirm-section');
  var rateSection = document.getElementById('track-rate-section');
  var otpDisplay = document.getElementById('track-otp-display');

  var showOtp = ['confirmed', 'packed', 'otw'].includes(status);
  if (otpSection) otpSection.style.display = showOtp ? '' : 'none';
  if (confirmSection) confirmSection.style.display = (status === 'otw') ? '' : 'none';
  if (rateSection) rateSection.style.display = (status === 'delivered') ? '' : 'none';

  // Display OTP from order data
  if (otpDisplay && order && order.deliveryOTP && showOtp) {
    otpDisplay.textContent = order.deliveryOTP;
  }

  if (status === 'delivered') {
    showToast('Order Delivered Successfully! Please rate your experience.', 3500, 'success');
    // Customer notification for delivery
    if (window.currentUser && window._activeOrderId) {
      sendNotif(window.currentUser.uid, 'order_delivered',
        'Your order has been delivered! Tap to rate your experience.',
        { orderId: window._activeOrderId });
    }
  }
  if (status === 'confirmed' && window.currentUser && window._activeOrderId) {
    sendNotif(window.currentUser.uid, 'order_confirmed',
      'Your order has been accepted by ' + (order && order.shopName ? order.shopName : 'the shop') + '. They are now preparing it!',
      { orderId: window._activeOrderId });
  }
  if (status === 'packed' && window.currentUser && window._activeOrderId) {
    sendNotif(window.currentUser.uid, 'order_packed',
      'Your order is packed and ready! A delivery partner will pick it up soon.',
      { orderId: window._activeOrderId });
  }
  if (status === 'otw' && window.currentUser && window._activeOrderId) {
    sendNotif(window.currentUser.uid, 'order_otw',
      'Your delivery partner is on the way! Check your OTP to confirm delivery.',
      { orderId: window._activeOrderId });
  }
}

/* ══════════════════════════════════════
   LOAD MY ORDERS — REAL DATA
══════════════════════════════════════ */
window.loadMyOrders = async function () {
  if (!window.currentUser || !window.FB) return;
  const { db, collection, query, where, orderBy, getDocs } = window.FB;

  try {
    // No orderBy - avoids composite index requirement. Sort in JS instead.
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', window.currentUser.uid)
    );
    const snap = await getDocs(q);

    const activeStatuses = ['placed', 'confirmed', 'packed', 'otw'];
    const completedStatuses = ['delivered', 'rejected', 'cancelled'];

    let activeHtml = '';
    let historyHtml = '';

    // Sort by createdAt desc in JS (avoids Firestore composite index)
    const allDocs = snap.docs.slice().sort(function (a, b) {
      const ta = a.data().createdAt?.toDate?.()?.getTime?.() || 0;
      const tb = b.data().createdAt?.toDate?.()?.getTime?.() || 0;
      return tb - ta;
    });

    allDocs.forEach(docSnap => {
      const o = { id: docSnap.id, ...docSnap.data() };
      const dateStr = o.createdAt ? formatDate(o.createdAt) + ', ' + formatTime(o.createdAt) : 'Just now';
      const statusCfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.placed;
      const badgeCls = { placed: 'badge-orange', confirmed: 'badge-orange badge-pulse', packed: 'badge-orange', otw: 'badge-orange badge-pulse', delivered: 'badge-green', rejected: 'badge-gray', cancelled: 'badge-gray' }[o.status] || 'badge-gray';
      const itemsStr = o.items?.map(i => `${i.qty}x ${i.name}`).join(', ') || '';

      var trackBtn = activeStatuses.includes(o.status)
        ? '<button class="btn btn-ghost-green btn-sm" onclick="event.stopPropagation();openOrderTracking(\'' + o.id + '\')">Track</button>'
        : '';
      var rateBtn = o.status === 'delivered'
        ? '<button class="btn btn-light btn-sm" onclick="event.stopPropagation();openReviewForOrder(\'' + o.id + '\')">Rate</button>'
        : '';
      var cardHtml =
        '<div class="order-hist-card" style="cursor:pointer;" onclick="openOrderTracking(\'' + o.id + '\')">' +
        '<div class="order-hist-header">' +
        '<div><div class="order-hist-id">#' + o.id.slice(-8).toUpperCase() + '</div><div class="order-hist-date">' + dateStr + '</div></div>' +
        '<span class="badge ' + badgeCls + '">' + statusCfg.label + '</span>' +
        '</div>' +
        '<div class="order-hist-body">' +
        '<div class="order-hist-items">' + itemsStr + '</div>' +
        '<div style="margin-top:6px;font-size:12px;color:#6b7280;font-weight:600;">&#127981; ' + (o.shopName || '') + '</div>' +
        '</div>' +
        '<div class="order-hist-footer">' +
        '<div class="order-hist-total">&#8377;' + o.grandTotal + '</div>' +
        trackBtn + rateBtn +
        '</div>' +
        '</div>';

      if (activeStatuses.includes(o.status)) activeHtml += cardHtml;
      else historyHtml += cardHtml;
    });

    const activeList = document.getElementById('orders-active-list');
    const historyList = document.getElementById('orders-history-list');
    if (activeList) activeList.innerHTML = activeHtml || `<div class="empty-state"><div class="empty-icon">&#128203;</div><div class="empty-title">No active orders</div><div class="empty-sub">Your active orders will appear here.</div></div>`;
    if (historyList) historyList.innerHTML = historyHtml || `<div class="empty-state"><div class="empty-icon">&#128203;</div><div class="empty-title">No past orders</div></div>`;
  } catch (e) {
    console.error('loadMyOrders error:', e);
    const activeList = document.getElementById('orders-active-list');
    if (activeList) activeList.innerHTML = '<div class="empty-state"><div class="empty-icon">&#128203;</div><div class="empty-title">Could not load orders</div><div class="empty-sub">Check your connection and try again.</div><div class="empty-action"><button class="btn btn-green btn-sm" onclick="loadMyOrders()">Retry</button></div></div>';
  }
};

// Customer confirms they received the order
window.confirmOrderReceived = function (orderId) {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:52px;margin-bottom:12px;">&#9989;</div>' +
    '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Confirm Receipt?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">Did you receive your order? This will complete the delivery and release payment to the driver.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Not Yet</button>' +
    '<button class="btn btn-green btn-full" onclick="closeGlobalModal();doConfirmReceived(\'' + orderId + '\')">Yes, I Received It!</button>' +
    '</div></div>'
  );
};

window.doConfirmReceived = async function (orderId) {
  if (!window.FB || !window.currentUser) return;
  try {
    await window.FB.updateDoc(window.FB.doc(window.FB.db, 'orders', orderId), {
      status: 'delivered',
      deliveredAt: window.FB.serverTimestamp(),
      confirmedByCustomer: true
    });
    showToast('Thank you! Order confirmed as delivered.', 3000, 'success');
  } catch (e) {
    showToast('Could not confirm. Try again.', 2500, 'error');
  }
};

window.openOrderTracking = function (orderId) {
  listenOrderStatus(orderId);
  goTo('screen-cust-tracking');
};

window.openReviewForOrder = function (orderId) {
  window._activeOrderId = orderId;
  goTo('screen-cust-review');
};

/* ══════════════════════════════════════
   SEARCH / FILTER
══════════════════════════════════════ */
window.custSearchShops = function (q) {
  document.querySelectorAll('#cust-shops-list .shop-card-nb').forEach(card => {
    const name = card.querySelector('.shop-name')?.textContent.toLowerCase() || '';
    const cat = card.querySelector('.shop-category')?.textContent.toLowerCase() || '';
    card.style.display = (!q || name.includes(q.toLowerCase()) || cat.includes(q.toLowerCase())) ? '' : 'none';
  });
};

window.custFilterCategory = function (el, cat) {
  document.querySelectorAll('#cust-cat-scroll .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#cust-shops-list .shop-card-nb').forEach(card => {
    const meta = (card.dataset.category || card.querySelector('.shop-category')?.textContent || '').toLowerCase();
    card.style.display = (cat === 'all' || meta.includes(cat)) ? '' : 'none';
  });
};

window.shopSearchProducts = function (q) {
  document.querySelectorAll('#shop-catalog-list .product-row').forEach(row => {
    const name = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
    row.style.display = (!q || name.includes(q.toLowerCase())) ? '' : 'none';
  });
};

/* ══════════════════════════════════════
   REQUEST (BROADCAST)
══════════════════════════════════════ */
let reqTags = [];

window.reqHandleTag = function (e) {
  const input = document.getElementById('req-item-field');
  if (!input) return;
  const val = input.value.trim();
  if ((e.key === 'Enter' || e.key === ',') && val) {
    e.preventDefault();
    addReqTag(val.replace(/,$/, ''));
    input.value = '';
  }
};

window.reqAddByButton = function () {
  var input = document.getElementById('req-item-field');
  if (!input) return;
  var val = input.value.trim().replace(/,$/, '');
  if (!val) { input.focus(); return; }
  addReqTag(val);
  input.value = '';
  input.focus();
};

function addReqTag(text) {
  if (!text || reqTags.includes(text)) return;
  reqTags.push(text);
  renderReqTags();
}

function renderReqTags() {
  const wrap = document.getElementById('req-tag-wrap');
  const input = document.getElementById('req-item-field');
  if (!wrap) return;
  wrap.querySelectorAll('.tag-item').forEach(t => t.remove());
  reqTags.forEach((tag, i) => {
    const el = document.createElement('div');
    el.className = 'tag-item';
    el.innerHTML = `${tag}<button class="tag-remove" onclick="removeReqTag(${i})">&#10005;</button>`;
    wrap.insertBefore(el, input);
  });
}

window.removeReqTag = function (i) { reqTags.splice(i, 1); renderReqTags(); };

window.reqDetectLocation = function () {
  const rl = document.getElementById('req-location-text');
  if (rl) rl.textContent = 'Detecting...';
  navigator.geolocation?.getCurrentPosition(async (pos) => {
    NB.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=en`);
      const data = await res.json();
      const addr = data.address || {};
      const label = [addr.suburb || addr.neighbourhood || '', addr.city || addr.town || '', addr.state || ''].filter(Boolean).join(', ');
      NB.userLocation.label = label;
      if (rl) rl.textContent = label || 'Location detected';
      document.querySelectorAll('.user-location-text').forEach(e => e.textContent = label);
    } catch (e) { if (rl) rl.textContent = 'Location detected'; }
  }, () => {
    showToast('Could not detect location. Please type it.', 3000, 'error');
    window.toggleReqManualLoc();
  }, { enableHighAccuracy: true, timeout: 12000 });
};

window.toggleReqManualLoc = function () {
  const m = document.getElementById('req-manual-loc');
  if (m) m.style.display = m.style.display === 'none' ? '' : 'none';
};

window.broadcastRequest = async function () {
  if (!reqTags.length) { showToast('Please add at least one item', 2500, 'error'); return; }
  if (!window.currentUser) { showToast('Please log in first', 2500, 'error'); goTo('screen-auth'); return; }

  const km = document.getElementById('req-km-manual')?.value || document.getElementById('req-km-slider')?.value || 5;
  const note = document.getElementById('req-note')?.value || '';
  const manualAddr = document.getElementById('req-manual-address')?.value?.trim();

  let locData = window.NearBazaar.userLocation || null;
  if (manualAddr && !locData) locData = { lat: 0, lng: 0, label: manualAddr };

  const reqData = {
    customerId: window.currentUser.uid,
    customerName: window.currentUserData?.name || 'User',
    items: reqTags, note,
    radius: parseInt(km),
    location: locData,
    status: 'active',
    responses: [],
  };

  try {
    const { db, collection, addDoc, serverTimestamp } = window.FB;
    reqData.createdAt = serverTimestamp();
    const ref = await addDoc(collection(db, 'requests'), reqData);
    window._activeRequestId = ref.id;
    listenRequestResponses(ref.id);
    showToast('Request sent to ' + km + ' km radius!', 2800, 'success');
  } catch (e) { showToast('Failed to send request. Check connection.', 3000, 'error'); return; }

  const sec = document.getElementById('cust-active-request-section');
  const arTitle = document.getElementById('ar-title');
  const arItems = document.getElementById('ar-items');
  const arMeta = document.getElementById('ar-meta');
  if (sec) sec.style.display = '';
  if (arTitle) arTitle.textContent = 'Waiting for shop responses...';
  if (arItems) arItems.textContent = reqTags.join(', ');
  if (arMeta) arMeta.textContent = `Broadcast within ${km} km`;

  goTo('screen-cust-home');
  reqTags = [];
  renderReqTags();
};

function listenRequestResponses(reqId) {
  if (!window.FB) return;
  const { db, doc, onSnapshot } = window.FB;
  const unsub = onSnapshot(doc(db, 'requests', reqId), snap => {
    if (!snap.exists()) return;
    const data = snap.data();
    const responsesList = document.getElementById('ar-responses-list');
    if (!responsesList) return;
    if (data.responses?.length > 0) {
      responsesList.innerHTML = data.responses.map((r, i) => `
        <div class="req-response-card">
          <div style="flex:1;">
            <div class="req-shop-name">${r.shopName}</div>
            <div class="req-quote">&#8377;${r.totalPrice} · ETA ${r.eta} min</div>
          </div>
          <button class="req-accept-btn" onclick="acceptQuote('${reqId}',${i},'${r.shopId}','${r.shopName}')">Accept</button>
        </div>`).join('');
    }
  });
  window.NearBazaar.unsubscribers.push(unsub);
}

window.acceptQuote = function (reqId, idx, shopId, shopName) {
  showToast('Quote accepted! Opening shop...', 2200, 'success');
  if (window.FB) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'requests', reqId), { status: 'accepted' }).catch(() => { });
  }
  openShop(shopId, shopName, '', 0, 0, '—', true, 0, 0, '');
};

window.cancelActiveRequest = function () {
  const sec = document.getElementById('cust-active-request-section');
  if (sec) sec.style.display = 'none';
  if (window._activeRequestId && window.FB) {
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'requests', window._activeRequestId), { status: 'cancelled' }).catch(() => { });
  }
  showToast('Request cancelled', 2000);
};

/* ══════════════════════════════════════
   NOTIFICATIONS — REAL DATA
══════════════════════════════════════ */
function listenCustomerNotifs() {
  if (typeof setupNotifScreen === 'function') {
    setupNotifScreen('cust-notifs-list', 'cust-notif-dot', 'cust-notif-clear-btn');
  }
}

/* ══════════════════════════════════════
   REVIEW
══════════════════════════════════════ */
const _reviews = { shop: 0, driver: 0 };

window.setReview = function (type, val) {
  _reviews[type] = val;
  document.querySelectorAll(`#${type}-stars .review-star`).forEach((s, i) => {
    s.classList.toggle('filled', i < val);
    s.classList.toggle('empty', i >= val);
  });
};

window.submitReview = async function () {
  if (!_reviews.shop && !_reviews.driver) { showToast('Please rate before submitting', 2500, 'error'); return; }
  const comment = document.getElementById('review-comment')?.value || '';

  if (window.FB && window._activeOrderId) {
    try {
      const { db, collection, addDoc, serverTimestamp, doc, updateDoc } = window.FB;
      await addDoc(collection(db, 'reviews'), {
        orderId: window._activeOrderId,
        shopId: window.currentShop.id,
        customerId: window.currentUser?.uid,
        customerName: window.currentUserData?.name || 'User',
        shopRating: _reviews.shop,
        driverRating: _reviews.driver,
        comment,
        createdAt: serverTimestamp(),
      });
      // Update shop rating
      if (window.currentShop.id) {
        const reviewCount = (window.currentShop.reviews || 0) + 1;
        const newRating = ((window.currentShop.rating || 0) * (reviewCount - 1) + _reviews.shop) / reviewCount;
        await updateDoc(doc(db, 'shops', window.currentShop.id), { rating: Math.round(newRating * 10) / 10, reviewCount }).catch(() => { });
      }
    } catch (e) { }
  }

  // Notify shopkeeper about new review
  if (window.currentShop && window.currentShop.id && _reviews.shop > 0) {
    sendNotif(window.currentShop.id, 'review_received',
      (window.currentUserData && window.currentUserData.name ? window.currentUserData.name : 'A customer') +
      ' gave you ' + _reviews.shop + ' star' + (_reviews.shop === 1 ? '' : 's') + '! Check your reviews.',
      { shopId: window.currentShop.id });
  }
  // Update customer review count in Firestore
  if (window.FB && window.currentUser) {
    var curReviews = (window.currentUserData && window.currentUserData.totalReviews) || 0;
    window.FB.updateDoc(window.FB.doc(window.FB.db, 'users', window.currentUser.uid), {
      totalReviews: curReviews + 1
    }).then(function () {
      if (window.currentUserData) window.currentUserData.totalReviews = curReviews + 1;
      var prEl = document.getElementById('prof-reviews');
      if (prEl) prEl.textContent = curReviews + 1;
    }).catch(function () { });
  }
  showToast('Thank you for your feedback!', 2500, 'success');
  _reviews.shop = 0; _reviews.driver = 0;
  goTo('screen-cust-home');
};

/* ══════════════════════════════════════
   PROFILE ACTIONS
══════════════════════════════════════ */
window.switchOrderTab = function (tab) {
  document.getElementById('otab-active')?.classList.toggle('active', tab === 'active');
  document.getElementById('otab-history')?.classList.toggle('active', tab === 'history');
  const aList = document.getElementById('orders-active-list');
  const hList = document.getElementById('orders-history-list');
  if (aList) aList.style.display = tab === 'active' ? '' : 'none';
  if (hList) hList.style.display = tab === 'history' ? '' : 'none';
};

window.editProfile = function () {
  var data = window.currentUserData || {};
  var name = (data.name || '').replace(/"/g, '&quot;');
  var phone = (data.phone || '').replace(/"/g, '&quot;');
  var address = (data.address || '').replace(/"/g, '&quot;');
  showModal(
    '<div class="form-group"><label>Full Name</label><input type="text" id="ep-name" value="' + name + '" placeholder="Your name"></div>' +
    '<div class="form-group"><label>Mobile</label><div class="input-phone-wrap"><span class="phone-code">+91</span><input type="tel" id="ep-phone" value="' + phone + '" placeholder="10-digit mobile"></div></div>' +
    '<div class="form-group"><label>Address</label><input type="text" id="ep-address" value="' + address + '" placeholder="Your area / locality"></div>' +
    '<button class="btn btn-green btn-full" onclick="saveEditProfile()" style="margin-top:8px;">Save Changes</button>',
    'Edit Profile'
  );
};

window.saveEditProfile = async function () {
  const name = document.getElementById('ep-name')?.value.trim();
  const phone = document.getElementById('ep-phone')?.value.trim();
  const address = document.getElementById('ep-address')?.value.trim();
  if (!name) { showToast('Name cannot be empty', 2200, 'error'); return; }
  const ok = await updateUserProfile({ name, phone, address });
  if (ok) { closeGlobalModal(); initCustomer(); }
};

window.changeProfilePhoto = function () {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('Uploading photo...', 2000);
    const url = await uploadToCloudinary(file, 'NearBazaar/avatars');
    if (url) { await updateUserProfile({ photoURL: url }); initCustomer(); }
  };
  input.click();
};

window.showHelpSupport = function () {
  showModal(
    '<div class="list-row" style="cursor:default;"><div class="list-thumb">&#128222;</div><div class="list-row-info"><div class="list-row-title">Call Support</div><div class="list-row-sub">+91 98765 43210 (9 AM - 9 PM)</div></div></div>' +
    '<div class="list-row" style="cursor:default;"><div class="list-thumb">&#128140;</div><div class="list-row-info"><div class="list-row-title">Email Us</div><div class="list-row-sub">support@nearbazaar.in</div></div></div>',
    'Help & Support'
  );
};

window.confirmSignOut = function () {
  showModal(
    '<div style="text-align:center;padding:8px 0 16px;">' +
    '<div style="font-size:48px;margin-bottom:12px;">&#128682;</div>' +
    '<div style="font-size:18px;font-weight:800;color:#111827;margin-bottom:6px;">Sign Out?</div>' +
    '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">You\'ll need to log in again to place orders.</div>' +
    '<div style="display:flex;gap:10px;">' +
    '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
    '<button class="btn btn-red btn-full" onclick="signOut()">Sign Out</button>' +
    '</div></div>'
  );
};

window.openShopDirections = function () {
  const shop = window.currentShop;
  if (shop.lat && shop.lng && (shop.lat !== 0 || shop.lng !== 0)) {
    openDirections(shop.lat, shop.lng, shop.name);
  } else {
    showToast('Shop location not available on maps', 2000);
  }
};

window.callShop = function () {
  const phone = window.currentShop?.phone;
  if (phone) { callNumber(phone); }
  else { showToast('Shop phone number not available', 2000); }
};

window.shareShop = function () {
  if (navigator.share) {
    navigator.share({ title: window.currentShop.name, text: 'Check out ' + window.currentShop.name + ' on NearBazaar!', url: window.location.href });
  } else {
    try { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!', 2000, 'success'); }
    catch (e) { showToast('Share: ' + window.location.href, 3000); }
  }
};

window.showShopReviews = async function () {
  showModal('<div style="text-align:center;padding:20px;"><div class="spinner"></div></div>', 'Reviews — ' + (window.currentShop.name || 'Shop'));

  if (window.FB && window.currentShop.id) {
    try {
      var db = window.FB.db;
      // No orderBy to avoid composite index requirement
      var q = window.FB.query(
        window.FB.collection(db, 'reviews'),
        window.FB.where('shopId', '==', window.currentShop.id),
        window.FB.limit(20)
      );
      var snap = await window.FB.getDocs(q);
      var content = document.querySelector('#global-modal-content .modal-body');
      if (!content) return;

      if (snap.empty) {
        content.innerHTML = '<div class="empty-state"><div class="empty-icon">&#11088;</div><div class="empty-title">No reviews yet</div><div class="empty-sub">Be the first to review this shop!</div></div>';
        return;
      }

      var html = '';
      snap.docs.forEach(function (d) {
        var r = d.data();
        var stars = '';
        var rating = r.shopRating || 0;
        for (var s = 0; s < rating; s++) stars += '&#11088;';
        var initials = getUserInitials(r.customerName || 'U');
        var comment = (r.comment || 'Great shop!').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var cName = (r.customerName || 'User').replace(/</g, '&lt;');
        html += '<div class="notif-item" style="cursor:default;">' +
          '<div class="notif-icon-wrap" style="background:#fef3c7;color:#92400e;">' + initials + '</div>' +
          '<div class="notif-text">' +
          '<div class="notif-msg">"' + comment + '"</div>' +
          '<div class="notif-time">' + cName + ' &bull; ' + stars + '</div>' +
          '</div></div>';
      });
      content.innerHTML = html;
    } catch (e) { }
  }
};

// Note: goTo cart rendering is handled in app.js window.goTo
// Expose _updateProductCtrl so app.js confirmCartReplace can call it
window._updateProductCtrl = _updateProductCtrl;
