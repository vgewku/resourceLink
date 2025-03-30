var admin = require("firebase-admin");

var serviceAccount = require("C:/Users/valer/Documents/ISTM 4210 Capstone/resourcelink-80257-firebase-adminsdk-fbsvc-c54a358f87.json");


//Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com"
});


const db = admin.database();
const ref = db.ref('users');

// Add data to the "users" node
ref.set({
  user1: {
    name: 'John Doe',
    age: 25,
  },
});
