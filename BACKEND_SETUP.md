# Backend & Database Setup for Certificates

## 🎯 Overview

This guide walks you through setting up the complete backend and database infrastructure for the certificate upload and verification system.

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v14+ installed
- [Firebase Project](https://firebase.google.com/) created
- Firebase CLI installed: `npm install -g firebase-tools`
- Service account key from Firebase Console

---

## 🚀 Step 1: Update Firestore Rules

Your Firestore rules have been automatically updated to support certificates. They're located in `firestore.rules`.

### Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

**What the rules do:**
- ✅ Users can upload their own certificates
- ✅ Users can only read their own certificates
- ✅ Admins can read all certificates
- ✅ Admins can verify/reject certificates with notes
- 🔒 Prevents unauthorized access

---

## 💾 Step 2: Update Storage Rules

Firebase Storage rules control who can upload files. Rules are in `storage.rules`.

### Deploy the storage rules:

```bash
firebase deploy --only storage
```

**What the storage rules do:**
- ✅ Only authenticated users can upload
- ✅ Only PDF, JPG, PNG files allowed
- ✅ Maximum 5MB file size enforced
- ✅ Admins can delete files
- 🔒 All other paths blocked by default

---

## 🔑 Step 3: Set Up Admin Users

### Option A: Using the Admin Setup Script (Recommended)

#### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Settings) → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Save as `serviceAccountKey.json` in your project root

#### 2. Install firebase-admin

```bash
npm install firebase-admin
```

#### 3. Run the setup script

```bash
# Set a user as admin (by email)
node scripts/setup-firebase-admin.js set-admin admin@teashop.com

# Verify admin status
node scripts/setup-firebase-admin.js verify <user-uid>

# Remove admin privileges
node scripts/setup-firebase-admin.js remove-admin <user-uid>
```

### Option B: Manual Setup via Firebase Console

1. Go to Firebase Console → Authentication
2. Select the user you want to make admin
3. Click the "Custom claims" option
4. Add: `{ "admin": true }`
5. Save

---

## 🌐 Step 4: Deploy Backend Server

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` file in project root:

```env
PORT=3000
NODE_ENV=production

# Database (Optional - for contact storage)
DATABASE_URL=postgresql://user:password@localhost:5432/teashop
# OR MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=teashop

# Firebase Admin SDK (for server-side operations)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### 3. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on http://localhost:3000

### 4. Verify Server is Running

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "server": "running",
  "time": "2026-05-27T...",
  "dbConnected": true,
  "dbType": "pg"
}
```

---

## 🗄️ Step 5: Create Firestore Collections

Firestore collections are created automatically when you first write data. However, you can pre-create them for organization:

### Certificates Collection

1. Go to Firebase Console → Firestore Database
2. Click "Create Collection"
3. Name: `certificates`
4. Add a test document with these fields:

```javascript
{
  userId: "test-uid",
  userName: "Test User",
  userEmail: "test@example.com",
  fileName: "diploma.pdf",
  fileType: "application/pdf",
  fileSize: 1024000,
  downloadUrl: "https://...",
  status: "pending",
  uploadedAt: timestamp,
  verifiedAt: null,
  verificationNotes: "",
  verifiedBy: null
}
```

---

## 📊 Database Schema

### Firestore Collections Used:

#### `certificates` Collection
```javascript
{
  // Document ID: auto-generated
  userId: string           // Firebase UID of uploader
  userName: string         // Display name
  userEmail: string        // Email address
  fileName: string         // Original filename
  fileType: string         // MIME type (pdf, jpeg, png)
  fileSize: number         // Bytes
  downloadUrl: string      // Firebase Storage URL
  status: "pending" | "verified" | "rejected"
  uploadedAt: timestamp    // Creation time
  verifiedAt: timestamp    // Verification time (null if pending)
  verificationNotes: string // Admin notes
  verifiedBy: string       // Admin UID (null if pending)
}
```

#### `contacts` Collection (Existing)
Used for contact form submissions.

#### `orders` Collection (Existing)
Used for order data.

#### `users` Collection (Existing)
User profile information.

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { status: 'ok', server: 'running', dbConnected: true }
```

### Validate Certificate
```
POST /api/validate-certificate
Body: { fileName: string, fileType: string, fileSize: number }
Response: { valid: true, message: '...' }
```

### Contact Form (Existing)
```
POST /api/contact
GET /api/contacts
```

---

## 🔒 Security Checklist

- ✅ Firestore rules deployed
- ✅ Storage rules deployed  
- ✅ Admin users set up with custom claims
- ✅ Service account key stored securely
- ✅ `.env` file added to `.gitignore`
- ✅ CORS configured for trusted origins
- ✅ File size limits enforced (5MB max)
- ✅ File type validation enabled
- ✅ User authentication required for uploads

---

## 🚨 Troubleshooting

### "Missing or insufficient permissions" Error
**Problem:** Rules not deployed or permissions insufficient.
**Solution:**
```bash
firebase deploy --only firestore:rules,storage
firebase login  # Re-authenticate if needed
```

### Admin script not working
**Problem:** Service account key not found.
**Solution:**
1. Download service account key from Firebase Console
2. Save as `serviceAccountKey.json`
3. Run: `node scripts/setup-firebase-admin.js help`

### Certificate upload fails
**Problem:** Storage rules not deployed.
**Solution:**
```bash
firebase deploy --only storage
```

### Firestore listener fails
**Problem:** User doesn't have read permissions.
**Solution:** Check Firestore rules and user authentication status.

---

## 📦 Deployment Options

### Option 1: Firebase Hosting + Cloud Functions
```bash
firebase deploy
```

### Option 2: Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set PORT=3000 NODE_ENV=production
heroku open
```

### Option 3: Render / Railway / Fly.io
Follow their Node.js deployment guides with `.env` configuration.

### Option 4: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Monitoring

### Firebase Console Metrics
- Firestore: Database → Database Metrics
- Storage: Storage → Files
- Authentication: Authentication → Sign-in method

### Server Logs
```bash
# Local development
npm run dev  # Shows logs in console

# Production (cloud)
# Check platform-specific logs (Heroku, Render, etc.)
```

---

## 🔄 Maintenance

### Regular Tasks

**Weekly:**
- Review pending certificates
- Check for failed uploads
- Monitor storage usage

**Monthly:**
- Review admin users list
- Check error logs
- Backup Firestore data

### Backup Firestore

```bash
firebase firestore:export gs://your-bucket/backup
```

---

## 📚 Additional Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

---

## ✅ Deployment Checklist

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Admin users created
- [ ] Service account key configured
- [ ] Environment variables set
- [ ] Backend server running
- [ ] API endpoints tested
- [ ] Security rules verified
- [ ] Error logging configured
- [ ] Backups scheduled

---

**Last Updated:** 2026-05-27  
**Version:** 1.0
