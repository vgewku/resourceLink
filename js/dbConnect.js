const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin SDK Setup
const serviceAccount = require("C:/Users/valer/Documents/ISTM 4210 Capstone/resourcelink-80257-firebase-adminsdk-fbsvc-c54a358f87.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com"
});

const db = admin.database();
const clientDB = db.ref('clients');
const providerDB = db.ref('providers');

// Endpoint to handle user login using Firebase Authentication
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase Authentication: Verify user's email and password
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Check if user exists and password is correct (authentication is handled by Firebase)
    

    // If the login is successful, you can generate a custom Firebase token:
    const firebaseToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({
      message: 'Login successful',
      firebaseToken: firebaseToken
    });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(400).send({
      message: 'Login failed',
      error: error.message
    });
  }
});

// Example: Endpoint to handle data submission (called from the frontend)
// app.post('/submit-data', (req, res) => {
//   const clientData = req.body;  // Expecting JSON data from frontend
//   clientDB.push(clientData, (error) => {
//     if (error) {
//       res.status(500).send('Error saving data');
//     } else {
//       res.status(200).send('Data saved successfully');
//     }
//   });
// });

// app.post('/submit-providers', (req, res) => {
//   const providerData = req.body;
//   providerDB.push(providerData, (error) => {
//     if (error) {
//       res.status(500).send('Error saving provider data');
//     } else {
//       res.status(200).send('Provider data saved successfully');
//     }
//   });
// });

app.post('/submit-data', async (req, res) => {
  const clientData = req.body;
  const { username, password } = clientData;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: username,
      password: password,
    });

    // Save additional data to Firebase Realtime Database
    clientData.userId = userRecord.uid; // Store Firebase UID for user
    await clientDB.push(clientData);

    res.status(200).send('Client account created successfully!');
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Error creating client account');
  }
});

app.post('/submit-providers', async (req, res) => {
  const providerData = req.body;
  const { username, password } = providerData;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: username,
      password: password,
    });

    // Save additional data to Firebase Realtime Database
    providerData.userId = userRecord.uid; // Store Firebase UID for user
    await providerDB.push(providerData);

    res.status(200).send('Provider account created successfully!');
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Error creating provider account');
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
