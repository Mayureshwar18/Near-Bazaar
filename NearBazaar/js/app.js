/* ═══════════════════════════════════════════════════════════════
   NearBazaar — app.js  (v1.2 — Error Free)
   Designed & Developed by Siddhesh
═══════════════════════════════════════════════════════════════ */
'use strict';

window.NearBazaar = {
  currentScreen: 'screen-splash',
  currentRole: null, selectedRole: null, suRole: 'customer',
  userLocation: null, cartItems: [], cartTotal: 0,
  requestItems: [], unsubscribers: [],
};
var NB = window.NearBazaar;

/* ══════════════════════════════════════
   NAVIGATION — single source of truth
══════════════════════════════════════ */
function _navTo(screenId, direction) {
  direction = direction || 'right';
  var current = document.getElementById(NB.currentScreen);
  var next    = document.getElementById(screenId);
  if (!next) { console.warn('Screen not found:', screenId); return; }
  if (current) {
    current.classList.add(direction === 'back' ? 'exit-right' : 'exit-left');
    setTimeout(function() { current.classList.remove('active','exit-left','exit-right'); }, 260);
  }
  next.classList.add('active');
  NB.currentScreen = screenId;
  var sc = next.querySelector('.scroll-area');
  if (sc) sc.scrollTop = 0;
}

// goTo is the single global — customer.js no longer overrides
window.goTo = function(screenId, dir) {
  if (screenId === 'screen-cust-cart' && typeof renderCartItems === 'function') renderCartItems();
  _navTo(screenId, dir);
};

/* ══════════════════════════════════════
   ROLE SELECTION
══════════════════════════════════════ */
window.selectRole = function(role) {
  NB.selectedRole = role;
  localStorage.setItem('nb_pending_role', role);
  var badge = document.getElementById('auth-role-badge');
  if (badge) badge.textContent = { customer:'Customer', shopkeeper:'Shopkeeper', delivery:'Delivery Partner' }[role] || role;
  var authHeader = document.getElementById('auth-header');
  if (authHeader) {
    authHeader.style.background = {
      customer:   'linear-gradient(160deg,#1a5c2a,#166534)',
      shopkeeper: 'linear-gradient(160deg,#b45309,#d97706)',
      delivery:   'linear-gradient(160deg,#1d4ed8,#3b82f6)'
    }[role] || '';
  }
  document.querySelectorAll('.role-pill').forEach(function(p) {
    p.classList.toggle('active', p.dataset.role === role);
  });
  NB.suRole = role;
  window.goTo('screen-auth');
};

window.navigateToRoleDashboard = function(role) {
  var screens = { customer:'screen-cust-home', shopkeeper:'screen-sk-home', delivery:'screen-drv-home' };
  window.goTo(screens[role] || 'screen-cust-home');
  if (role === 'customer')   initCustomer();
  if (role === 'shopkeeper') initShopkeeper();
  if (role === 'delivery')   initDriver();
};

/* ══════════════════════════════════════
   LOCATION — only fires when user taps; NO auto-popup on load
══════════════════════════════════════ */
window.detectLocation = function() {
  var el = document.getElementById('welcome-location');
  if (!navigator.geolocation) { if (el) el.textContent = 'Location not available'; return; }
  if (el) el.textContent = 'Detecting location\u2026';
  navigator.geolocation.getCurrentPosition(
    function(pos) { _onLocSuccess(pos, el); },
    function(err) {
      if (el) el.textContent = err.code === 1 ? 'Tap to enable location' : 'Tap to detect location';
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
  );
};

function _onLocSuccess(pos, displayEl) {
  NB.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+pos.coords.latitude+'&lon='+pos.coords.longitude+'&accept-language=en')
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var a   = d.address || {};
      var area = a.suburb || a.neighbourhood || a.city_district || a.village || 'Your Area';
      var city = a.city || a.town || a.county || '';
      var str  = city ? area+', '+city : area;
      if (displayEl) displayEl.textContent = '\uD83D\uDCCC '+str;
      document.querySelectorAll('.loc-bar-main,.user-location-text').forEach(function(e) { e.textContent = str; });
      var rl = document.getElementById('req-location-text');
      if (rl) rl.textContent = str;
      NB.userLocation.label = str;
      if (window.currentUser && window.FB) {
        window.FB.updateDoc(window.FB.doc(window.FB.db,'users',window.currentUser.uid),{
          location:{ lat:pos.coords.latitude, lng:pos.coords.longitude, label:str }
        }).catch(function(){});
      }
    })
    .catch(function() { if (displayEl) displayEl.textContent = '\uD83D\uDCCC Location detected'; });
}

window.signupDetectLocation = function() {
  var btn = document.getElementById('su-loc-detect-btn');
  if (btn) { btn.textContent = '\u23F3 Detecting\u2026'; btn.disabled = true; }
  var done = function() { if (btn) { btn.textContent = '\uD83D\uDCCC Detect Location'; btn.disabled = false; } };
  if (!navigator.geolocation) { showToast('Geolocation not supported', 2500, 'error'); done(); return; }
  navigator.geolocation.getCurrentPosition(function(pos) {
    NB.userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+pos.coords.latitude+'&lon='+pos.coords.longitude+'&accept-language=en')
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var a = d.address||{};
        var city=a.city||a.town||a.county||'', state=a.state||'', country=a.country||'India', pincode=a.postcode||'', district=a.county||a.city_district||'';
        var label=[a.suburb||a.neighbourhood||'',city,state].filter(Boolean).join(', ');
        NB.userLocation = { lat:pos.coords.latitude, lng:pos.coords.longitude, label:label, city:city, state:state, country:country, pincode:pincode, district:district };
        var det=document.getElementById('su-loc-detected'), lbl=document.getElementById('su-loc-label');
        if (det) det.style.display=''; if (lbl) lbl.textContent=label||'Location detected';
        var f=function(id,v){var el=document.getElementById(id);if(el&&v)el.value=v;};
        f('su-city',city);f('su-district',district);f('su-state',state);f('su-country',country);f('su-pincode',pincode);
        showToast('Location detected!', 2000, 'success');
      }).catch(function(){ if(document.getElementById('su-loc-detected')) document.getElementById('su-loc-detected').style.display=''; });
    done();
  }, function() { showToast('Could not detect. Type manually.', 3000, 'error'); window.signupManualLocation(); done(); },
  { enableHighAccuracy:true, timeout:12000 });
};

window.signupManualLocation = function() {
  var m = document.getElementById('su-loc-manual');
  if (m) m.style.display = '';
};

window.goSuccessToLogin = function() {
  if (typeof switchAuthTab === 'function') switchAuthTab('login');
  window.goTo('screen-auth');
};

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
window.showToast = function(msg, duration, type) {
  duration = duration||2600; type = type||'default';
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = {success:'#166534',error:'#991b1b',warning:'#92400e',default:'#1f2937'}[type]||'#1f2937';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.remove('show'); }, duration);
};

/* ══════════════════════════════════════
   MODAL — clean implementation
══════════════════════════════════════ */
window.showModal = function(html, title) {
  var overlay = document.getElementById('global-modal');
  var content = document.getElementById('global-modal-content');
  if (!overlay||!content) return;
  content.innerHTML =
    '<div class="modal-handle"></div>'+
    (title?'<div class="modal-header"><h3 class="modal-title">'+title+'</h3><button class="modal-close" onclick="closeGlobalModal()">&#10005;</button></div>':'')+
    '<div class="modal-body">'+html+'</div>';
  overlay.classList.add('show');
};

window.closeGlobalModal = function(e) {
  if (e && e.target && e.target.id !== 'global-modal') return;
  var m = document.getElementById('global-modal');
  if (m) m.classList.remove('show');
};

/* ══════════════════════════════════════
   CART CONFLICT MODAL — replaces confirm()
══════════════════════════════════════ */
window._pendingCartAdd = null;
window.showCartConflictModal = function(item, shopId, shopName) {
  window._pendingCartAdd = { item: item, shopId: shopId, shopName: shopName };
  var msg = document.getElementById('cart-conflict-msg');
  if (msg) msg.textContent = 'Your cart has items from ' + (window.cart.shopName || 'another shop') + '. Adding from a different shop will clear it.';
  var overlay = document.getElementById('cart-conflict-overlay');
  if (overlay) overlay.classList.add('open');
};

window.confirmCartReplace = function() {
  var overlay = document.getElementById('cart-conflict-overlay');
  if (overlay) overlay.classList.remove('open');
  var p = window._pendingCartAdd;
  if (!p) return;
  window._pendingCartAdd = null;
  window.cart.items    = [];
  window.cart.shopId   = p.shopId;
  window.cart.shopName = p.shopName;
  window.cart.items.push(Object.assign({}, p.item, { qty: 1 }));
  window.cart.updateUI();
  showToast(p.item.name + ' added to cart', 1800, 'success');
  if (typeof _updateProductCtrl === 'function') _updateProductCtrl(p.item.id);
};

/* ══════════════════════════════════════
   SIGN OUT — closes modal first
══════════════════════════════════════ */
window.signOut = async function() {
  var modal = document.getElementById('global-modal');
  if (modal) modal.classList.remove('show');
  if (!window.FB) return;
  // Close all overlays first
  ['global-modal','add-item-overlay','respond-overlay','cart-conflict-overlay'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.remove('show','open'); }
  });
  try {
    await window.FB.signOut(window.FB.auth);
    window.currentUser=null; window.currentUserData=null; window.currentRole=null;
    if (window.cart) window.cart.clear();
    NB.unsubscribers.forEach(function(u){try{u();}catch(e){}});
    NB.unsubscribers=[];
    showToast('Signed out successfully', 2000);
    document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active','exit-left','exit-right');});
    var splash = document.getElementById('screen-splash');
    if (splash) splash.classList.add('active');
    NB.currentScreen = 'screen-splash';
    setTimeout(function(){
      _navTo('screen-welcome');
      var el=document.getElementById('welcome-location');
      if(el) el.textContent='Tap to detect location \uD83D\uDCCC';
    }, 1800);
  } catch(e){ showToast('Error signing out', 2500, 'error'); }
};

/* ══════════════════════════════════════
   CART STATE — no native confirm()
══════════════════════════════════════ */
window.cart = {
  items:[], shopId:null, shopName:'',
  add: function(item, shopId, shopName) {
    if (this.shopId && this.shopId !== shopId) {
      window.showCartConflictModal(item, shopId, shopName);
      return;
    }
    this.shopId=shopId; this.shopName=shopName;
    var ex = this.items.find(function(i){return i.id===item.id;});
    if (ex) { ex.qty+=1; } else { this.items.push(Object.assign({},item,{qty:1})); }
    this.updateUI();
  },
  remove: function(itemId) {
    var idx = this.items.findIndex(function(i){return i.id===itemId;});
    if (idx===-1) return;
    if (this.items[idx].qty>1){this.items[idx].qty-=1;}else{this.items.splice(idx,1);}
    if (!this.items.length) this.shopId=null;
    this.updateUI();
  },
  clear: function(){this.items=[];this.shopId=null;this.shopName='';this.updateUI();},
  get total(){return this.items.reduce(function(s,i){return s+(i.price*i.qty);},0);},
  get count(){return this.items.reduce(function(s,i){return s+i.qty;},0);},
  getQty: function(itemId){var f=this.items.find(function(i){return i.id===itemId;});return f?f.qty:0;},
  updateUI: function(){
    var count=this.count, total=this.total;
    document.querySelectorAll('.cart-float').forEach(function(cf){
      cf.style.display=count>0?'':'none';
      var cEl=cf.querySelector('.cart-float-count'), tEl=cf.querySelector('.cart-float-total');
      if(cEl) cEl.textContent=count+(count===1?' item':' items');
      if(tEl) tEl.innerHTML='&#8377;'+total;
    });
    document.querySelectorAll('.cart-nav-badge').forEach(function(b){
      b.textContent=count; b.style.display=count>0?'':'none';
    });
  }
};

/* ══════════════════════════════════════
   MISC HELPERS
══════════════════════════════════════ */
window.notifCount=0;
window.updateNotifBadge=function(count){
  window.notifCount=count;
  document.querySelectorAll('.notif-badge').forEach(function(b){b.textContent=count;b.style.display=count>0?'':'none';});
  document.querySelectorAll('.notif-dot').forEach(function(d){d.style.display=count>0?'':'none';});
};
window.markNotifsRead=function(){updateNotifBadge(0);};

window.formatCurrency=function(n){return '&#8377;'+Number(n).toFixed(2).replace(/\.00$/,'');};
window.formatDate=function(ts){var d=ts&&ts.toDate?ts.toDate():new Date(ts);return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});};
window.formatTime=function(ts){var d=ts&&ts.toDate?ts.toDate():new Date(ts);return d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});};
window.timeAgo=function(ts){
  if(!ts) return '';
  var d=ts&&ts.toDate?ts.toDate():new Date(ts), diff=(Date.now()-d.getTime())/1000;
  if(diff<60) return 'just now';
  if(diff<3600) return Math.floor(diff/60)+'m ago';
  if(diff<86400) return Math.floor(diff/3600)+'h ago';
  return Math.floor(diff/86400)+'d ago';
};
window.calcDistance=function(lat1,lng1,lat2,lng2){
  if(!lat1||!lng1||!lat2||!lng2) return 999;
  var R=6371,dLat=(lat2-lat1)*Math.PI/180,dLng=(lng2-lng1)*Math.PI/180;
  var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)*Math.sin(dLng/2);
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
};
window.getGreeting=function(){var h=new Date().getHours();return h>=5&&h<12?'Good Morning':h>=12&&h<17?'Good Afternoon':h>=17&&h<21?'Good Evening':'Good Night';};
window.getUserInitials=function(name){if(!name)return 'U';var p=name.trim().split(' ');return p.length>=2?(p[0][0]+p[1][0]).toUpperCase():p[0][0].toUpperCase();};
window.updateHeaderUser=function(role){
  var data=window.currentUserData; if(!data) return;
  var name=data.name||'User', init=getUserInitials(name);
  if(role==='customer'){var g=document.querySelector('.cust-greeting'),n=document.querySelector('.cust-name');if(g)g.textContent=getGreeting()+',';if(n)n.textContent=name;document.querySelectorAll('#screen-cust-home .avatar,#screen-cust-profile .avatar').forEach(function(a){if(!a.querySelector('img'))a.textContent=init;});}
  if(role==='shopkeeper'){var sn=document.querySelector('.sk-shop-name');if(sn)sn.textContent=data.shopName||name;document.querySelectorAll('#screen-sk-home .avatar').forEach(function(a){if(!a.querySelector('img'))a.textContent=init;});}
  if(role==='delivery'){var dg=document.querySelector('.drv-greeting'),dn=document.querySelector('.drv-name');if(dg)dg.textContent=getGreeting()+',';if(dn)dn.textContent=name;document.querySelectorAll('#screen-drv-home .avatar').forEach(function(a){if(!a.querySelector('img'))a.textContent=init;});}
};
window.uploadToCloudinary=async function(file,folder){
  folder=folder||'NearBazaar';
  var fd=new FormData();fd.append('file',file);fd.append('upload_preset','NearBazaar');fd.append('folder',folder);fd.append('cloud_name','dgst3nber');
  try{var r=await fetch('https://api.cloudinary.com/v1_1/dgst3nber/image/upload',{method:'POST',body:fd});var d=await r.json();if(d.secure_url)return d.secure_url;throw new Error();}
  catch(e){showToast('Image upload failed.',3000,'error');return null;}
};
window.openDirections=function(lat,lng){window.open('https://www.google.com/maps/dir/?api=1&destination='+lat+','+lng,'_blank');};
window.callNumber=function(phone){if(phone)window.open('tel:+91'+String(phone).replace(/\D/g,''));};
window.switchRole=async function(newRole){
  if(!window.currentUser||!window.FB)return;
  try{await window.FB.updateDoc(window.FB.doc(window.FB.db,'users',window.currentUser.uid),{role:newRole});window.currentUserData.role=newRole;window.currentRole=newRole;showToast('Switched to '+newRole+' mode',2000,'success');navigateToRoleDashboard(newRole);}
  catch(e){showToast('Failed to switch role',2500,'error');}
};
window.updateUserProfile=async function(data){
  if(!window.currentUser||!window.FB)return false;
  try{await window.FB.updateDoc(window.FB.doc(window.FB.db,'users',window.currentUser.uid),Object.assign({},data,{updatedAt:window.FB.serverTimestamp()}));window.currentUserData=Object.assign({},window.currentUserData,data);showToast('Profile updated!',2200,'success');return true;}
  catch(e){showToast('Update failed.',2500,'error');return false;}
};

/* ══════════════════════════════════════
   STARTUP — no auto location popup
══════════════════════════════════════ */
window.addEventListener('load',function(){
  var start=function(){
    setTimeout(function(){
      window._splashDone=true;
      if(window._pendingNav){
        var nav=window._pendingNav; window._pendingNav=null;
        if(nav==='auth-signup'){_navTo('screen-auth');if(typeof switchAuthTab==='function')switchAuthTab('signup');}
        else{navigateToRoleDashboard(nav);}
      } else if(!window.currentUser){
        _navTo('screen-welcome');
        // Only show "tap to detect" text — do NOT call detectLocation() here
        // which would trigger the browser geolocation permission popup automatically
        var el=document.getElementById('welcome-location');
        if(el) el.textContent='Tap to detect location \uD83D\uDCCC';
      }
    },2000);
  };
  if(window.fbReady){start();}
  else{document.addEventListener('fb-ready',start,{once:true});setTimeout(start,3500);}
});
