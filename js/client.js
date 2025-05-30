/*

var admin = require("firebase-admin");

var serviceAccount = require("C:/Users/valer/Documents/ISTM 4210 Capstone/resourcelink-80257-firebase-adminsdk-fbsvc-c54a358f87.json");

//Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com"
});

const db = admin.database();
const clientDB = db.ref('client');
  */
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


function submitData() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var phone = document.getElementById('phone').value;
  var consent = document.getElementById('consent').checked ? 'Yes' : 'No';
  var ethnicity = document.querySelector('input[name="ethnicity"]:checked').value;
  var gender = document.querySelector('input[name="gender"]:checked').value;
  var age = document.querySelector('input[name="age"]:checked').value;
  var education = document.querySelector('input[name="education"]:checked').value;
  var employment = document.querySelector('input[name="employment"]:checked').value;

  const data = {
    email: email,
    password, password,
    phoneNumber: phone,
    dataConsent: consent,
    ethnicity: ethnicity,
    gender: gender,
    age: age,
    education: education,
    employmentStatus: employment
  };

  // submits data to the backend server
  fetch('http://localhost:3000/submit-data', {
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
    window.location.href = 'login.html';
  })
  .catch((error) => {
    alert('Failed to save client data. ' + error.message);
  });
}
