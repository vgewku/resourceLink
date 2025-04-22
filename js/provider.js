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
  
//firebase.initializeApp(firebaseConfig);
/*  

function submitDataProvider() {
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
    }, function(error) {
        if (error) {
          alert('Data could not be saved.' + error);
        } else {
          alert('Data saved successfully.');
        }
      }

);
}
*/

function submitDataProvider(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const organization = document.getElementById('organization').value;
    const phone = document.getElementById('phone').value;
    const bio = document.getElementById('bio').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const resources = [];
    document.querySelectorAll('input[name="resource"]:checked').forEach((checkbox) => {
        resources.push(checkbox.value);
    });
    const monOpen = document.getElementById('monday_open').value;
    const monClose = document.getElementById('monday_close').value;
    const tueOpen = document.getElementById('tuesday_open').value;
    const tueClose = document.getElementById('tuesday_close').value;
    const wedOpen = document.getElementById('wednesday_open').value;
    const wedClose = document.getElementById('wednesday_close').value;
    const thurOpen = document.getElementById('thursday_open').value;
    const thurClose = document.getElementById('thursday_close').value;
    const friOpen = document.getElementById('friday_open').value;
    const friClose = document.getElementById('friday_close').value;
    const satOpen = document.getElementById('saturday_open').value;
    const satClose = document.getElementById('saturday_close').value;
    const sunOpen = document.getElementById('sunday_open').value;
    const sunClose = document.getElementById('sunday_close').value;

    const data = {
        email,
        password,
        organization,
        phone,
        bio,
        neighborhood,
        resources,
        monOpen,
        monClose,
        tueOpen,
        tueClose,
        wedOpen,
        wedClose,
        thurOpen,
        thurClose,
        friOpen,
        friClose,
        satOpen,
        satClose,
        sunOpen,
        sunClose
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
        window.location.href = 'payment.html'; // Redirect to the payment page after successful submission
    })


    .catch((error) => {
        console.error(error)
        alert('Failed to save provider information. ' + error.message);
    });

}


