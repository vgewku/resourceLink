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
  
  firebase.initializeApp(firebaseConfig);
  

function submitDataClient() {
    var organization = document.getElementById('organization').value;
    var phone = document.getElementById('phone').value;
    var bio = document.getElementById('bio').value;
    var address = document.getElementById('address').value;
    var zip = document.getElementById('zip').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var country = document.getElementById('country').value;
    var resources = [];
    document.querySelectorAll('input[name="resource"]:checked').forEach((checkbox) => {
        resources.push(checkbox.value);
    });
    var hours = document.getElementById('hours').value;

    firebase.database().ref('providers').push({
        organization: organization,
        phone: phone,
        bio: bio,
        address: address,
        zip: zip,
        city: city,
        state: state,
        country: country,
        resources: resources,
        hours: hours
    }).then(function() {
        alert('Provider information saved successfully.');
    }).catch(function(error) {
        alert('Failed to save provider information. ' + error);
    });
}
