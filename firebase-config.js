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

// Global Firebase initialization state
let firebaseInitialized = false;
let firebaseInitPromise = null;

// Initialize Firebase with retry mechanism
function initializeFirebase() {
  if (firebaseInitialized) {
    return Promise.resolve(true);
  }
  
  if (firebaseInitPromise) {
    return firebaseInitPromise;
  }
  
  firebaseInitPromise = new Promise((resolve, reject) => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const tryInit = () => {
      attempts++;
      console.log(`Firebase initialization attempt ${attempts}/${maxAttempts}`);
      
      try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
          if (attempts < maxAttempts) {
            console.log('Firebase SDK not loaded yet, retrying...');
            setTimeout(tryInit, 500);
            return;
          } else {
            console.error('Firebase SDK not loaded after maximum attempts');
            reject(new Error('Firebase SDK not loaded'));
            return;
          }
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
        
        firebaseInitialized = true;
        console.log('Firebase initialized successfully with real configuration');
        console.log('Project ID:', firebaseConfig.projectId);
        resolve(true);
        
      } catch (error) {
        console.error('Firebase initialization error:', error);
        
        if (attempts < maxAttempts) {
          console.log('Firebase initialization failed, retrying...');
          setTimeout(tryInit, 500);
          return;
        }
        
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
        resolve(false);
      }
    };
    
    tryInit();
  });
  
  return firebaseInitPromise;
}

// Initialize Firebase when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase().catch(console.error);
  });
} else {
  initializeFirebase().catch(console.error);
}

// Also try to initialize after delays to ensure Firebase SDK is loaded
setTimeout(() => {
  initializeFirebase().catch(console.error);
}, 1000);

setTimeout(() => {
  initializeFirebase().catch(console.error);
}, 3000);
