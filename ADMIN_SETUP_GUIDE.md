# 🔐 Admin Panel Access Guide

## How to Access Admin Panel

Your admin panel uses **Firebase Authentication** - there's no fixed password. Instead, you create accounts and grant admin privileges.

---

## 📋 Quick Setup (3 Steps)

### **Step 1: Sign Up in the App**

1. Open Client Dashboard: `file:///c:/teanew/client-dashboard.html`
2. Click **"Sign In"** button (top right)
3. Click **"Register"** tab
4. Enter your credentials:

```
Display Name: Your Name (or "Admin")
Email:        admin@teashop.com (or your email)
Password:     YourPassword@123 (strong password required)
```

5. Click **"Register"**

✅ You're now registered!

---

### **Step 2: Install Firebase Admin SDK**

```bash
cd c:\teanew
npm install firebase-admin
```

This takes ~1 minute to install.

---

### **Step 3: Grant Yourself Admin Access**

After installing firebase-admin, run:

```bash
node scripts/setup-firebase-admin.js set-admin admin@teashop.com
```

Replace `admin@teashop.com` with the email you used in Step 1.

✅ You're now an admin!

---

## 🚀 Access Admin Panel

1. Go to Admin Panel: `file:///c:/teanew/admin-contacts.html`
2. Click **"Sign In"** button
3. Login with your credentials from Step 1
4. You should now see the "📋 Certificates" tab

---

## 🧪 Test Credentials (Example)

If you want to use these for testing:

```
Display Name: Admin User
Email:        admin@teashop.test
Password:     TestAdmin@123456
```

**Then run:**
```bash
node scripts/setup-firebase-admin.js set-admin admin@teashop.test
```

---

## ✅ Verify You're Admin

```bash
node scripts/setup-firebase-admin.js verify <your-firebase-uid>
```

This shows your admin status.

---

## 🔑 Key Points

❌ **No hardcoded password** - You create your own via Firebase
✅ **Email + Password login** - Standard authentication
✅ **Admin role** - Set via custom claims (our script does this)
✅ **Secure** - Firebase handles password security

---

## 🐛 Troubleshooting

### "Firebase Admin not installed"
```bash
npm install firebase-admin
```

### "serviceAccountKey.json not found"
1. Download from Firebase Console
2. Settings → Service Accounts → Generate Key
3. Save to `c:\teanew\serviceAccountKey.json`

### "User not found"
- Make sure you registered first (Step 1)
- Use the exact same email for admin setup (Step 3)

### Admin script fails
```bash
firebase login
firebase use teashop-71af9
node scripts/setup-firebase-admin.js set-admin your-email@example.com
```

---

## 📞 Quick Commands

```bash
# Set a user as admin
node scripts/setup-firebase-admin.js set-admin your-email@example.com

# Check if user is admin
node scripts/setup-firebase-admin.js verify <uid>

# Remove admin privileges
node scripts/setup-firebase-admin.js remove-admin <uid>

# See admin script help
node scripts/setup-firebase-admin.js help
```

---

## 🎯 Next Steps

1. ✅ Register account in app
2. ✅ Run admin setup script
3. ✅ Open admin panel
4. ✅ Upload and verify certificates!

---

**Remember:** The "password" is what YOU choose when signing up - there's no fixed admin password. You control access via the admin setup script.

**Generated:** 2026-05-27  
**For:** Tea Shop Certificate System
