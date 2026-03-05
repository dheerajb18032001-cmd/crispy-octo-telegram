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
      <label style="display:block;margin-bottom:8px;color:var(--muted)">Email</label>
      <input id="fi-email" type="email" style="padding:8px;width:260px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);margin-bottom:8px;display:block">
      <label style="display:block;margin-bottom:8px;color:var(--muted)">Password</label>
      <input id="fi-pass" type="password" style="padding:8px;width:260px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);margin-bottom:12px;display:block">
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button id="fi-register" class="btn btn--sm btn--outline">Register</button>
        <button id="fi-login" class="btn btn--sm btn-primary">Sign In</button>
      </div>
    `;
    document.body.appendChild(dlg);
    return dlg;
  }

  let loginDlg = null;

  function openLogin(){
    if (!loginDlg) loginDlg = createLoginDialog();
    loginDlg.style.display = 'block';
    signInOpen = true;
  }

  function closeLogin(){
    if (loginDlg) loginDlg.style.display = 'none';
    signInOpen = false;
  }

  // Auth actions
  async function register(email, pass){
    try{
      const user = await auth.createUserWithEmailAndPassword(email, pass);
      console.log('Registered', user);
      closeLogin();
    }catch(err){console.error(err);alert(err.message)}
  }

  async function login(email, pass){
    try{
      const user = await auth.signInWithEmailAndPassword(email, pass);
      console.log('Signed in', user);
      closeLogin();
    }catch(err){console.error(err);alert(err.message)}
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
      // wire dialog buttons lazily
      setTimeout(()=>{
        const bLogin = document.getElementById('fi-login');
        const bReg = document.getElementById('fi-register');
        if (bLogin) bLogin.onclick = ()=>{
          const e = document.getElementById('fi-email').value;
          const p = document.getElementById('fi-pass').value;
          login(e,p);
        }
        if (bReg) bReg.onclick = ()=>{
          const e = document.getElementById('fi-email').value;
          const p = document.getElementById('fi-pass').value;
          register(e,p);
        }
      },100);
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
      name.textContent = user.email || 'User';
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

  // expose firestore helpers for console/testing
  window.TeaApp = {
    addSampleDoc, readSampleDocs, authState: auth, db
  };

})();
