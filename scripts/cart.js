// Simple cart implementation: store items in localStorage and render cart on order page
(function(){
  const CART_KEY = 'cart';

  function getCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch(e){ return {}; }
  }

  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount(){
    const cart = getCart();
    let count = 0;
    Object.values(cart).forEach(i => count += i.qty || 0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = count;
  }

  function addItem(name, price){
    const cart = getCart();
    if(cart[name]) cart[name].qty += 1;
    else cart[name] = { name: name, price: Number(price) || 0, qty: 1 };
    saveCart(cart);
  }

  function renderCart(){
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
    items.forEach(it => {
      const row = document.createElement('tr');
      const nameTd = document.createElement('td'); nameTd.textContent = it.name;
      const qtyTd = document.createElement('td'); qtyTd.textContent = it.qty;
      const priceTd = document.createElement('td');
      const line = (Number(it.price) * Number(it.qty)).toFixed(2);
      priceTd.textContent = '$' + line;
      total += Number(it.price) * Number(it.qty);
      row.appendChild(nameTd);
      row.appendChild(qtyTd);
      row.appendChild(priceTd);
      tbody.appendChild(row);
    });

    const totalEl = document.getElementById('total-amt');
    if(totalEl) totalEl.textContent = total.toFixed(2);
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function(){
        const item = btn.closest('.menu-item');
        const name = item && item.dataset && item.dataset.name;
        const price = item && item.dataset && item.dataset.price;
        if(!name) return;
        addItem(name, price);
        const prev = btn.textContent;
        btn.textContent = 'Added';
        setTimeout(() => btn.textContent = prev, 700);
      });
    });

    const clearBtn = document.getElementById('clear-cart');
    if(clearBtn) clearBtn.addEventListener('click', function(){
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      renderCart();
    });

    const checkoutBtn = document.getElementById('checkout');
    if(checkoutBtn) checkoutBtn.addEventListener('click', function(){
      alert('Order placed — thank you!');
      localStorage.removeItem(CART_KEY);
      updateCartCount();
      renderCart();
    });

    // If on order page, render cart contents
    if(document.getElementById('cart')) renderCart();
  });
})();
