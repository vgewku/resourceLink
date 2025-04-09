//Firebase Frontend Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
    authDomain: "resourcelink-80257.firebaseapp.com",
    databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
    projectId: "resourcelink-80257",
    storageBucket: "resourcelink-80257.firebasestorage.app",
    messagingSenderId: "249943715055",
    appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
  };

function submitDataProvider() {

    const organization = document.getElementById('organization').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    const address = document.getElementById('address').value;
    const zip = document.getElementById('zip').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;
    const resources = [];
    document.querySelectorAll('input[name="resource"]:checked').forEach((checkbox) => {
        resources.push(checkbox.value);
    });
    const hours = document.getElementById('hours').value;

    const data = {
        organization,
        phone,
        bio,
        address,
        zip,
        city,
        state,
        country,
        resources,
        hours
    };

    fetch('http://localhost:3000/submit-providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok.");
        return response.text();
    })
    .then((msg) => {
        alert(msg);
    })
    .catch((error) => {
        alert('Failed to save provider information. ' + error.message);
    });
}
