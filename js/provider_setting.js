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
        // Repeat for other days...
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
  
  // Hook up update button
  document.querySelector(".update:nth-of-type(2)").addEventListener("click", updateProviderInfo);
  