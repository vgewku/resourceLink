// let selectedRole = ''; // Track the selected role

// // Function to set the role
// function setRole(role) {
//     selectedRole = role;
//     console.log("Selected role is now:", selectedRole); // This will help confirm the role is set
//     document.getElementById('provider').classList.toggle('active', role === 'provider');
//     document.getElementById('client').classList.toggle('active', role === 'client');
// }

// function submitAccount() {
//     const email = document.getElementById('email').value;  
//     const password = document.getElementById('password').value;

//     if (!email || !password) {
//         alert('Both email and password are required.');
//         return;
//     }

//     const accountData = {
//         email: email,
//         password: password
//     };

//     axios.post('/submit-account', accountData)
//         .then(response => {
//             alert('Account created successfully!');
//             // Handle post-creation actions here, like redirecting to a login page
//         })
//         .catch(error => {
//             console.error('Error creating account:', error);
//             alert('Failed to create account: ' + (error.response ? error.response.data : "Unknown error"));
//         });
// }


let selectedRole = ''; // Track the selected role

// Function to set the role
function setRole(role) {
    selectedRole = role;
    console.log("Selected role is now:", selectedRole); // Confirm the role is set
    document.getElementById('provider').classList.remove('active');
    document.getElementById('client').classList.remove('active');
    document.getElementById(role).classList.add('active');
}

function submitAccount() {
    if (!selectedRole) {
        alert('Please select whether you are registering as a provider or a client.');
        return;
    }

    // Redirect based on the selected role
    window.location.href = selectedRole === 'provider' ? 'provider_account.html' : 'user_account.html';
}
