
function logout() {
    firebase.auth().signOut()
    .then(() => {
        alert("Logged out successfully!");
        window.location.href = "login.html";  // Redirect to login page
    })
    .catch((error) => {
        console.error("Logout error:", error);
        alert("Failed to log out.");
    });
}

function updateProviderInfo() {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("No user logged in!");
      return;
    }
  
    const providerData = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value, // Optional: Or handle password updates separately
      organization: document.getElementById('organization').value,
      phone: document.getElementById('phone').value,
      bio: document.getElementById('bio').value,
      neighborhood: document.getElementById('neighborhood').value,
      resources: Array.from(document.querySelectorAll('input[name="resource"]:checked')).map(cb => cb.value),
      acceptingClients: document.querySelector('input[name="client-accepting"]:checked')?.value,
      hours: {
        monOpen: document.getElementById('monday_open').value,
        monClose: document.getElementById('monday_close').value,
        tueOpen: document.getElementById('tuesday_open').value,
        tueClose: document.getElementById('tuesday_close').value,
        wedOpen: document.getElementById('wednesday_open').value,
        wedClose: document.getElementById('wednesday_close').value,
        thursOpen: document.getElementById('thursday_open').value,
        thursClose: document.getElementById('thursday_close').value,
        friOpen: document.getElementById('friday_open').value,
        friClose: document.getElementById('friday_close').value,
        satOpen: document.getElementById('saturday_open').value,
        satClose: document.getElementById('saturday_close').value,
        sunOpen: document.getElementById('sunday_open').value,
        sunClose: document.getElementById('sunday_close').value,
      }
    };

    // Send data to backend
    fetch('http://localhost:3000/update-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: user.uid,  // Identify provider
        ...providerData
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Information updated successfully!");
    })
    .catch(err => {
      console.error('Error updating info:', err);
      alert("Failed to update info.");
    });
  }
  

  