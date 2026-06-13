/* ═══════════════════════════════════════════════════════════════
   NearBazaar — auth.js (v1.2 Final)
   Firebase Authentication — Login, Signup, Google Auth
   Designed & Developed by Siddhesh
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── TAB SWITCH ── */
window.switchAuthTab = function(tab) {
  var lf  = document.getElementById('login-form');
  var sf  = document.getElementById('signup-form');
  var tl  = document.getElementById('tab-login');
  var ts  = document.getElementById('tab-signup');
  var ttl = document.getElementById('auth-title');
  var sub = document.getElementById('auth-sub');

  if (tab === 'login') {
    if (lf)  lf.style.display  = '';
    if (sf)  sf.style.display  = 'none';
    if (tl)  tl.classList.add('active');
    if (ts)  ts.classList.remove('active');
    if (ttl) ttl.textContent = 'Welcome Back!';
    if (sub) sub.textContent = 'Sign in to continue';
  } else {
    if (lf)  lf.style.display  = 'none';
    if (sf)  sf.style.display  = '';
    if (tl)  tl.classList.remove('active');
    if (ts)  ts.classList.add('active');
    if (ttl) ttl.textContent = 'Create Account';
    if (sub) sub.textContent = 'Join NearBazaar today';

    var role = (window.NearBazaar && window.NearBazaar.selectedRole) || 'customer';
    document.querySelectorAll('.role-pill').forEach(function(p) {
      p.classList.toggle('active', p.dataset.role === role);
    });
    if (window.NearBazaar) window.NearBazaar.suRole = role;
  }
};

/* ── ROLE PILL ── */
window.selectSuRole = function(el, role) {
  document.querySelectorAll('.role-pill').forEach(function(p) { p.classList.remove('active'); });
  el.classList.add('active');
  if (window.NearBazaar) window.NearBazaar.suRole = role;
};

/* ── PASSWORD TOGGLE ── */
window.togglePass = function(inputId, btn) {
  var input = document.getElementById(inputId);
  if (!input) return;
  var show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.innerHTML = show
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
};

/* ── HELPERS ── */
function _validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function _setLoading(btnId, loading) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn._orig = btn.innerHTML;
    btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><span style="width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0;"></span>Please wait\u2026</span>';
  } else if (btn._orig) {
    btn.innerHTML = btn._orig;
    btn._orig = null;
  }
}

function _getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

async function _saveProfile(uid, data) {
  if (!window.FB) return;
  await window.FB.setDoc(
    window.FB.doc(window.FB.db, 'users', uid),
    Object.assign({}, data, { createdAt: window.FB.serverTimestamp(), updatedAt: window.FB.serverTimestamp() }),
    { merge: true }
  );
}

/* ── LOGIN ── */
window.loginWithEmail = async function() {
  if (!window.FB) { showToast('App not ready. Please wait.', 2500, 'error'); return; }

  var email = _getVal('login-email');
  var pass  = document.getElementById('login-pass') ? document.getElementById('login-pass').value : '';

  if (!email || !_validEmail(email)) { showToast('Enter a valid email address', 2500, 'error'); return; }
  if (!pass || pass.length < 6)     { showToast('Password must be at least 6 characters', 2500, 'error'); return; }

  _setLoading('login-btn', true);
  window._isHandlingAuth = true;

  try {
    var cred = await window.FB.signInWithEmailAndPassword(window.FB.auth, email, pass);
    window.currentUser = cred.user;

    var snap = await window.FB.getDoc(window.FB.doc(window.FB.db, 'users', cred.user.uid));
    if (snap.exists()) {
      window.currentUserData = snap.data();
      window.currentRole = snap.data().role || 'customer';
      showToast('Welcome back, ' + (snap.data().name || 'User') + '!', 2200, 'success');
      window._isHandlingAuth = false;
      navigateToRoleDashboard(window.currentRole);
    } else {
      window._isHandlingAuth = false;
      switchAuthTab('signup');
      showToast('Please complete your profile', 2500);
    }
  } catch(err) {
    window._isHandlingAuth = false;
    var msgs = {
      'auth/user-not-found':        'No account with this email. Please sign up.',
      'auth/wrong-password':        'Incorrect password. Please try again.',
      'auth/invalid-email':         'Invalid email address.',
      'auth/too-many-requests':     'Too many attempts. Try again later.',
      'auth/network-request-failed':'Network error. Check your connection.',
      'auth/invalid-credential':    'Incorrect email or password.',
    };
    showToast(msgs[err.code] || 'Login failed. Please try again.', 3000, 'error');
  } finally {
    _setLoading('login-btn', false);
  }
};

/* ── SIGNUP ── */
window.signUpWithEmail = async function() {
  if (!window.FB) { showToast('App not ready. Please wait.', 2500, 'error'); return; }

  var name  = _getVal('su-name');
  var phone = _getVal('su-phone');
  var email = _getVal('su-email');
  var pass  = document.getElementById('su-pass') ? document.getElementById('su-pass').value : '';
  var role  = (window.NearBazaar && window.NearBazaar.suRole) || 'customer';

  if (!name)                                        { showToast('Please enter your full name', 2500, 'error'); return; }
  if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) { showToast('Enter a valid 10-digit mobile number', 2500, 'error'); return; }
  if (!email || !_validEmail(email))                { showToast('Enter a valid email address', 2500, 'error'); return; }
  if (!pass  || pass.length < 6)                   { showToast('Password must be at least 6 characters', 2500, 'error'); return; }

  // Build location
  var locData = (window.NearBazaar && window.NearBazaar.userLocation) || null;
  var city    = _getVal('su-city');
  var dist    = _getVal('su-district');
  var state   = _getVal('su-state');
  var country = _getVal('su-country') || 'India';
  var pin     = _getVal('su-pincode');
  if (city || state) {
    var label = [city, dist, state, country].filter(Boolean).join(', ');
    locData = Object.assign({}, locData || {}, { label:label, city:city, district:dist, state:state, country:country, pincode:pin });
  }

  _setLoading('signup-btn', true);
  window._isHandlingAuth = true; // Tell auth observer to stay out

  try {
    var cred = await window.FB.createUserWithEmailAndPassword(window.FB.auth, email, pass);

    var userData = window._buildUserData
      ? window._buildUserData(cred.user.uid, name, email, phone, role, '')
      : { uid:cred.user.uid, name:name, email:email, phone:phone, role:role, photoURL:'', totalOrders:0, totalSpent:0 };

    userData.address  = [city, dist, state].filter(Boolean).join(', ');
    userData.location = locData;

    await _saveProfile(cred.user.uid, userData);

    // Create shop doc for shopkeepers
    if (role === 'shopkeeper') {
      await window.FB.setDoc(window.FB.doc(window.FB.db, 'shops', cred.user.uid), {
        ownerId: cred.user.uid,
        shopName: userData.shopName || (name + "'s Shop"),
        shopCategory: 'General', shopOpen: false,
        location: locData, rating: 0, reviewCount: 0, phone: phone,
        deliveryRadius: 5, createdAt: window.FB.serverTimestamp()
      }, { merge: true }).catch(function() {});
    }

    // Sign out — user must log in explicitly
    await window.FB.signOut(window.FB.auth);
    window.currentUser     = null;
    window.currentUserData = null;
    window._isHandlingAuth = false;

    // Navigate to success screen
    goTo('screen-signup-success');

  } catch(err) {
    window._isHandlingAuth = false;
    var msgs = {
      'auth/email-already-in-use': 'This email is already registered. Please login.',
      'auth/weak-password':        'Password too weak. Use at least 6 characters.',
      'auth/invalid-email':        'Invalid email address.',
      'auth/network-request-failed':'Network error. Check your connection.',
    };
    showToast(msgs[err.code] || 'Signup failed. Please try again.', 3000, 'error');
  } finally {
    _setLoading('signup-btn', false);
  }
};

/* ── GOOGLE SIGN IN ── */
window.signInWithGoogle = async function() {
  if (!window.FB) { showToast('App not ready. Please wait.', 2500, 'error'); return; }

  var provider = new window.FB.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  localStorage.setItem('nb_pending_role', (window.NearBazaar && window.NearBazaar.selectedRole) || 'customer');

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 600;

  window._isHandlingAuth = true;

  if (isMobile) {
    try {
      await window.FB.signInWithRedirect(window.FB.auth, provider);
    } catch(e) {
      window._isHandlingAuth = false;
      showToast('Google sign-in failed. Try again.', 3000, 'error');
    }
    return;
  }

  // Desktop popup
  try {
    var result = await window.FB.signInWithPopup(window.FB.auth, provider);
    var user   = result.user;
    window.currentUser = user;

    var snap = await window.FB.getDoc(window.FB.doc(window.FB.db, 'users', user.uid));
    if (snap.exists()) {
      window.currentUserData = snap.data();
      window.currentRole = snap.data().role || 'customer';
      showToast('Welcome back, ' + snap.data().name + '!', 2200, 'success');
      window._isHandlingAuth = false;
      navigateToRoleDashboard(window.currentRole);
    } else {
      var role = (window.NearBazaar && window.NearBazaar.selectedRole) || 'customer';
      var userData = window._buildUserData
        ? window._buildUserData(user.uid, user.displayName||'User', user.email, '', role, user.photoURL||'')
        : { uid:user.uid, name:user.displayName||'User', email:user.email, phone:'', role:role, photoURL:user.photoURL||'', totalOrders:0, totalSpent:0 };
      userData.location = (window.NearBazaar && window.NearBazaar.userLocation) || null;
      await _saveProfile(user.uid, userData);
      window.currentUserData = userData;
      window.currentRole = role;
      showToast('Welcome to NearBazaar, ' + (user.displayName || 'User') + '!', 2500, 'success');
      window._isHandlingAuth = false;
      navigateToRoleDashboard(role);
    }
  } catch(err) {
    window._isHandlingAuth = false;
    if (err.code === 'auth/popup-closed-by-user') return;
    if (err.code === 'auth/popup-blocked') {
      try { await window.FB.signInWithRedirect(window.FB.auth, provider); } catch(e) {}
      return;
    }
    showToast('Google sign-in failed. Try again.', 3000, 'error');
  }
};

/* ── FORGOT PASSWORD ── */
window.forgotPassword = async function() {
  var email = _getVal('login-email');
  if (!email || !_validEmail(email)) {
    showToast('Enter your email first, then tap Forgot Password', 3000, 'error');
    return;
  }
  try {
    await window.FB.sendPasswordResetEmail(window.FB.auth, email);
    showToast('Password reset email sent! Check your inbox.', 3500, 'success');
  } catch(e) {
    showToast('Could not send reset email. Check the address.', 3000, 'error');
  }
};
