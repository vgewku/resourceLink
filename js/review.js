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
    const orgName = "OrgName";
    const userName = "User Name";

    const data = {
        rating,
        reviewText,
        orgName,
        userName
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