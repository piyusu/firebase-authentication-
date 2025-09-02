const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Replace 'YOUR_FIREBASE_UID' with your actual UID
const uid = 'dV5awKaLoDTZIIs3ZbyWmBMPOEJ3';

async function setAdminRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log('✅ Successfully set admin role for UID:', uid);
    
    // Verify the change
    const user = await admin.auth().getUser(uid);
    console.log('📋 User custom claims:', user.customClaims);
    
    console.log('\n🎉 Admin role assigned successfully!');
    console.log('📱 Now sign out and back in to your app to see the changes.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Make sure you have the correct UID.');
      console.log('🔍 To find your UID:');
      console.log('   1. Sign in to your app');
      console.log('   2. Open browser console (F12)');
      console.log('   3. Type: console.log(firebase.auth().currentUser?.uid)');
    }
    
    process.exit(1);
  }
}

setAdminRole();
