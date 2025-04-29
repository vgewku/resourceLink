
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
  authDomain: "resourcelink-80257.firebaseapp.com",
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
  projectId: "resourcelink-80257",
  storageBucket: "resourcelink-80257.appspot.com",
  messagingSenderId: "249943715055",
  appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

function logout() {
    firebase.auth().signOut()
    .then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";  // Redirect to login page
    })
    .catch((error) => {
        console.error("Logout error:", error);
        alert("Failed to log out.");
    });
}

function updateProviderInfo() {
  console.log("Provider is being updated...")
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("No user logged in!");
      window.location.href = 'login.html';  // Redirect to login
      return;
    }
  
    const providerData = {
      email: user.email,
      organization: document.getElementById('organization').value || undefined,
      phone: document.getElementById('phone').value || undefined,
      bio: document.getElementById('bio').value || undefined,
      neighborhood: document.getElementById('neighborhood').value || undefined,
      resources: Array.from(document.querySelectorAll('input[name="resource"]:checked')).map(cb => cb.value), // if nothing is selected, it will be updated to nothing
      acceptingClients: document.querySelector('input[name="client-accepting"]:checked')?.value || undefined,
      hours: {
        monOpen: document.getElementById('monday_open').value || undefined,
        monClose: document.getElementById('monday_close').value || undefined,
        tueOpen: document.getElementById('tuesday_open').value || undefined,
        tueClose: document.getElementById('tuesday_close').value || undefined,
        wedOpen: document.getElementById('wednesday_open').value || undefined,
        wedClose: document.getElementById('wednesday_close').value || undefined,
        thursOpen: document.getElementById('thursday_open').value || undefined,
        thursClose: document.getElementById('thursday_close').value || undefined,
        friOpen: document.getElementById('friday_open').value || undefined,
        friClose: document.getElementById('friday_close').value || undefined,
        satOpen: document.getElementById('saturday_open').value || undefined,
        satClose: document.getElementById('saturday_close').value || undefined,
        sunOpen: document.getElementById('sunday_open').value || undefined,
        sunClose: document.getElementById('sunday_close').value || undefined,
      }
    };
    console.log(providerData)

    // Send data to backend
    fetch('http://localhost:3000/update-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: user.uid,  // Identify provider
        ...providerData
      })
    })
    .then(res => {console.log(res); res.json()})
    .then(data => {
      alert("Information updated successfully!");
      window.location.href = "homepage.html";  // Redirect
    })
    .catch(err => {

      console.error('Error updating info:', err);
      alert("Failed to update info.");
    });
  }
  

  