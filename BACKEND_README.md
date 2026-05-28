# Tea Shop Backend & Certificate System

## 🎯 Quick Start

### For Windows Users
```bash
# Run the deployment helper
deploy.bat
```

### For Mac/Linux Users
```bash
# Run the deployment helper
bash deploy.sh
```

### Manual Deployment
```bash
# 1. Install dependencies
npm install

# 2. Deploy Firestore & Storage rules
firebase deploy --only firestore:rules,storage

# 3. Set up admin users
node scripts/setup-firebase-admin.js set-admin your-email@example.com

# 4. Start the server
npm start
```

---

## 📁 Files Overview

### Configuration Files
- **`firestore.rules`** - Firestore security rules for certificates
- **`storage.rules`** - Firebase Storage rules for file uploads
- **`.env`** - Environment variables (create this)
- **`.env.example`** - Template for .env file

### Scripts
- **`scripts/setup-firebase-admin.js`** - Admin setup script
- **`deploy.sh`** - Deployment script (Mac/Linux)
- **`deploy.bat`** - Deployment script (Windows)
- **`server/index.js`** - Express backend server

### Documentation
- **`BACKEND_SETUP.md`** - Complete backend setup guide
- **`CERTIFICATE_SYSTEM_GUIDE.md`** - Certificate system usage
- **`README.md`** (this file)

---

## 🚀 Deployment in 5 Steps

### Step 1: Download Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Settings (⚙️) → Service Accounts
3. Click "Generate New Private Key"
4. Save as `serviceAccountKey.json`

### Step 2: Deploy Firebase Rules
```bash
firebase deploy --only firestore:rules,storage
```

### Step 3: Create Admin Users
```bash
node scripts/setup-firebase-admin.js set-admin admin@teashop.com
```

### Step 4: Set Up Environment Variables
Create `.env` file:
```env
PORT=3000
NODE_ENV=production
```

### Step 5: Deploy Backend
```bash
npm install
npm start
```

---

## 🛠️ What's Included

✅ **Firestore Rules** - Secure certificate management
✅ **Storage Rules** - File upload validation
✅ **Admin Script** - Easy user management
✅ **Express Server** - API endpoints
✅ **Validation** - File type & size checks
✅ **CORS** - Cross-origin support

---

## 📊 Database Collections

### `certificates`
- Certificate upload data
- Status tracking (pending/verified/rejected)
- Admin verification notes

### `contacts`
- Contact form submissions
- Existing collection

### `orders`
- Order data
- Existing collection

### `users`
- User profiles
- Existing collection

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/validate-certificate` | Validate certificate file |

---

## 🔐 Security Features

✅ File type validation (PDF, JPG, PNG only)
✅ File size limit (5MB max)
✅ User authentication required
✅ Admin-only verification access
✅ Role-based access control
✅ CORS protection
✅ Firestore security rules
✅ Storage rules enforcement

---

## 🐛 Troubleshooting

### Firebase Rules Error
```bash
# Re-authenticate and deploy
firebase login
firebase deploy --only firestore:rules,storage
```

### Admin Setup Fails
- Ensure `serviceAccountKey.json` exists
- Check Firebase project is selected: `firebase use <project-id>`

### Backend Won't Start
```bash
# Check Node version
node --version  # Should be v14+

# Install dependencies
npm install

# Check port 3000 is available
```

### Storage Upload Fails
- Verify storage rules are deployed
- Check file size (max 5MB)
- Check file type (PDF, JPG, PNG)

---

## 📈 Monitoring

### Check Firebase Status
```bash
firebase projects:list
```

### View Server Logs
```bash
# Development
npm run dev

# Production (cloud platform specific)
```

### Test API
```bash
curl http://localhost:3000/api/health
```

---

## 📚 Documentation

For detailed information, see:
- **`BACKEND_SETUP.md`** - Complete setup guide with all options
- **`CERTIFICATE_SYSTEM_GUIDE.md`** - How to use the certificate system
- **`firestore.rules`** - Security rules with comments
- **`storage.rules`** - Storage rules with comments

---

## 🚢 Deploy to Production

### Heroku
```bash
heroku create your-app
git push heroku main
heroku config:set NODE_ENV=production PORT=3000
```

### Firebase Hosting
```bash
firebase deploy --only hosting
```

### Docker
```bash
docker build -t teashop-server .
docker run -p 3000:3000 -e NODE_ENV=production teashop-server
```

### Other Platforms
See `BACKEND_SETUP.md` for Render, Railway, Fly.io guides

---

## ✅ Deployment Checklist

- [ ] Service account key saved
- [ ] Firebase rules deployed
- [ ] Storage rules deployed
- [ ] Admin users created
- [ ] `.env` configured
- [ ] Dependencies installed
- [ ] Server tested locally
- [ ] API endpoints working
- [ ] Ready for production

---

## 🎯 Next Steps

1. **Run Deployment**: `deploy.bat` or `bash deploy.sh`
2. **Configure Admin**: `node scripts/setup-firebase-admin.js set-admin your-email@example.com`
3. **Start Server**: `npm start`
4. **Test System**: Upload a certificate from dashboard
5. **Verify**: Check admin panel for uploaded certificate

---

## 💬 Support

For issues, check:
1. `BACKEND_SETUP.md` troubleshooting section
2. Firebase Console for errors
3. Server logs for detailed information
4. Browser console for client-side issues

---

**Version:** 1.0  
**Last Updated:** 2026-05-27  
**Status:** ✅ Production Ready
