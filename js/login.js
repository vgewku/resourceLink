// // Initialize Firebase with compat version
// const firebaseConfig = {
//     apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
//     authDomain: "resourcelink-80257.firebaseapp.com",
//     databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
//     projectId: "resourcelink-80257",
//     storageBucket: "resourcelink-80257.appspot.com",
//     messagingSenderId: "249943715055",
//     appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
//   };
  
//   // This works with the compat SDK (Firebase v9+ loaded via CDN)
//   firebase.initializeApp(firebaseConfig);
  
//   // References
//   const auth = firebase.auth();
//   const loginForm = document.getElementById('loginForm');
//   const emailInput = document.getElementById('email');
//   const passwordInput = document.getElementById('password');
  
//   // Submit handler
//   loginForm.addEventListener('submit', (event) => {
//     event.preventDefault();
  
//     const email = emailInput.value.trim();
//     const password = passwordInput.value.trim();
  
//     auth.signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         console.log('Logged in:', userCredential.user);
//         alert('Login successful!');
//         // window.location.href = "searchpage.html"; 
//       })
//       .catch((error) => {
//         console.error('Login error:', error.message);
//         alert('Login failed: ' + error.message);
//       });
//   });


// Configs
const firebaseConfig = {
  apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
  authDomain: "resourcelink-80257.firebaseapp.com",
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
  projectId: "resourcelink-80257",
  storageBucket: "resourcelink-80257.appspot.com",
  messagingSenderId: "249943715055",
  appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
};

// Initialize app
firebase.initializeApp(firebaseConfig);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Submit event
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const db = firebase.database();

  // Check role helper function
  const checkRole = (path, role, redirectTo) => {
    return db.ref(path).once('value').then((snapshot) => {
      const users = snapshot.val();
      for (const key in users) {
        const user = users[key];
        if (user.email === email) {
          alert(`Login successful as ${role}`);
          // Redirect immediately
          window.location.href = redirectTo;
          return true;
        }
      }
      return false;
    });
  };

  // Firebase authentication
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // 👇 Check clients and providers in sequence
      checkRole("clients", "client", "searchpage.html").then((matchedClient) => {
        if (matchedClient) return;
        return checkRole("providers", "provider", "homepage.html").then((matchedProvider) => {
          if (!matchedProvider) {
            alert("Incorrect email or password.");
          }
        });
      })
    })
    .catch((error) => {
      // failed to sign-in
      console.error("Login error:", error);
      alert("Something went wrong during login.");
    });

});
