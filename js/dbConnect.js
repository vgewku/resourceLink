const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

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


//Payment






const CLIENT_ID = 'AdMEJkU2WYGqHmW34EITi0gnGEX3ejrJ2JhUTVyDqyKWmmqLFQ7aOqU4P7pi9xMFFKOL2eAcxYw93seZ';
const CLIENT_SECRET = 'EKARZG3fZCvEyfHry2ed-zlsF3mkSn17hLZxCv1j5q_tYOSxLFspgbHv04xmfugJIppuFpIPReoT85y_';

app.post('/capture-order', async (req, res) => {
    const { orderID } = req.body;

    // Get OAuth token
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const tokenRes = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const { access_token } = await tokenRes.json();

    // Capture order
    const captureRes = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    });

    const captureData = await captureRes.json();
    res.json(captureData);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
