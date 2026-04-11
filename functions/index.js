const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const express = require('express');

admin.initializeApp();
const db = admin.firestore();

// Create Express app for routing
const app = express();
app.use(cors);
app.use(express.json());

/**
 * POST /api/contact
 * Save a contact form submission to Firestore
 */
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  try {
    // Save to Firestore in 'contacts' collection
    const docRef = await db.collection('contacts').add({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new',
    });

    console.log('Contact saved:', docRef.id);
    res.json({ ok: true, id: docRef.id, stored: 'firestore' });
  } catch (err) {
    console.error('Failed to save contact:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

/**
 * GET /api/contacts
 * Retrieve all contact form submissions
 */
app.get('/contacts', async (req, res) => {
  try {
    // Query Firestore for all contacts, sorted by newest first
    const snapshot = await db
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const contacts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to ISO string for frontend
      createdAt: doc.data().createdAt?.toDate?.().toISOString?.() || new Date().toISOString(),
    }));

    console.log(`Retrieved ${contacts.length} contacts`);
    res.json(contacts);
  } catch (err) {
    console.error('Failed to retrieve contacts:', err);
    res.status(500).json({ error: 'Failed to retrieve contacts' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/health', async (req, res) => {
  try {
    // Test Firestore connection
    await db.collection('_health').limit(1).get();
    res.json({
      status: 'ok',
      server: 'Firebase Cloud Functions',
      time: new Date().toISOString(),
      dbConnected: true,
      dbType: 'firestore',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      server: 'Firebase Cloud Functions',
      error: err.message,
    });
  }
});

// Export the main API handler
exports.api = functions.https.onRequest(app);

/**
 * Optional: Scheduled cleanup - delete old submissions (30+ days old)
 * Runs daily at 2 AM UTC
 */
exports.cleanupOldContacts = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const snapshot = await db
        .collection('contacts')
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      console.log(`Cleaned up ${snapshot.docs.length} old contacts`);
    } catch (err) {
      console.error('Cleanup failed:', err);
    }
  });

