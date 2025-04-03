var admin = require("firebase-admin");

var serviceAccount = require("C:/Users/valer/Documents/ISTM 4210 Capstone/resourcelink-80257-firebase-adminsdk-fbsvc-c54a358f87.json");


//Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com"
});


const db = admin.database();
const clientDB = db.ref('client');
const providerDB = db.ref('provider');
const reviewDB = db.ref('reviews');

//Entering data into Provider Database
const providerID = providerDB.push();
providerID.set({
  orgName: "Helping Hands",
  phoneNumber: "2023345678",
  providerBio: "Helping Hands is a non-profit organization dedicated to supporting low-income individuals and families with essential resources like food, housing assistance, and job training. We strive to create pathways to stability and self-sufficiency, believing that everyone deserves access to basic necessities and opportunities for a better future.",
  streetAddress: "1234 Maple Street NW",
  zipCode: "20001",
  city: "Washington",
  state: "District of Columbia",
  country: "United States",
  resourceType: "Food Pantry",
  hoursOfOperation: "9am to 6pm"

}).then(()=> {
  console.log("Client added successfully!");
}).catch((error) => {
  console.error("Error adding client:", error);
});

//Entering data into Client Database
const clientID = clientDB.push();
clientID.set({
  userName: "JohnSmith123",
  phoneNumber: "2024824402",
  dataConsent: "Yes",
  profilePhoto: "img1.jpg",
  ethinicity: "White/Caucasian",
  gender: "male",
  age: "18-30",
  education: "Bachelor's degree",
  employementStatus: "Full-time"
}).then(()=> {
  console.log("Client added successfully!");
}).catch((error) => {
  console.error("Error adding client:", error);
});
