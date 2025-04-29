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
    })
  } catch (error) {
    console.error("Error in creating Client or storing Client", error)
    res.status(500).json({ message: 'Error in creating Client or storing Client.', error: error.message });
  }
});

// Submit data for Providers
app.post('/submit-providers', async (req, res) => {
  const { email, password, organization, phone, bio, neighborhood, resources, monOpen, monClose, tueOpen, tueClose, wedOpen, wedClose, thurOpen, thurClose, friOpen, friClose, satOpen, satClose, sunOpen, sunClose  } = req.body; // Expecting JSON data from frontend
  const providerData = {
  email: email,
  password: password,
  organization: organization,
  phone: phone,
  bio: bio,
  neighborhood: neighborhood,
  resources: resources,
  monOpen: monOpen,
  monClose: monClose,
  tueOpen: tueOpen,
  tueClose: tueClose,
  wedOpen: wedOpen,
  wedClose: wedClose,
  thurOpen: thurOpen,
  thurClose: thurClose,
  friOpen: friOpen,
  friClose: friClose,
  satOpen: satOpen,
  satClose: satClose,
  sunOpen: sunOpen,
  sunClose: sunClose
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
    })

  } catch (error) {
    console.error("Error in creating Provider or storing Provider", error)
    res.status(500).json({ message: 'Error in creating Provider or storing Provider.', error: error.message });
  }
});

//Submit data for Reviews
app.post('/submit-review', async (req, res) => {
  const { rating, reviewText, userName} = req.body;
  
  // retrieve user's orgName based on the user's email
  console.log(userName)
  providerDB.orderByChild('email').equalTo(userName).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      return res.status(404).send('User not found');
    }

    const userData = snapshot.val();
    const userKey = Object.keys(userData)[0]; // Get the first user key
    const user = userData[userKey];
    const userOrgName = user.organization;

    const reviewData = {
      rating: rating,
      reviewText: reviewText,
      orgName: userOrgName,
      userName: userName
    };

    // creating review in DB
    reviewDB.push(reviewData, (error) => {
      if (error) {
        console.error("Error in storing Review!", error)
        res.status(500).send('Error saving Review');
      } else {
        res.status(200).send('Review was created succesfully');
      }
    })
  });
});

// Fetch reviews from Firebase
app.get('/reviews', async (req, res) => {
  try {
    const snapshot = await reviewDB.once('value'); // DB for reviews
    const reviews = Object.values(snapshot.val() || {}); // const reviews = snapshot.val() == null ? [] : Object.values(snapshot.val());
    console.log("Reviews were retrieved")
    console.log(reviews)
      
    // Send reviews as response
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
})


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


//update Provider Information
app.post('/update-provider', async (req, res) => {
  const { uid, email, ...providerData } = req.body;
  try {
      const snapshot = await providerDB.orderByChild('email').equalTo(email).once('value');
      if (!snapshot.exists()) {
          return res.status(404).send({ message: 'Provider not found' });
      }
      const key = Object.keys(snapshot.val())[0];
      await providerDB.child(key).update(providerData);
      res.status(200).send({ message: 'Provider updated successfully' });
  } catch (error) {
      console.error('Error updating provider:', error);
      res.status(500).send({ message: 'Error updating provider', error: error.message });
  }
});

//Update Client Information
app.post('/update-client', async (req, res) => {
  const { uid, email, phone, bio, ethnicity, gender, age, education, employment } = req.body;

  try {
      const snapshot = await clientDB.orderByChild('email').equalTo(email).once('value');
      if (!snapshot.exists()) {
          return res.status(404).send({ message: 'Client not found' });
      }

      const key = Object.keys(snapshot.val())[0];

      await clientDB.child(key).update({
          phone, bio, ethnicity, gender, age, education, employment
      });

      res.status(200).send({ message: 'Client updated successfully' });
  } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).send({ message: 'Error updating client', error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
