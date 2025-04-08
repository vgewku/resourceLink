// dbConnect.js (Backend)
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

// Example: Endpoint to handle data submission (called from the frontend)
app.post('/submit-data', (req, res) => {
  const clientData = req.body;  // Expecting JSON data from frontend
  const providerData = req.body;
  clientDB.push(clientData, (error) => {
    if (error) {
      res.status(500).send('Error saving data');
    } else {
      res.status(200).send('Data saved successfully');
    }
  });
 
});

app.post('/submit-providers', (req, res) => {
  const providerData = req.body;
  providerDB.push(providerData, (error) => {
    if (error) {
      res.status(500).send('Error saving provider data');
    } else {
      res.status(200).send('Provider data saved successfully');
    }
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
