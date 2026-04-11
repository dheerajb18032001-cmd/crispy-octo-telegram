// scripts/firebase.js
// Simple Firebase helper functions for Authentication (email/password)
// and Firestore examples. Uses compat SDK loaded before this script.

(function(){
  if (!window.firebase) return console.warn('Firebase SDK not loaded');

  const auth = firebase.auth();
  const db = firebase.firestore();

  // Basic UI elements
  const btnSignIn = document.getElementById('btn-signin');
  let signInOpen = false;

  function createLoginDialog(){
    const dlg = document.createElement('div');
    dlg.id = 'login-dialog';
    dlg.style.cssText = 'position:fixed;right:18px;top:68px;background:var(--panel);padding:18px;border-radius:8px;box-shadow:0 12px 30px rgba(0,0,0,0.3);z-index:9999';
    dlg.innerHTML = `
      <form id="fi-form" autocomplete="on" style="margin:0">
        <div id="fi-error" style="min-height:18px;margin-bottom:8px;color:var(--muted)"></div>
        <label style="display:block;margin-bottom:8px;color:var(--muted)">Display name</label>
        <input id="fi-name" name="displayName" type="text" autocomplete="name" style="padding:8px;width:260px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);margin-bottom:8px;display:block">
        <label style="display:block;margin-bottom:8px;color:var(--muted)">Email</label>
        <input id="fi-email" name="email" type="email" autocomplete="email" style="padding:8px;width:260px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);margin-bottom:8px;display:block">
        <label style="display:block;margin-bottom:8px;color:var(--muted)">Password</label>
        <input id="fi-pass" name="password" type="password" autocomplete="current-password" style="padding:8px;width:260px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);margin-bottom:12px;display:block">
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button id="fi-register" type="button" class="btn btn--sm btn--outline">Register</button>
          <button id="fi-login" type="button" class="btn btn--sm btn-primary">Sign In</button>
        </div>
      </form>
    `;
    document.body.appendChild(dlg);
    return dlg;
  }

  let loginDlg = null;
  let dialogWired = false;

  function wireDialogButtons(){
    if (dialogWired) return;
    dialogWired = true;
    const bLogin = document.getElementById('fi-login');
    const bReg = document.getElementById('fi-register');
    const form = document.getElementById('fi-form');
    if (form){
      form.addEventListener('submit', (ev)=>{
        ev.preventDefault();
        const e = document.getElementById('fi-email').value;
        const p = document.getElementById('fi-pass').value;
        const action = (form.dataset.action || 'login').toLowerCase();
        if (action === 'register'){
          try{ document.getElementById('fi-pass').setAttribute('autocomplete','new-password'); }catch(x){}
          register(e,p).finally(()=>{
            form.dataset.action = 'login';
            try{ document.getElementById('fi-pass').setAttribute('autocomplete','current-password'); }catch(x){}
          });
        } else {
          try{ document.getElementById('fi-pass').setAttribute('autocomplete','current-password'); }catch(x){}
          login(e,p);
        }
      });
    }
    if (bLogin) bLogin.onclick = ()=>{
      if (form) form.dataset.action = 'login';
      try{ document.getElementById('fi-pass').setAttribute('autocomplete','current-password'); }catch(x){}
      if (form && typeof form.requestSubmit === 'function'){ form.requestSubmit(); return; }
      const e = document.getElementById('fi-email').value;
      const p = document.getElementById('fi-pass').value;
      login(e,p);
    };
    if (bReg) bReg.onclick = ()=>{
      if (form) form.dataset.action = 'register';
      try{ document.getElementById('fi-pass').setAttribute('autocomplete','new-password'); }catch(x){}
      if (form && typeof form.requestSubmit === 'function'){ form.requestSubmit(); return; }
      const e = document.getElementById('fi-email').value;
      const p = document.getElementById('fi-pass').value;
      register(e,p);
    };
  }

  function openLogin(){
    if (!loginDlg) loginDlg = createLoginDialog();
    loginDlg.style.display = 'block';
    signInOpen = true;
    wireDialogButtons();
  }

  function closeLogin(){
    if (loginDlg) loginDlg.style.display = 'none';
    signInOpen = false;
  }

  // Auth actions
  async function register(email, pass){
    const errEl = document.getElementById('fi-error');
    if (errEl) { errEl.style.color = 'var(--muted)'; errEl.textContent = ''; }
    // Read optional display name from the form
    let displayName = null;
    try{ const nEl = document.getElementById('fi-name'); if (nEl) displayName = String(nEl.value || '').trim(); }catch(e){}

    if (!email || !pass) {
      if (errEl) { errEl.style.color = 'crimson'; errEl.textContent = 'Email and password are required.'; } else alert('Email and password are required.');
      return;
    }
    if (pass.length < 6) {
      if (errEl) { errEl.style.color = 'crimson'; errEl.textContent = 'Password must be at least 6 characters.'; } else alert('Password must be at least 6 characters.');
      return;
    }
    try{
      const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
      console.log('Registered', userCredential);
      // set displayName on the Firebase Auth profile when provided
      try{
        if (displayName && userCredential && userCredential.user && typeof userCredential.user.updateProfile === 'function'){
          await userCredential.user.updateProfile({ displayName: displayName });
        }
      }catch(e){ console.warn('Failed to update auth profile', e); }
      // Optionally create a lightweight user record in Firestore for admin listing
      try{
        if (db && userCredential.user && userCredential.user.uid){
          await db.collection('users').doc(userCredential.user.uid).set({ email: email, name: displayName || null, uid: userCredential.user.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
        }
      }catch(e){ console.warn('Failed to write user doc', e); }
      if (errEl) { errEl.style.color = 'green'; errEl.textContent = 'Registration successful.'; setTimeout(closeLogin, 900); } else closeLogin();
    }catch(err){
      console.error(err);
      const msg = err && err.message ? err.message : 'Registration failed';
      if (errEl) { errEl.style.color = 'crimson'; errEl.textContent = msg; } else alert(msg);
    }
  }

  async function login(email, pass){
    const errEl = document.getElementById('fi-error');
    if (!email || !pass) {
      if (errEl) { errEl.style.color = 'crimson'; errEl.textContent = 'Email and password are required.'; } else alert('Email and password are required.');
      return;
    }
    try{
      const user = await auth.signInWithEmailAndPassword(email, pass);
      console.log('Signed in', user);
      if (errEl) { errEl.style.color = 'green'; errEl.textContent = 'Signed in!'; }
      setTimeout(closeLogin, 600);
    }catch(err){
      console.error(err);
      const msg = err && err.message ? err.message : 'Sign in failed';
      if (errEl) { errEl.style.color = 'crimson'; errEl.textContent = msg; } else alert(msg);
    }
  }

  function signout(){
    auth.signOut().then(()=>console.log('Signed out'));
  }

  // Firestore examples
  async function addSampleDoc(){
    try{
      const ref = await db.collection('samples').add({
        message: 'Hello from site',
        ts: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('Added sample doc', ref.id);
    }catch(err){console.error(err)}
  }

  async function readSampleDocs(){
    try{
      const snap = await db.collection('samples').orderBy('ts','desc').limit(10).get();
      const docs = snap.docs.map(d=>({id:d.id,...d.data()}));
      console.log('Sample docs', docs);
      return docs;
    }catch(err){console.error(err)}
  }

  // Wire UI
  if (btnSignIn){
    btnSignIn.addEventListener('click', ()=>{
      if (!signInOpen) openLogin(); else closeLogin();
    });
  }

  // listen for auth state changes
  auth.onAuthStateChanged(user=>{
    const container = document.getElementById('auth-ui');
    if (!container) return;
    container.innerHTML = '';
    if (user){
      const name = document.createElement('span');
      name.style.color = 'var(--accent)';
      name.style.marginRight = '10px';
      name.textContent = (user.displayName || user.email) || 'User';
      const out = document.createElement('button');
      out.className = 'btn btn--sm btn--outline';
      out.textContent = 'Sign Out';
      out.onclick = signout;
      container.appendChild(name);
      container.appendChild(out);
    } else {
      const btn = document.createElement('button');
      btn.id = 'btn-signin-2';
      btn.className = 'btn btn--sm btn--outline';
      btn.textContent = 'Sign In';
      btn.onclick = ()=>{ if (!signInOpen) openLogin(); else closeLogin(); };
      container.appendChild(btn);
    }
  });

  // expose helpers globally
  window.TeaApp = {
    addSampleDoc, readSampleDocs, authState: auth, db,
    openLogin: openLogin,
    closeLogin: closeLogin
  };

})();
