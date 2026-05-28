#!/usr/bin/env node
/**
 * Firebase Admin Setup Script
 * 
 * Usage:
 *   node scripts/setup-firebase-admin.js <action> [args...]
 * 
 * Actions:
 *   set-admin <email>  - Set a user as admin
 *   remove-admin <uid> - Remove admin privilege
 *   verify <uid>       - Check if user is admin
 */

require('dotenv').config();
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
let serviceAccount;
try {
  // Try to load from environment variable (for CI/CD)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Try to load from file (development)
    const keyPath = path.join(__dirname, '../serviceAccountKey.json');
    serviceAccount = require(keyPath);
  }
} catch (err) {
  console.error('❌ Error: Firebase service account key not found.');
  console.error('   Please provide one of:');
  console.error('   1. serviceAccountKey.json in project root');
  console.error('   2. FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('❌ Failed to initialize Firebase Admin:', err.message);
  process.exit(1);
}

const auth = admin.auth();

// Command handlers
const commands = {
  'set-admin': async (email) => {
    if (!email) {
      console.error('❌ Usage: set-admin <email>');
      process.exit(1);
    }
    
    try {
      console.log(`⏳ Setting admin privileges for ${email}...`);
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, { admin: true });
      console.log(`✅ Successfully set ${email} as admin (UID: ${user.uid})`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  },

  'remove-admin': async (uid) => {
    if (!uid) {
      console.error('❌ Usage: remove-admin <uid>');
      process.exit(1);
    }
    
    try {
      console.log(`⏳ Removing admin privileges from ${uid}...`);
      await auth.setCustomUserClaims(uid, { admin: false });
      console.log(`✅ Successfully removed admin privileges from ${uid}`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  },

  'verify': async (uid) => {
    if (!uid) {
      console.error('❌ Usage: verify <uid>');
      process.exit(1);
    }
    
    try {
      const user = await auth.getUser(uid);
      const isAdmin = user.customClaims && user.customClaims.admin === true;
      
      console.log('\n📋 User Details:');
      console.log(`   UID: ${user.uid}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Display Name: ${user.displayName || 'N/A'}`);
      console.log(`   Admin: ${isAdmin ? '✅ Yes' : '❌ No'}`);
      console.log(`   Created: ${user.metadata.creationTime}`);
      console.log('');
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  },

  'help': () => {
    console.log(`
🔐 Firebase Admin Setup Script

Usage: node scripts/setup-firebase-admin.js <action> [args]

Actions:
  set-admin <email>  - Grant admin privileges to a user
  remove-admin <uid> - Revoke admin privileges
  verify <uid>       - Check user details and admin status
  help              - Show this help message

Examples:
  node scripts/setup-firebase-admin.js set-admin admin@teashop.com
  node scripts/setup-firebase-admin.js verify 12345abcde
  node scripts/setup-firebase-admin.js remove-admin 12345abcde

Requirements:
  • serviceAccountKey.json in project root OR
  • FIREBASE_SERVICE_ACCOUNT_KEY environment variable

For more info, see BACKEND_SETUP.md
    `);
  }
};

// Parse arguments
const action = process.argv[2];
const args = process.argv.slice(3);

if (!action || action === 'help') {
  commands.help();
  process.exit(0);
}

if (!commands[action]) {
  console.error(`❌ Unknown action: ${action}`);
  console.error('   Run: node scripts/setup-firebase-admin.js help');
  process.exit(1);
}

// Execute command
commands[action](...args).then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
