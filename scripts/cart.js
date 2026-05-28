// Cart system: +/- qty controls on menu items, floating cart FAB, drawer popup, toast
(function(){
  const CART_KEY = 'cart';
  const CURRENCY = '₹';

  // ---- Data layer ----
  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch(e){ return {}; }
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    
    // Also save to Firestore for persistent storage
    if (window.firebase && window.firebase.firestore && window.firebase.auth) {
      const user = window.firebase.auth().currentUser;
      if (user) {
        try {
          const db = window.firebase.firestore();
          db.collection('carts').doc(user.uid).set({
            items: cart,
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
          }).catch(err => console.warn('Cart save to Firestore failed:', err));
        } catch (e) {
          console.warn('Firestore cart save error:', e);
        }
      }
    }
    
    updateAllQtyDisplays();
    updateFabBadge();
  }
  
  // Load cart from Firestore if user is logged in
  function loadCartFromFirestore() {
    if (window.firebase && window.firebase.firestore && window.firebase.auth) {
      const user = window.firebase.auth().currentUser;
      if (user) {
        try {
          const db = window.firebase.firestore();
          db.collection('carts').doc(user.uid).get().then(doc => {
            if (doc.exists && doc.data().items) {
              localStorage.setItem(CART_KEY, JSON.stringify(doc.data().items));
              updateAllQtyDisplays();
              updateFabBadge();
            }
          }).catch(err => console.warn('Firestore cart load failed:', err));
        } catch (e) {
          console.warn('Firestore cart load error:', e);
        }
      }
    }
  }
  
  function clearCart(){
    localStorage.removeItem(CART_KEY);
    
    // Also clear from Firestore
    if (window.firebase && window.firebase.firestore && window.firebase.auth) {
      const user = window.firebase.auth().currentUser;
      if (user) {
        try {
          const db = window.firebase.firestore();
          db.collection('carts').doc(user.uid).delete().catch(err => console.warn('Firestore cart clear failed:', err));
        } catch (e) {
          console.warn('Firestore cart clear error:', e);
        }
      }
    }
    
    updateAllQtyDisplays();
    updateFabBadge();
  }
  function getTotalQty(){
    let n = 0; Object.values(getCart()).forEach(i => n += (i.qty||0)); return n;
  }
  function getTotalPrice(){
    let t = 0; Object.values(getCart()).forEach(i => t += (i.price||0)*(i.qty||0)); return t;
  }

  // ---- Update header cart count ----
  function updateCartCount(){
    const el = document.getElementById('cart-count');
    if(el) el.textContent = getTotalQty();
  }

  // ---- Menu page: convert Add buttons to +/- controls ----
  function initMenuControls(){
    // Patch existing cart entries: add missing images from current menu DOM
    var cart = getCart();
    var patched = false;
    document.querySelectorAll('.menu-item').forEach(function(item){
      var n = item.dataset.name;
      if(cart[n] && !cart[n].img){
        var imgEl = item.querySelector('.menu-thumb');
        if(imgEl && imgEl.src){ cart[n].img = imgEl.src; patched = true; }
      }
    });
    if(patched) saveCart(cart);

    document.querySelectorAll('.menu-item').forEach(item => {
      const name = item.dataset.name;
      const price = Number(item.dataset.price) || 0;
      const addBtn = item.querySelector('.add-to-cart');
      if(!addBtn || !name) return;

      // Build qty control group
      const wrap = document.createElement('span');
      wrap.className = 'qty-controls';
      wrap.dataset.cartName = name;

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'qty-btn minus';
      minusBtn.textContent = '\u2212'; // −
      minusBtn.setAttribute('aria-label', 'Remove one ' + name);

      const valSpan = document.createElement('span');
      valSpan.className = 'qty-val';
      valSpan.textContent = '0';

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'qty-btn plus';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', 'Add one ' + name);

      wrap.appendChild(minusBtn);
      wrap.appendChild(valSpan);
      wrap.appendChild(plusBtn);

      // Replace Add button with controls
      addBtn.replaceWith(wrap);

      // Find image src for this item (used in drawer)
      const img = item.querySelector('.menu-thumb');
      const imgSrc = img ? img.src : '';

      plusBtn.addEventListener('click', function(){
        const cart = getCart();
        if(cart[name]){ cart[name].qty += 1; }
        else { cart[name] = { name:name, price:price, qty:1, img:imgSrc }; }
        saveCart(cart);
        showToast(name, cart[name].qty);
        renderDrawerIfOpen();
      });

      minusBtn.addEventListener('click', function(){
        const cart = getCart();
        if(!cart[name]) return;
        cart[name].qty -= 1;
        if(cart[name].qty <= 0) delete cart[name];
        saveCart(cart);
        renderDrawerIfOpen();
      });
    });
    updateAllQtyDisplays();
  }

  function updateAllQtyDisplays(){
    const cart = getCart();
    document.querySelectorAll('.qty-controls[data-cart-name]').forEach(ctrl => {
      const name = ctrl.dataset.cartName;
      const qty = cart[name] ? cart[name].qty : 0;
      const val = ctrl.querySelector('.qty-val');
      const minus = ctrl.querySelector('.minus');
      if(val) val.textContent = qty;
      if(minus) minus.style.visibility = qty > 0 ? 'visible' : 'hidden';
      if(val) val.style.visibility = qty > 0 ? 'visible' : 'hidden';
    });
    updateCartCount();
  }

  // ---- Floating Cart Button (FAB) ----
  let fabEl = null;
  function createFAB(){
    if(fabEl) return;
    fabEl = document.createElement('button');
    fabEl.className = 'cart-fab';
    fabEl.setAttribute('aria-label', 'Open cart');
    fabEl.innerHTML = '&#x1f6d2; Cart <span class="fab-badge">0</span>';
    document.body.appendChild(fabEl);
    fabEl.addEventListener('click', openDrawer);
    updateFabBadge();
  }
  function updateFabBadge(){
    if(!fabEl) return;
    const badge = fabEl.querySelector('.fab-badge');
    const qty = getTotalQty();
    if(badge) badge.textContent = qty;
    fabEl.style.display = qty > 0 ? 'flex' : 'none';
  }

  // ---- Cart Drawer ----
  let overlayEl = null, drawerEl = null;
  function createDrawer(){
    if(drawerEl) return;

    overlayEl = document.createElement('div');
    overlayEl.className = 'cart-overlay';
    overlayEl.addEventListener('click', closeDrawer);

    drawerEl = document.createElement('div');
    drawerEl.className = 'cart-drawer';
    drawerEl.innerHTML =
      '<div class="cart-drawer-header"><h3>My Cart</h3><button class="cart-drawer-close" aria-label="Close cart">&times;</button></div>' +
      '<div class="cart-drawer-body" id="drawer-body"></div>' +
      '<div class="cart-drawer-footer" id="drawer-footer"></div>';

    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);

    drawerEl.querySelector('.cart-drawer-close').addEventListener('click', closeDrawer);
  }

  function openDrawer(){
    createDrawer();
    renderDrawer();
    overlayEl.classList.add('open');
    drawerEl.classList.add('open');
  }
  function closeDrawer(){
    if(overlayEl) overlayEl.classList.remove('open');
    if(drawerEl) drawerEl.classList.remove('open');
  }

  function renderDrawerIfOpen(){
    if(drawerEl && drawerEl.classList.contains('open')) renderDrawer();
  }

  function renderDrawer(){
    const body = document.getElementById('drawer-body');
    const footer = document.getElementById('drawer-footer');
    if(!body || !footer) return;

    const cart = getCart();
    const items = Object.values(cart);

    if(items.length === 0){
      body.innerHTML = '<div class="drawer-empty"><span class="drawer-empty-icon">&#x1f6d2;</span>Your cart is empty</div>';
      footer.innerHTML = '';
      return;
    }

    let html = '';
    items.forEach(it => {
      const line = (it.price * it.qty).toFixed(2);
      const imgTag = it.img
        ? '<img class="drawer-item-img" src="' + escapeAttr(it.img) + '" alt="" onerror="this.outerHTML=\'<div class=drawer-item-img style=background:rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;font-size:1.3rem>&#x1f375;</div>\'">'
        : '<div class="drawer-item-img" style="background:rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:center;font-size:1.3rem">&#x1f375;</div>';
      html += '<div class="drawer-item" data-drawer-name="' + escapeAttr(it.name) + '">';
      html += imgTag;
      html += '<div class="drawer-item-info">';
      html += '<div class="drawer-item-name">' + escapeHtml(it.name) + '</div>';
      html += '<div class="drawer-item-price">' + CURRENCY + it.price.toFixed(2) + ' &bull; ' + it.qty + ' pcs</div>';
      html += '</div>';
      html += '<span class="qty-controls">';
      html += '<button type="button" class="qty-btn minus drawer-minus" aria-label="Remove one">\u2212</button>';
      html += '<button type="button" class="qty-btn plus drawer-plus" aria-label="Add one">+</button>';
      html += '</span>';
      html += '<span class="drawer-item-line">' + CURRENCY + line + '</span>';
      html += '</div>';
    });
    body.innerHTML = html;

    // Wire up drawer +/- buttons
    body.querySelectorAll('.drawer-item').forEach(row => {
      const name = row.dataset.drawerName;
      row.querySelector('.drawer-plus').addEventListener('click', function(){
        const c = getCart();
        if(c[name]) c[name].qty += 1;
        saveCart(c);
        renderDrawer();
      });
      row.querySelector('.drawer-minus').addEventListener('click', function(){
        const c = getCart();
        if(!c[name]) return;
        c[name].qty -= 1;
        if(c[name].qty <= 0) delete c[name];
        saveCart(c);
        renderDrawer();
      });
    });

    const total = getTotalPrice().toFixed(2);
    footer.innerHTML =
      '<div class="drawer-total"><span class="drawer-total-label">Total</span><span class="drawer-total-value">' + CURRENCY + total + '</span></div>' +
      '<div class="drawer-actions">' +
      '<a href="client-dashboard.html" class="btn btn--sm" style="flex:1.2">Login to Proceed</a>' +
      '<button type="button" class="btn btn--outline btn--sm drawer-clear">Clear</button>' +
      '</div>';

    footer.querySelector('.drawer-clear').addEventListener('click', function(){
      clearCart();
      renderDrawer();
      updateFabBadge();
    });
  }

  // ---- Toast notification ----
  let toastEl = null, toastTimer = null;
  function createToast(){
    if(toastEl) return;
    toastEl = document.createElement('div');
    toastEl.className = 'cart-toast';
    toastEl.innerHTML = '<div class="cart-toast-title">Cart Updated</div><div class="cart-toast-body" id="toast-msg"></div>';
    document.body.appendChild(toastEl);
  }
  function showToast(itemName, itemQty){
    createToast();
    const totalQty = getTotalQty();
    const totalItems = Object.keys(getCart()).length;
    const msg = document.getElementById('toast-msg');
    if(msg){
      msg.innerHTML = 'Aapne <b>' + totalItems + '</b> item(s) select kiye, total qty <b>' + totalQty + '</b>.<br><a href="client-dashboard.html">Client Dashboard jao aur apni information add karo.</a>';
    }
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 3500);
  }

  // ---- Helpers ----
  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, function(c){ return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }
  function escapeAttr(s){ return escapeHtml(s); }

  // ---- Order page rendering (kept for order.html) ----
  function renderOrderPage(){
    const cart = getCart();
    const tbody = document.querySelector('#cart-table tbody');
    const emptyMsg = document.getElementById('empty-msg');
    const cartTable = document.getElementById('cart-table');
    const cartTotalDiv = document.getElementById('cart-total');
    if(!tbody) return;

    const items = Object.values(cart);
    if(items.length === 0){
      if(emptyMsg) emptyMsg.style.display = 'block';
      if(cartTable) cartTable.hidden = true;
      if(cartTotalDiv) cartTotalDiv.hidden = true;
      return;
    }

    if(emptyMsg) emptyMsg.style.display = 'none';
    if(cartTable) cartTable.hidden = false;
    if(cartTotalDiv) cartTotalDiv.hidden = false;

    tbody.innerHTML = '';
    let total = 0;
    items.forEach(function(it){
      const row = document.createElement('tr');
      const nameTd = document.createElement('td'); nameTd.textContent = it.name;
      const qtyTd = document.createElement('td'); qtyTd.textContent = it.qty;
      const priceTd = document.createElement('td');
      const line = (Number(it.price) * Number(it.qty)).toFixed(2);
      priceTd.textContent = CURRENCY + line;
      total += Number(it.price) * Number(it.qty);
      row.appendChild(nameTd);
      row.appendChild(qtyTd);
      row.appendChild(priceTd);
      tbody.appendChild(row);
    });

    const totalEl = document.getElementById('total-amt');
    if(totalEl) totalEl.textContent = total.toFixed(2);
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function(){
    updateCartCount();
    
    // Load cart from Firestore if user is logged in (persistent storage)
    loadCartFromFirestore();

    // If menu items exist, set up +/- controls
    if(document.querySelector('.menu-item')) {
      initMenuControls();
      createFAB();
    }

    // Order page clear/checkout
    var clearBtn = document.getElementById('clear-cart');
    if(clearBtn) clearBtn.addEventListener('click', function(){
      clearCart();
      renderOrderPage();
    });

    var checkoutBtn = document.getElementById('checkout');
    if(checkoutBtn) checkoutBtn.addEventListener('click', function(){
      alert('Order placed — thank you!');
      clearCart();
      renderOrderPage();
    });

    // If on order page, render table
    if(document.getElementById('cart')) renderOrderPage();
  });
})();
