// Firebase Setup Verification
// Run this in browser console to test Firebase connection

import { auth } from './src/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

console.log('Firebase Auth instance:', auth);
console.log('Firebase Config:', auth.app.options);

// Test Firebase connection
async function testFirebaseConnection() {
  try {
    // Try to create a test user (this will fail but show us the real error)
    await createUserWithEmailAndPassword(auth, 'test@example.com', 'password123');
  } catch (error) {
    console.log('Firebase Error Details:', error);
    console.log('Error Code:', error.code);
    console.log('Error Message:', error.message);
    
    if (error.code === 'auth/project-not-found') {
      console.log('❌ Firebase project does not exist');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('❌ Email/Password authentication is not enabled in Firebase Console');
    } else if (error.code === 'auth/invalid-api-key') {
      console.log('❌ Invalid API key in Firebase config');
    } else {
      console.log('✅ Firebase is connected, but got expected error:', error.code);
    }
  }
}

// Run the test
testFirebaseConnection();