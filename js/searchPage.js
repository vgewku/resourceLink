// Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
const currentDayOfWeek = new Date().getDay();


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

//get current day

function getCurrentDay() {
const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
return daysOfWeek[currentDayIndex]; // Returns 'mon', 'tue', etc.
}

document.getElementById("submitBtn").addEventListener("click", function() {
    // Get selected filters
    let selectedAvailability = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach((checkbox) => {
      selectedAvailability.push(checkbox.value);
    });
  
    let selectedLocations = [];
    document.querySelectorAll('input[name="location"]:checked').forEach((checkbox) => {
      selectedLocations.push(checkbox.value);
    });
  
    let selectedResources = [];
    document.querySelectorAll('input[name="resource"]:checked').forEach((checkbox) => {
      selectedResources.push(checkbox.value);
    });
  
    // Call Firebase to fetch data based on selected filters
    fetchFilteredData(selectedAvailability, selectedLocations, selectedResources);
});




function fetchFilteredData(availability, locations, resources) {
    console.log('Selected Availability:', availability);
    console.log('Selected Locations:', locations);
    console.log('Selected Resources:', resources);
    // Get today's day (e.g., 'mon', 'tue', etc.)
    const currentDay = getCurrentDay();
  
    // Get the current time in minutes (e.g., current time: 14:30 -> 870 minutes)
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
    // Reference to your Firebase data
    let providersRef = db.ref("providers");
  
    // Function to convert time like '08:00' into minutes
    function timeToMinutes(time) {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    }
  
    // Start by filtering based on today's open and close times
    let query = providersRef;
  
    query.once("value", function(snapshot) {
        if (snapshot.exists()) {
            let providers = snapshot.val();
            let filteredProviders = [];
    
            for (let providerId in providers) {
                let provider = providers[providerId];
                var is_available = false
                var is_location = false
                var has_resources = false

                console.log(provider)
                console.log(currentDay);
                
                // Check ALL filters (availability, location, and resources) if they are selected

                // Check availability
                // Get the opening and closing times for today
                const openTime = provider[`${currentDay}Open`]; // e.g., "08:00"
                const closeTime = provider[`${currentDay}Close`]; // e.g., "18:00"        
                
                if (openTime && closeTime && availability && availability.length > 0) {
                    const openTimeInMinutes = timeToMinutes(openTime);
                    const closeTimeInMinutes = timeToMinutes(closeTime);

                    // --- NEW AVAILABILITY RANGE HANDLING ---
                    let earliestStart = Infinity;
                    let latestEnd = -Infinity;

                    availability.forEach(range => {
                        const [start, end] = range.split(' - ');
                        const startInMinutes = timeToMinutes(start.trim());
                        const endInMinutes = timeToMinutes(end.trim());

                        if (startInMinutes < earliestStart) {
                            earliestStart = startInMinutes;
                        }
                        if (endInMinutes > latestEnd) {
                            latestEnd = endInMinutes;
                        }
                    });

                    console.log(`Provider Open/Close: ${openTime}-${closeTime}`);
                    console.log(`Selected Availability Range: ${earliestStart} to ${latestEnd} (in minutes)`);

                    // Check if the entire selected range is inside provider's open/close times
                    if (earliestStart >= openTimeInMinutes && latestEnd <= closeTimeInMinutes) {
                        is_available = true;
                    }
                    // --- END OF NEW AVAILABILITY HANDLING ---
                }

                // Check if provider offers selected resources
                for (let r of provider.resources) {
                    if (resources.includes(r)) {
                        has_resources = true;
                        break;
                    }
                }

                // Check if provider neighborhood is in selected locations
                if (locations.length === 0 || locations.includes(provider.neighborhood)) {
                    is_location = true;
                }

                // Final combined filter
                if (is_available && is_location && has_resources) {
                    filteredProviders.push(provider);
                    console.log("provider found & pushed");
                }
            }

            console.log(filteredProviders);
            if (filteredProviders.length > 0) {
                displayProviders(filteredProviders);
            } else {
                document.getElementById("providers_container").innerHTML = "No results found.";
            }
        } else {
            document.getElementById("providers_container").innerHTML = "No results found.";
        }
    });
}

    // This function will be responsible for displaying the filtered providers
    function displayProviders(filteredProviders) {
        const providersContainer = document.getElementById("providers_container");
      
        // Clear previous results if any
        providersContainer.innerHTML = '';
      
        // Check if there are any filtered providers to display
        if (filteredProviders.length > 0) {
            filteredProviders.forEach(provider => {
                const providerDiv = document.createElement("div");
                providerDiv.classList.add("provider");
    
                // Add provider details to the container
                providerDiv.innerHTML = `
                    <div class="provider-item">
                        <h3 class="providerName">${provider.organization}</h3>
                        <p><strong>Neighborhood:</strong> ${provider.neighborhood}</p>
                        <p><strong>Available Resources:</strong> ${provider.resources.join(', ')}</p>
                        <p><strong>Status:</strong> ${provider.acceptingClients ? 'Accepting Clients' : 'Not Accepting Clients'}</p>
                        <p><strong>Bio:</strong> ${provider.bio || 'No bio available'}</p>
                    </div>
                `;
    
                // Add click listener for each provider div
                providerDiv.addEventListener("click", function() {
                    console.log("Provider Name: ", provider.organization);
                    goToNextPage(provider.organization);  // Send the correct provider name to the next page
                });
    
                providersContainer.appendChild(providerDiv);
            });
        } else {
            providersContainer.innerHTML = "No results found.";
        }
    }

    function goToNextPage(providerName) {
        window.location.href = `resourcesearch.html?providerName=${encodeURIComponent(providerName)}`;
    }



  