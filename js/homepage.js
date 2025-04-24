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
    }

    userIcon.addEventListener('click', () => {
        const email = user.email;

        // Check clients first
        db.ref('clients').once('value').then(snapshot => {
            const clients = snapshot.val();
            for (const key in clients) {
                if (clients[key].email === email) {
                    window.location.href = 'client_setting.html';  // Redirect for clients
                    return;
                }
            }

            // If not a client, check providers
            db.ref('providers').once('value').then(snapshot => {
                const providers = snapshot.val();
                for (const key in providers) {
                    if (providers[key].email === email) {
                        window.location.href = 'provider_setting.html';  // Redirect for providers
                        return;
                    }
                }

                alert("Role not found.");
            });
        });
    });
});
