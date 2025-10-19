// firebase-config.js
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdqm04nmlWzCIfnU1QFW1kDKhk9-ttFqM",
  authDomain: "stemlearn-fcda0.firebaseapp.com",
  projectId: "stemlearn-fcda0",
  storageBucket: "stemlearn-fcda0.firebasestorage.app",
  messagingSenderId: "837054140017",
  appId: "1:837054140017:web:d5ec35fc7b52fe92aa15d0",
  measurementId: "G-4C2NEV3QNL"
};

// Initialize Firebase when the page loads
function initializeFirebase() {
  try {
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded');
      return false;
    }
    
    // Check if Firebase is already initialized
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
    }
    
    // Initialize services
    const db = firebase.firestore();
    const auth = firebase.auth();
    const analytics = firebase.analytics();
    
    // Export for use in other files
    window.firebase = firebase;
    window.db = db;
    window.auth = auth;
    window.analytics = analytics;
    
    console.log('Firebase initialized successfully with real configuration');
    console.log('Project ID:', firebaseConfig.projectId);
    return true;
    
  } catch (error) {
    console.error('Firebase initialization error:', error);
    
    // Create mock objects to prevent errors
    window.firebase = {
      firestore: () => ({
        FieldValue: {
          serverTimestamp: () => new Date()
        }
      }),
      auth: () => ({}),
      analytics: () => ({}),
      apps: []
    };
    
    // Make sure FieldValue is accessible
    window.firebase.firestore.FieldValue = {
      serverTimestamp: () => new Date()
    };
    
    window.db = {
      collection: () => ({
        add: () => Promise.reject(new Error('Firebase initialization failed: ' + error.message)),
        doc: () => ({
          update: () => Promise.reject(new Error('Firebase initialization failed'))
        })
      })
    };
    
    window.auth = {};
    window.analytics = {
      logEvent: () => console.log('Analytics not available - Firebase initialization failed')
    };
    
    console.log('Firebase fallback mode activated due to initialization error');
    return false;
  }
}

// Initialize Firebase when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
  initializeFirebase();
}

// Also try to initialize after a short delay to ensure Firebase SDK is loaded
setTimeout(initializeFirebase, 1000);
