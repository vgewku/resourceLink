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
const reviewDB = db.ref('reviews');


// Example: Endpoint to handle data submission (called from the frontend)
// Submit data for Client
 app.post('/submit-data', async (req, res) => {
   const { email, password, phoneNumber, dataConsent, ethnicity, gender, age, education, employmentStatus } = req.body; // Expecting JSON data from frontend
   const clientData = {
    email: email,
    phoneNumber: phoneNumber,
    dataConsent: dataConsent,
    ethnicity: ethnicity,
    gender: gender,
    age: age,
    education: education,
    employmentStatus: employmentStatus
  };

   try {
    // Create a new user with Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log("Client created on Firebase Auth")
    
    // After creating user in auth, push data to DB
    clientDB.push(clientData, (error) => {
        if (error) {
          res.status(500).send('Error saving data');
        } else {
          console.log("Client created on Firebase DB")
          res.status(200).send('Client was created succesfully');
        }
      }
    )

   } catch (error) {
    console.error("Error in creating Client or storing Client", error)
    res.status(500).json({ message: 'Error in creating Client or storing Client.', error: error.message });
   }
 });

 // Submit data for Providers
 app.post('/submit-providers', async (req, res) => {
   const { email, password, organization, phone, bio, address, zip, city, state, country, resources, hours } = req.body; // Expecting JSON data from frontend
   const providerData = {
    email: email,
    password: password,
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
   }

   try {
    // Create a new user with Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log("Provider created on Firebase Auth")
    
    // After creating user in auth, push data to DB
    providerDB.push(providerData, (error) => {
        if (error) {
          res.status(500).send('Error saving data');
        } else {
          console.log("Provider created on Firebase DB")
          res.status(200).send('Provider was created succesfully');
        }
      }
    )

   } catch (error) {
    console.error("Error in creating Provider or storing Provider", error)
    res.status(500).json({ message: 'Error in creating Provider or storing Provider.', error: error.message });
   }
 });

 //Submit data for Reviews
 app.post('/submit-review', async (req, res) => {
  const { rating, reviewText, orgName, userName} = req.body;
  const reviewData = {
    rating: rating,
    reviewText: reviewText,
    orgName: orgName,
    userName: userName
  }

  try{
    // creating review in DB
    reviewDB.push(reviewData, (error) => {
      if (error) {
        res.status(500).send('Error saving Review');
      } else {
        res.status(200).send('Review was created succesfully');
      }
    })

  }
  catch (error){
    console.error("Error in creating Review or storing Review", error)
    res.status(500).json({ message: 'Error in creating Review or storing Review.', error: error.message });
  }
  
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
