// Import the necessary Firebase modules
import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
    authDomain: "resourcelink-80257.firebaseapp.com",
    databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
    projectId: "resourcelink-80257",
    storageBucket: "resourcelink-80257.firebasestorage.app",
    messagingSenderId: "249943715055",
    appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get references to the form elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Handle form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the native form submission

    const email = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Sign in with Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Handle successful authentication here
            console.log('Logged in user:', userCredential.user);
            // Optionally redirect the user or update the UI
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Failed to login: ' + error.message); // Provide user-friendly error messages
        });
});
