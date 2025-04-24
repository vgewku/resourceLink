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
    const providerOrgName = "RiseWell"; //TODO: this is hard coded provider name

    const data = {
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
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.text();
    })
    .then((msg) => {
      alert(msg);
      window.location.href = 'resourcesearch.html'; // stay on same page
    })
    .catch((error) => {
      console.error(error)
      alert('Failed to save Review. ' + error.message);
    });
}

// Load reviews from Backend server
function loadReviews() {
  fetch('http://localhost:3000/reviews')
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

