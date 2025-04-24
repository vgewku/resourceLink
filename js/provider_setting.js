
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
        thursClose: document.getElementById('thursday_cl