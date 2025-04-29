// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDNTrGx7vfJDB6mQL7XBSPo2DqCSACVjDM",
    authDomain: "resourcelink-80257.firebaseapp.com",
    databaseURL: "https://resourcelink-80257-default-rtdb.firebaseio.com",
    projectId: "resourcelink-80257",
    storageBucket: "resourcelink-80257.appspot.com",
    messagingSenderId: "249943715055",
    appId: "1:249943715055:web:03022ed87d6a42acdcbf1a"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const userIcon = document.getElementById('userIcon');  // Target the user icon image

// Wait for auth state to be ready
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        console.log("No user logged in.");
        return;
    } else {
        console.log(user + "is logged in")
    }

    userIcon.addEventListener('click', () => {
        const email = user.email;

        // Check clients first
        db.ref('clients').once('value').then(snapshot => {
            const clients = snapshot.val();
            console.log('Clients snapshot:', clients);
            for (const key in clients) {
                console.log(`Checking client ${key}: ${clients[key].email}`);
                if (clients[key].email === email) {
                    console.log('Found client match!');
                    window.location.href = 'client_setting.html';  // Redirect for clients
                    return;
                }
            }

            console.log('No client match, checking providers now.');

            // If not a client, check providers
            db.ref('providers').once('value').then(snapshot => {
                const providers = snapshot.val();
                console.log('Providers snapshot:', providers);
                for (const key in providers) {
                    console.log(`Checking provider ${key}: ${providers[key].email}`);

                    console.log(`Comparing: database email "${providers[key].email}" vs user email "${email}"`);
                    if (providers[key].email === email) {
                        console.log('Found provider match!');
                        window.location.href = 'provider_setting.html';  // Redirect for providers
                        return;
                    }
                }
                console.log('No provider match found.');
                alert("Role not found.");
            });
        });
    });
});
