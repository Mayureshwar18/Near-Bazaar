/* ═══════════════════════════════════════════════════════════════
   NearBazaar — notifications.js
   Centralized notification creation + display for all roles
   Designed & Developed by Siddhesh
═══════════════════════════════════════════════════════════════ */
'use strict';

/* ── NOTIFICATION ICONS per type ── */
var NOTIF_ICONS = {
  'order_placed':    { icon: '&#128203;', color: '#1d4ed8', bg: '#dbeafe' },
  'order_confirmed': { icon: '&#9989;',   color: '#166534', bg: '#dcfce7' },
  'order_packed':    { icon: '&#128092;', color: '#b45309', bg: '#fef3c7' },
  'order_otw':       { icon: '&#128666;', color: '#7c3aed', bg: '#ede9fe' },
  'order_delivered': { icon: '&#127881;', color: '#166534', bg: '#dcfce7' },
  'order_rejected':  { icon: '&#10060;',  color: '#991b1b', bg: '#fee2e2' },
  'new_order':       { icon: '&#128182;', color: '#b45309', bg: '#fef3c7' },
  'delivery_ready':  { icon: '&#128092;', color: '#1d4ed8', bg: '#dbeafe' },
  'request_quote':   { icon: '&#128140;', color: '#166534', bg: '#dcfce7' },
  'review_received': { icon: '&#11088;',  color: '#92400e', bg: '#fef3c7' },
  'otp_verified':    { icon: '&#128273;', color: '#166534', bg: '#dcfce7' },
  'default':         { icon: '&#128276;', color: '#374151', bg: '#f3f4f6' }
};

/* ─────────────────────────────────────
   sendNotif(userId, type, message, data)
   Creates a notification doc in Firestore for a specific user
───────────────────────────────────────*/
window.sendNotif = async function(userId, type, message, extraData) {
  if (!window.FB || !userId) return;
  try {
    var db            = window.FB.db;
    var collection    = window.FB.collection;
    var addDoc        = window.FB.addDoc;
    var serverTimestamp = window.FB.serverTimestamp;

    await addDoc(collection(db, 'notifications'), Object.assign({
      userId:    userId,
      type:      type || 'default',
      message:   message || '',
      read:      false,
      createdAt: serverTimestamp()
    }, extraData || {}));
  } catch(e) {
    console.warn('sendNotif error:', e);
  }
};

/* ─────────────────────────────────────
   renderNotifList(listEl, docs)
   Renders notification items into a container element
───────────────────────────────────────*/
function renderNotifList(listEl, docs) {
  if (!listEl) return;
  if (!docs || !docs.length) {
    listEl.innerHTML =
      '<div style="text-align:center;padding:60px 20px;color:#9ca3af;">' +
      '<div style="font-size:48px;margin-bottom:12px;">&#128276;</div>' +
      '<div style="font-weight:700;font-size:15px;color:#374151;">No notifications yet</div>' +
      '<div style="font-size:13px;margin-top:4px;">Updates about your orders will appear here</div>' +
      '</div>';
    return;
  }

  // Sort newest first
  var sorted = docs.slice().sort(function(a, b) {
    var ta = 0, tb = 0;
    if (a.createdAt && a.createdAt.toDate) ta = a.createdAt.toDate().getTime();
    if (b.createdAt && b.createdAt.toDate) tb = b.createdAt.toDate().getTime();
    return tb - ta;
  });

  var html = '';
  sorted.forEach(function(n) {
    var cfg   = NOTIF_ICONS[n.type] || NOTIF_ICONS['default'];
    var ago   = n.createdAt ? timeAgo(n.createdAt) : '';
    html +=
      '<div class="notif-item' + (n.read ? '' : ' unread') + '" id="notif-' + n.id + '">' +
        '<div class="notif-icon-wrap" style="background:' + cfg.bg + ';color:' + cfg.color + ';">' + cfg.icon + '</div>' +
        '<div class="notif-text">' +
          '<div class="notif-msg">' + (n.message || '') + '</div>' +
          '<div class="notif-time">' + ago + '</div>' +
        '</div>' +
      '</div>';
  });
  listEl.innerHTML = html;
}

/* ─────────────────────────────────────
   setupNotifScreen(listId, dotId, badgeIds, clearBtnId)
   Sets up a real-time notification listener for a screen
───────────────────────────────────────*/
window.setupNotifScreen = function(listId, dotId, clearBtnId) {
  if (!window.FB || !window.currentUser) return;

  var db         = window.FB.db;
  var collection = window.FB.collection;
  var query      = window.FB.query;
  var where      = window.FB.where;
  var onSnapshot = window.FB.onSnapshot;
  var limit      = window.FB.limit;
  var updateDoc  = window.FB.updateDoc;
  var deleteDoc  = window.FB.deleteDoc;
  var getDocs    = window.FB.getDocs;
  var doc        = window.FB.doc;

  var q = query(
    collection(db, 'notifications'),
    where('userId', '==', window.currentUser.uid),
    limit(50)
  );

  var unsub = onSnapshot(q, function(snap) {
    // Collect docs with their IDs
    var docs = snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); });
    var unread = docs.filter(function(n) { return !n.read; }).length;

    // Update badge
    updateNotifBadge(unread);
    var dot = document.getElementById(dotId);
    if (dot) dot.style.display = unread > 0 ? '' : 'none';

    // Render list
    var listEl = document.getElementById(listId);
    renderNotifList(listEl, docs);

    // Mark all as read when list is viewed
    var currentScreen = window.NearBazaar && window.NearBazaar.currentScreen;
    if (currentScreen && (currentScreen.indexOf('notif') !== -1)) {
      snap.docs.forEach(function(d) {
        if (!d.data().read) {
          updateDoc(doc(db, 'notifications', d.id), { read: true }).catch(function() {});
        }
      });
    }
  }, function() {});

  window.NearBazaar.unsubscribers.push(unsub);

  // Setup clear all button
  var clearBtn = document.getElementById(clearBtnId);
  if (clearBtn) {
    clearBtn.onclick = function() {
      showModal(
        '<div style="text-align:center;padding:8px 0 16px;">' +
        '<div style="font-size:42px;margin-bottom:10px;">&#128465;</div>' +
        '<div style="font-size:17px;font-weight:800;color:#111827;margin-bottom:6px;">Clear All Notifications?</div>' +
        '<div style="font-size:13px;color:#6b7280;margin-bottom:20px;">This will permanently delete all your notifications.</div>' +
        '<div style="display:flex;gap:10px;">' +
        '<button class="btn btn-light btn-full" onclick="closeGlobalModal()">Cancel</button>' +
        '<button class="btn btn-red btn-full" onclick="closeGlobalModal();doClearAllNotifs()">Clear All</button>' +
        '</div></div>'
      );
    };
  }
};

/* Clear all notifications for current user */
window.doClearAllNotifs = async function() {
  if (!window.FB || !window.currentUser) return;
  try {
    var db         = window.FB.db;
    var collection = window.FB.collection;
    var query      = window.FB.query;
    var where      = window.FB.where;
    var getDocs    = window.FB.getDocs;
    var deleteDoc  = window.FB.deleteDoc;
    var doc        = window.FB.doc;

    var q    = query(collection(db, 'notifications'), where('userId', '==', window.currentUser.uid));
    var snap = await getDocs(q);
    var dels = snap.docs.map(function(d) { return deleteDoc(doc(db, 'notifications', d.id)); });
    await Promise.all(dels);
    showToast('All notifications cleared', 2000, 'success');
  } catch(e) {
    showToast('Could not clear notifications', 2500, 'error');
  }
};

/* Mark all as read */
window.markNotifsRead = async function() {
  if (!window.FB || !window.currentUser) return;
  try {
    var db         = window.FB.db;
    var collection = window.FB.collection;
    var query      = window.FB.query;
    var where      = window.FB.where;
    var getDocs    = window.FB.getDocs;
    var updateDoc  = window.FB.updateDoc;
    var doc        = window.FB.doc;

    var q    = query(collection(db, 'notifications'), where('userId', '==', window.currentUser.uid), where('read', '==', false));
    var snap = await getDocs(q);
    var ups  = snap.docs.map(function(d) { return updateDoc(doc(db, 'notifications', d.id), { read: true }); });
    await Promise.all(ups);
    updateNotifBadge(0);
  } catch(e) {}
};
