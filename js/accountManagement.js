let selectedRole = ''; // Track the selected role

// Function to set the role
function setRole(role) {
  selectedRole = role;
  // Update button styles to indicate which role is selected
  document.getElementById('provider').classList.toggle('active', role === 'provider');
  document.getElementById('client').classList.toggle('active', role === 'client');
}

// Function to handle form submission
function submitAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!selectedRole) {
        alert('Please select whether you are a provider or a client.');
        return;
    }
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const accountData = {
        username: username,
        password: password
    };

    // Determine which endpoint to use based on the role
    const endpoint = selectedRole === 'provider' ? '/submit-providers' : '/submit-data';

    // Initiate account creation and redirect
    axios.post(endpoint, accountData)
        .then(response => {
            alert('Account created successfully!');
            
            // Redirect based on the role
            if (selectedRole === 'provider') {
                window.location.href = 'provider_account.html'; // Redirect to provider page
            } else {
                window.location.href = 'user_account.html'; // Redirect to user page
            }
        })
        .catch(error => {
            console.error('Error creating account:', error);
            const errorMessage = error.response ? error.response.data : "Unknown error";
            alert('Failed to create account: ' + errorMessage);
        });
        
}
