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
    var userName = document.getElementById('username').value;
    var phone = document.getElementById('phone').value;
    var consent = document.getElementById('consent').checked ? 'Yes' : 'No';
    var ethnicity = document.querySelector('input[name="ethnicity"]:checked').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var age = document.querySelector('input[name="age"]:checked').value;
    var education = document.querySelector('input[name="education"]:checked').value;
    var employment = document.querySelector('input[name="employment"]:checked').value;
  
    firebase.database().ref('clients').push({
      userName: userName,
      phoneNumber: phone,
      dataConsent: consent,
      ethnicity: ethnicity,
      gender: gender,
      age: age,
      education: education,
      employmentStatus: employment
    }, function(error) {
      if (error) {
        alert('Data could not be saved.' + error);
      } else {
        alert('Data saved successfully.');
      }
    });
  }
  