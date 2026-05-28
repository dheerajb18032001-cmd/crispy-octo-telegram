// scripts/certificates.js
// Certificate upload and verification system
(function(){
  if (!window.firebase) return console.warn('Firebase SDK not loaded');

  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  // ===== CLIENT SIDE: UPLOAD =====
  window.certificateManager = {
    // Initialize upload section
    initUpload: async function() {
      const uploadForm = document.getElementById('cert-upload-form');
      const fileInput = document.getElementById('cert-file-input');
      const uploadBtn = document.getElementById('cert-upload-btn');
      const uploadWrap = document.querySelector('.cert-upload-wrap');

      if (!uploadForm) return;

      // File input change handler
      fileInput.addEventListener('change', async (e) => {
        if (e.target.files[0]) {
          document.getElementById('cert-file-name').textContent = '✓ ' + e.target.files[0].name;
        }
      });

      // Form submit
      uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleUpload(fileInput, uploadBtn);
      });

      // Drag and drop
      if (uploadWrap) {
        uploadWrap.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          uploadWrap.style.borderColor = 'var(--accent)';
          uploadWrap.style.background = 'rgba(43,138,74,0.12)';
        });

        uploadWrap.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          uploadWrap.style.borderColor = 'rgba(43,138,74,0.3)';
          uploadWrap.style.background = 'rgba(43,138,74,0.04)';
        });

        uploadWrap.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          uploadWrap.style.borderColor = 'rgba(43,138,74,0.3)';
          uploadWrap.style.background = 'rgba(43,138,74,0.04)';
          
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            fileInput.files = files;
            document.getElementById('cert-file-name').textContent = '✓ ' + files[0].name;
          }
        });
      }
    },

    // Handle file upload
    handleUpload: async function(fileInput, uploadBtn) {
      const file = fileInput.files[0];
      if (!file) {
        alert('Please select a file');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, JPG, or PNG file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to upload a certificate');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';

      try {
        // Upload file to Storage
        const timestamp = Date.now();
        const fileName = `${user.uid}_${timestamp}_${file.name}`;
        const fileRef = storage.ref(`certificates/${fileName}`);
        const uploadTask = await fileRef.put(file);
        const downloadUrl = await uploadTask.ref.getDownloadURL();

        // Create Firestore document
        const certDoc = {
          userId: user.uid,
          userName: user.displayName || 'Unknown',
          userEmail: user.email,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          downloadUrl: downloadUrl,
          status: 'pending', // pending, verified, rejected
          uploadedAt: new Date(),
          verifiedAt: null,
          verificationNotes: '',
          verifiedBy: null
        };

        const docRef = await db.collection('certificates').add(certDoc);

        // Clear form
        fileInput.value = '';
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Certificate';

        // Show success message
        const successMsg = document.getElementById('cert-upload-success');
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = '✅ Certificate uploaded successfully! Awaiting admin verification.';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 4000);
        }

        // Refresh list
        this.loadUserCertificates();
      } catch (error) {
        console.error('Upload error:', error);
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Certificate';
        alert('Upload failed: ' + error.message);
      }
    },

    // Load user's certificates
    loadUserCertificates: async function() {
      const user = auth.currentUser;
      if (!user) {
        const listContainer = document.getElementById('cert-list-container');
        if (listContainer) {
          listContainer.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px">Please sign in to view your certificates</p>';
        }
        return;
      }

      try {
        const snapshot = await db.collection('certificates')
          .where('userId', '==', user.uid)
          .orderBy('uploadedAt', 'desc')
          .get();

        const listContainer = document.getElementById('cert-list-container');
        if (!listContainer) return;

        if (snapshot.empty) {
          listContainer.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px">No certificates uploaded yet</p>';
          return;
        }

        let html = '<div style="display:grid;gap:12px">';
        snapshot.forEach(doc => {
          const cert = doc.data();
          const statusClass = cert.status === 'verified' ? 'verified' : (cert.status === 'rejected' ? 'rejected' : 'pending');
          const statusIcon = cert.status === 'verified' ? '✅' : (cert.status === 'rejected' ? '❌' : '⏳');

          html += `
            <div class="cert-item cert-status-${statusClass}">
              <div class="cert-header">
                <div>
                  <div class="cert-filename">${cert.fileName}</div>
                  <small>${new Date(cert.uploadedAt.toDate()).toLocaleDateString()}</small>
                </div>
                <span class="cert-status-badge">${statusIcon} ${cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}</span>
              </div>
              ${cert.verificationNotes ? `<div class="cert-notes"><strong>Notes:</strong> ${cert.verificationNotes}</div>` : ''}
              <div style="margin-top:8px">
                <a href="${cert.downloadUrl}" target="_blank" class="cert-link">📥 Download</a>
              </div>
            </div>
          `;
        });
        html += '</div>';

        listContainer.innerHTML = html;
      } catch (error) {
        console.error('Load certificates error:', error);
      }
    },

    // Watch auth state
    watchAuthState: function() {
      auth.onAuthStateChanged(user => {
        const certSection = document.getElementById('cert-section');
        if (certSection) {
          if (user) {
            certSection.style.display = 'block';
            this.loadUserCertificates();
          } else {
            certSection.style.display = 'none';
          }
        }
      });
    }
  };

  // ===== ADMIN SIDE: VERIFICATION =====
  window.certificateAdmin = {
    // Initialize admin panel
    initAdmin: async function() {
      await this.loadAllCertificates();
    },

    // Load all pending/uploaded certificates
    loadAllCertificates: async function() {
      try {
        const snapshot = await db.collection('certificates')
          .orderBy('uploadedAt', 'desc')
          .get();

        const adminContainer = document.getElementById('cert-admin-container');
        if (!adminContainer) return;

        // Update count
        const countEl = document.getElementById('certs-count');
        if (countEl) countEl.textContent = snapshot.size;

        if (snapshot.empty) {
          adminContainer.innerHTML = '<p style="color:var(--muted);text-align:center;padding:20px">No certificates found</p>';
          return;
        }

        let html = `
          <div class="cert-admin-grid">
            <div class="cert-admin-header">
              <div>Certificate</div>
              <div>User</div>
              <div>Uploaded</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
        `;

        snapshot.forEach(doc => {
          const cert = doc.data();
          const docId = doc.id;
          const statusClass = cert.status === 'verified' ? 'verified' : (cert.status === 'rejected' ? 'rejected' : 'pending');

          html += `
            <div class="cert-admin-row cert-status-${statusClass}">
              <div class="cert-admin-cell">
                <strong>${cert.fileName}</strong>
                <a href="${cert.downloadUrl}" target="_blank" style="display:block;margin-top:4px;color:var(--accent);font-size:0.85rem;text-decoration:none">View Document</a>
              </div>
              <div class="cert-admin-cell">
                <div>${cert.userName}</div>
                <small>${cert.userEmail}</small>
              </div>
              <div class="cert-admin-cell">
                <small>${new Date(cert.uploadedAt.toDate()).toLocaleDateString()}</small>
              </div>
              <div class="cert-admin-cell">
                <span class="cert-status-badge cert-admin-badge">${cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}</span>
              </div>
              <div class="cert-admin-cell">
                <div style="display:flex;gap:6px;flex-wrap:wrap">
                  <button class="cert-verify-btn" data-docid="${docId}" onclick="window.certificateAdmin.verify('${docId}')">✅ Verify</button>
                  <button class="cert-reject-btn" data-docid="${docId}" onclick="window.certificateAdmin.reject('${docId}')">❌ Reject</button>
                  ${cert.status !== 'pending' ? `<button class="cert-reset-btn" data-docid="${docId}" onclick="window.certificateAdmin.resetStatus('${docId}')">↻ Reset</button>` : ''}
                </div>
              </div>
            </div>
          `;
        });

        html += '</div>';
        adminContainer.innerHTML = html;
      } catch (error) {
        console.error('Load admin certificates error:', error);
      }
    },

    // Verify certificate
    verify: async function(docId) {
      const notes = prompt('Verification Notes (optional):', '');
      if (notes === null) return; // User cancelled

      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in as admin');
        return;
      }

      try {
        await db.collection('certificates').doc(docId).update({
          status: 'verified',
          verifiedAt: new Date(),
          verificationNotes: notes,
          verifiedBy: user.uid
        });
        this.loadAllCertificates();
      } catch (error) {
        console.error('Verify error:', error);
        alert('Failed to verify: ' + error.message);
      }
    },

    // Reject certificate
    reject: async function(docId) {
      const notes = prompt('Rejection Reason:', '');
      if (notes === null) return; // User cancelled

      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in as admin');
        return;
      }

      try {
        await db.collection('certificates').doc(docId).update({
          status: 'rejected',
          verifiedAt: new Date(),
          verificationNotes: notes,
          verifiedBy: user.uid
        });
        this.loadAllCertificates();
      } catch (error) {
        console.error('Reject error:', error);
        alert('Failed to reject: ' + error.message);
      }
    },

    // Reset status back to pending
    resetStatus: async function(docId) {
      if (!confirm('Reset certificate to pending status?')) return;

      try {
        await db.collection('certificates').doc(docId).update({
          status: 'pending',
          verifiedAt: null,
          verificationNotes: '',
          verifiedBy: null
        });
        this.loadAllCertificates();
      } catch (error) {
        console.error('Reset error:', error);
        alert('Failed to reset: ' + error.message);
      }
    }
  };

  // Auto-initialize on load
  document.addEventListener('DOMContentLoaded', function(){
    // Client side
    if (document.getElementById('cert-upload-form')) {
      window.certificateManager.initUpload();
      window.certificateManager.watchAuthState();
    }

    // Admin side
    if (document.getElementById('cert-admin-container')) {
      window.certificateAdmin.initAdmin();
    }
  });

})();
