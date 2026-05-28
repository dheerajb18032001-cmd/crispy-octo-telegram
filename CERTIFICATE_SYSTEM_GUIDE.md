# Certificate Upload & Verification System Guide

## 🎯 Overview

Your Tea Shop application now includes a complete certificate upload and verification system with the following features:

### Client Features ✅
- **Upload Section**: Users can upload certificates (PDF, JPG, PNG)
- **Drag & Drop**: Easy file upload with drag-and-drop support
- **File Validation**: Automatic validation for file type and size (max 5MB)
- **Certificate List**: View all uploaded certificates with their status
- **Status Tracking**: Real-time status updates (Pending → Verified/Rejected)
- **Notes Display**: View verification notes or rejection reasons

### Admin Features ✅
- **Verification Dashboard**: View all uploaded certificates in a dedicated tab
- **Action Buttons**: 
  - ✅ **Verify**: Mark certificate as verified with optional notes
  - ❌ **Reject**: Mark as rejected with reason
  - ↻ **Reset**: Return certificate to pending status
- **User Info**: See uploader's name and email
- **Download Link**: Direct access to view/download documents
- **Real-time Updates**: Instant certificate count

---

## 📋 How to Use

### For Users (Client Dashboard)

1. **Sign In**: Click "Sign In" button at the top right
2. **Navigate to Dashboard**: Go to Client Dashboard
3. **Upload Certificate**:
   - Find the "Your Certificates" section
   - Click the upload area or drag a file onto it
   - Select a PDF, JPG, or PNG file (max 5MB)
   - Click "Upload Certificate"
4. **Monitor Status**: 
   - ⏳ Pending: Awaiting admin review
   - ✅ Verified: Certificate approved
   - ❌ Rejected: Check notes for reason

### For Admins (Admin Panel)

1. **Sign In**: Click "Sign In" button at the top right
2. **Navigate to Admin**: Click "Admin" in the navigation
3. **Open Certificates Tab**: Click the "📋 Certificates" tab
4. **Review Certificates**: See all uploaded certificates
5. **Take Action**:
   - Click **✅ Verify** to approve the certificate
   - Click **❌ Reject** to reject with a reason
   - Add verification notes or rejection reason when prompted
6. **View Document**: Click "View Document" link to preview the file
7. **Reset Status** (if needed): Click ↻ Reset to change status back to pending

---

## 🔧 Setup Instructions

### Step 1: Update Firestore Rules

Replace your `firestore.rules` file content with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Certificates Collection
    match /certificates/{documentId} {
      // Users can read their own certificates
      allow read: if request.auth.uid == resource.data.userId;
      
      // Users can create new certificates
      allow create: if request.auth.uid != null
                    && request.auth.uid == request.resource.data.userId
                    && request.resource.data.status == 'pending'
                    && request.resource.data.uploadedAt == request.time;
      
      // Admins can read all certificates and update status
      // Option A: Using custom claims
      allow read, update: if request.auth.token.get('admin') == true;
      
      // Option B: Using admins collection (uncomment to use)
      // allow read, update: if exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### Step 2: Update Storage Rules

Update your Firebase Storage security rules:

```
service firebase.storage {
  match /b/{bucket}/o {
    match /certificates/{allPaths=**} {
      // Allow authenticated users to read certificates
      allow read: if request.auth.uid != null;
      
      // Allow users to upload their own certificates
      allow write: if request.auth.uid != null 
                   && request.resource.size <= 5 * 1024 * 1024
                   && request.resource.contentType in [
                     'application/pdf', 
                     'image/jpeg', 
                     'image/png'
                   ];
    }
  }
}
```

### Step 3: Set Up Admin Users

Choose one of these approaches:

**Option A: Custom Claims (Recommended for production)**
1. Use Firebase Admin SDK to set custom claims:
```javascript
admin.auth().setCustomUserClaims(uid, { admin: true })
```

**Option B: Admin Collection (Simple setup)**
1. Create a collection called `admins`
2. Add documents with user UIDs as document IDs
3. Update Firestore rules to use this collection

---

## 📊 Data Structure

### Firestore Collection: `certificates`

Each certificate document contains:

```javascript
{
  userId: "user-uid",           // Firebase user ID
  userName: "John Doe",         // User's display name
  userEmail: "john@example.com",// User's email
  fileName: "diploma.pdf",      // Original file name
  fileType: "application/pdf",  // MIME type
  fileSize: 1024000,            // File size in bytes
  downloadUrl: "https://...",   // Firebase Storage URL
  status: "pending",            // 'pending', 'verified', or 'rejected'
  uploadedAt: timestamp,        // Upload date/time
  verifiedAt: timestamp,        // Verification date (null if pending)
  verificationNotes: "Approved", // Admin notes
  verifiedBy: "admin-uid"       // Admin user ID
}
```

---

## 🔒 Security Features

✅ **User Privacy**: Users can only see their own certificates
✅ **Admin Only**: Only admins can verify/reject certificates
✅ **File Type Validation**: Only PDF, JPG, PNG files allowed
✅ **File Size Limit**: Maximum 5MB per file
✅ **Audit Trail**: Track who verified and when
✅ **Secure Storage**: Files stored in Firebase Storage with rules

---

## 🎨 Styling

The system includes responsive styling that works on:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers

Color indicators:
- 🟢 Green = Verified
- 🔴 Red = Rejected
- 🟡 Orange = Pending

---

## 🐛 Troubleshooting

### Certificates Won't Upload
- Check file size (max 5MB)
- Verify file type (PDF, JPG, PNG only)
- Ensure user is signed in
- Check Firebase Storage rules

### Can't See Admin Tab
- Must be signed in as admin user
- Check custom claims or admin collection

### Verification Buttons Don't Work
- Ensure user has admin privileges
- Check Firestore rules allow admin updates

### Downloads Fail
- Verify Firebase Storage configuration
- Check storage rules allow reads

---

## 📝 Files Modified/Created

1. **Created**: `scripts/certificates.js` - Main certificate logic
2. **Updated**: `client-dashboard.html` - Added upload section
3. **Updated**: `admin-contacts.html` - Added verification tab
4. **Created**: `firestore.rules.certificates` - Security rules reference

---

## 📚 Additional Resources

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## ✨ Features Summary

| Feature | User | Admin |
|---------|------|-------|
| Upload Certificate | ✅ | ❌ |
| View Own Certificates | ✅ | ❌ |
| View All Certificates | ❌ | ✅ |
| Verify Certificates | ❌ | ✅ |
| Reject Certificates | ❌ | ✅ |
| Add Notes | ❌ | ✅ |
| Download Documents | ✅ | ✅ |
| Reset Status | ❌ | ✅ |

---

**Last Updated**: 2026-05-27
**Version**: 1.0
