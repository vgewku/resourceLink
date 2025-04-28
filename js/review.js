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
const db = firebase.database();


//get provider name
const urlParams = new URLSearchParams(window.location.search);
const providerName = urlParams.get('providerName');

//display the provider name
document.getElementById('providerName').innerText = providerName;

// Firebase Auth state listener
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user)
    console.log("User is signed in:", user.email); // You could set user info in localStorage or a global variable
    
    loadReviews();// Load reviews on page load
  } else {
    console.log("No user is signed in.");
    window.location.href = "login.html"; // redirect suer to login page
  }
});

// Consider moving the above code into new JS file: firebase-init.js
// ------------------------------------------------------------------------------------------------

//Querying data from Firebase
// Querying data from Firebase
const categoryRef = db.ref('providers');  // Reference to 'providers' node

// Querying based on the 'organization' key
const queryRef = categoryRef.orderByChild('organization').equalTo(providerName);  // `data` is the value you want to match (e.g., "Org A")

queryRef.once('value')
  .then(snapshot => {
    if (snapshot.exists()) {
      const providerData = snapshot.val();
      let additionalInfo = '';
      let additionalInfo2 = '';

      // Example: Assuming providerData has fields like 'phone', 'neighborhood', 'bio'
      for (let providerKey in providerData) {
        const provider = providerData[providerKey];
        if (provider.resources) {
          additionalInfo += `<p> <b>Resource Type: </b> ${provider.resources}</p>`;
        }
        if (provider.phone) {
          additionalInfo += `<p><b>Phone Number: </b> ${provider.phone}</p>`;
        }
        if (provider.neighborhood) {
          additionalInfo += `<p> <b>Neighborhood: </b> ${provider.neighborhood}</p>`;
        }
        if (provider.bio) {
          additionalInfo += `<p> <b>Org Bio: </b> ${provider.bio}</p>`;
        }

        additionalInfo += `<h3>Hours of Operation</h3>`; 

        if (provider.monOpen && provider.monClose) {
          additionalInfo += `<p>Monday Open/Close: <span>${provider.monOpen}</span> – <span>${provider.monClose}</span></p>`;
        }

        if (provider.tueOpen && provider.tueClose) {
          additionalInfo += `<p>Tuesday Open/Close: <span>${provider.tueOpen}</span> – <span>${provider.tueClose}</span></p>`;
        }

        if (provider.wedOpen && provider.wedClose) {
          additionalInfo += `<p>Wednesday Open/Close: <span>${provider.wedOpen}</span> – <span>${provider.wedClose}</span></p>`;
        }
        
        if (provider.thuOpen && provider.thuClose) {
          additionalInfo += `<p>Thursday Open/Close: <span>${provider.thuOpen}</span> – <span>${provider.thuClose}</span></p>`;
        }
        
        if (provider.friOpen && provider.friClose) {
          additionalInfo += `<p>Friday Open/Close: <span>${provider.friOpen}</span> – <span>${provider.friClose}</span></p>`;
        }
        
        if (provider.satOpen && provider.satClose) {
          additionalInfo += `<p>Saturday Open/Close: <span>${provider.satOpen}</span> – <span>${provider.satClose}</span></p>`;
        }
        
        if (provider.sunOpen && provider.sunClose) {
          additionalInfo += `<p>Sunday Open/Close: <span>${provider.sunOpen}</span> – <span>${provider.sunClose}</span></p>`;
        }


      }

      // Display the fetched data in the HTML
      document.getElementById('additionalInfo').innerHTML = additionalInfo;
    } else {
      document.getElementById('additionalInfo').innerText = 'No additional information found.';
    }
  })
  .catch(error => {
    console.error('Error fetching data from Firebase:', error);
  });





//Review Star Functionality
const stars = document.querySelectorAll('.star');
const ratingDisplay = document.getElementById('ratingDisplay');
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const value = parseInt(star.getAttribute('data-value'));
    highlightStars(value);
  });

  star.addEventListener('mouseout', () => {
    highlightStars(selectedRating);
  });

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-value'));
    ratingDisplay.textContent = `Rating: ${selectedRating}`;
  });
});

function highlightStars(rating) {
  stars.forEach(star => {
    const value = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('hover', value <= rating);
    star.classList.toggle('selected', value <= selectedRating);
  });
}

//Review Submission
function submitReview(){
    const rating = selectedRating;
    const reviewText = document.getElementById('reviewBox').value;
    const user = firebase.auth().currentUser;
    const providerOrgName = providerName; //TODO: this is hard coded provider name

    const reviewData = {
        rating,
        reviewText,
        providerOrgName, // will be retrieved from the previous page
        userName: user.email
    };

    fetch('http://localhost:3000/submit-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.text();
    })
    .then((msg) => {
      alert(msg);
      window.location.href = `resourcesearch.html?providerName=${encodeURIComponent(providerName)}`;
    })
    .catch((error) => {
      console.error(error)
      alert('Failed to save Review. ' + error.message);
    });
}

// Load reviews from Backend server
function loadReviews() {
  // Get provider from URL or from a previously set variable
  const urlParams = new URLSearchParams(window.location.search);
  const providerName = urlParams.get('providerName'); // Replace 'provider' with the actual query parameter used
  
  if (!providerName) {
    alert('No provider selected.');
    return;
  }

  // Fetch reviews for the specific provider
  fetch(`http://localhost:3000/reviews?providerName=${providerName}`)
    .then(response => response.json())
    .then(reviews => {
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.innerHTML = '';
      console.log(reviews.length + " Reviews were retrieved")
      console.log(reviews)

      if (reviews.length > 0) {
        reviews.forEach(review => {
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('review');

          reviewElement.innerHTML = `
            <p><strong>${review.userName}</strong> ${'★'.repeat(review.rating)}</p>
            <p>Client Review: ${review.reviewText}</p>
          `;

          reviewsList.appendChild(reviewElement);
        });
      } else {
        reviewsList.innerHTML = '<p>No reviews yet.</p>';
      }
    })
    .catch(error => {
      console.error('Failed to fetch reviews:', error);
      alert('Failed to fetch reviews');
    });
}

