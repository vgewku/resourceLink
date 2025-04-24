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

// Log out function
document.querySelector('.logout').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";  // Redirect
    }).catch((error) => {
        console.error("Logout error:", error);
        alert("Failed to log out.");
    });
});

// Save Changes function
document.querySelector('.update').addEventListener('click', () => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user logged in.");
        return;
    }

    const clientData = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value,
        ethnicity: getRadioValue('ethnicity'),
        gender: getRadioValue('gender'),
        age: getRadioValue('age'),
        education: getRadioValue('education'),
        employment: getRadioValue('employment')
    };

    // Send to backend
    fetch('http://localhost:3000/update-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, ...clientData })
    })
    .then(res => res.json())
    .then(data => {
        alert("Client information updated successfully!");
    })
    .catch(err => {
        console.error("Update error:", err);
        alert("Failed to update client information.");
    });
});

// Helper: Get selected radio value
function getRadioValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
}
