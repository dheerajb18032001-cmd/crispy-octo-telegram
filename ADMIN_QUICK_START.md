# 🔐 ADMIN PANEL - QUICK START

## ✅ READY TO USE

Your admin panel is **ready to access**. Here's how:

---

## 📝 Step 1: Create Your Admin Account

### Option A: Create Account In The App (EASIEST - No coding needed)

1. **Open Client Dashboard**
   ```
   file:///c:/teanew/client-dashboard.html
   ```

2. **Click "Sign In" button** (top right)

3. **Click "Register" tab**

4. **Fill in:**
   - Display Name: `Admin` (or your name)
   - Email: `admin@teashop.com` (or your email)
   - Password: `Admin@123!` (must be strong)

5. **Click "Register"** ✅

---

## 🎯 Step 2: Access Your Admin Panel

### Now that you're registered:

1. **Open Admin Panel**
   ```
   file:///c:/teanew/admin-contacts.html
   ```

2. **Click "Sign In"** button

3. **Login with:**
   - Email: `admin@teashop.com`
   - Password: `Admin@123!`

4. ✅ **You can now see all tabs including "📋 Certificates"**

---

## 📋 What You Can Do Now

✅ View all certificates from the "📋 Certificates" tab
✅ See pending/verified/rejected certificates
✅ View user information
✅ Download certificate files
✅ View contact form submissions
✅ View orders

---

## 🔐 To Enable Full Admin Powers (Verification)

To **verify/reject certificates**, you need to grant yourself the admin role:

### **Option A: Using Admin Script (Recommended)**

After you have your email registered, run:

```bash
node scripts/setup-firebase-admin.js set-admin admin@teashop.com
```

Replace `admin@teashop.com` with YOUR email from Step 1.

**Then reload the admin panel page** - now you'll have ✅ Verify and ❌ Reject buttons!

### **Option B: Manual Setup (Via Firebase Console)**

1. Go to: https://console.firebase.google.com/project/teashop-71af9/authentication/users

2. Find your user (by email)

3. Click your user → Custom Claims

4. Add:
   ```json
   { "admin": true }
   ```

5. Reload admin panel ✅

---

## 🧪 Test Account (Ready to Use)

If you want a quick test without configuring anything:

**Email:** `admin@teashop.test`  
**Password:** `Admin@123456`

Just register with these in the dashboard first!

---

## 🚀 QUICK START CHECKLIST

- [ ] Open `file:///c:/teanew/client-dashboard.html`
- [ ] Click "Sign In" → "Register"
- [ ] Create account with email & password
- [ ] Open `file:///c:/teanew/admin-contacts.html`
- [ ] Login with same email & password
- [ ] **You're now in the admin panel!** ✅

---

## 💡 KEY POINTS

| What | How | Where |
|------|-----|-------|
| **Sign Up** | Via dashboard Sign In button | client-dashboard.html |
| **Access Admin** | Login with your email/password | admin-contacts.html |
| **Enable Verification** | Run admin setup script OR Firebase Console | command line or Firebase |
| **Upload Cert** | Go to "📋 Your Certificates" section | Dashboard |
| **Verify Cert** | Go to "📋 Certificates" tab | Admin Panel |

---

## 🔑 No Hardcoded Password!

```
❌ There is NO fixed "admin password"
✅ YOU choose your password when signing up
✅ Firebase handles security
✅ Admin role is set via custom claims
```

---

## 📞 Quick Commands

```bash
# AFTER registering in the app, grant yourself admin:
node scripts/setup-firebase-admin.js set-admin your-email@example.com

# Check if you're admin:
node scripts/setup-firebase-admin.js verify <your-user-uid>

# Remove admin (if needed):
node scripts/setup-firebase-admin.js remove-admin <your-user-uid>
```

---

## 🐛 If Admin Script Says "Error"

You likely need the Firebase service account key:

1. Go to Firebase Console:
   https://console.firebase.google.com/project/teashop-71af9/settings/serviceaccounts

2. Click "Generate New Private Key"

3. Save as `serviceAccountKey.json` in `c:\teanew\`

4. Try the admin script again

---

## ✨ After Full Setup

Once you complete the admin setup script:

✅ Sign into admin panel
✅ Go to "📋 Certificates" tab
✅ You'll see **Verify** and **Reject** buttons
✅ Upload test certificate from dashboard
✅ Verify it from admin panel
✅ **System complete!**

---

## 🎉 You're All Set!

Your admin panel is **live and ready**.

**Next Action:** Register your account and login to see it! 🚀

---

**Dashboard:** file:///c:/teanew/client-dashboard.html  
**Admin Panel:** file:///c:/teanew/admin-contacts.html  
**Backend Server:** http://localhost:3000 (running)

Created: 2026-05-27
