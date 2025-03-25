async function findStores() {
    const ingredient = document.getElementById("ingredient").value;
    const location = document.getElementById("location").value;
    const statusEl = document.getElementById("status");
    const resultsEl = document.getElementById("results");

    if (!ingredient || !location) {
        statusEl.innerText = "Please enter both an ingredient and a location.";
        return;
    }

    statusEl.innerText = `Searching for stores near ${location} that may have ${ingredient}...`;
    resultsEl.innerHTML = "";

    try {
        // Step 1: Convert location to latitude/longitude
        const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=YOUR_API_KEY_HERE`);
        const geoData = await geoResponse.json();
        
        console.log("Geocode API Response:", geoData); // DEBUGGING

        if (geoData.status !== "OK") {
            throw new Error("Location not found.");
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        // Step 2: Search for nearby grocery stores
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=grocery_or_supermarket&key=YOUR_API_KEY_HERE`;
        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();

        console.log("Places API Response:", placesData); // DEBUGGING

        if (placesData.status !== "OK") {
            throw new Error("No stores found.");
        }

        // Step 3: Display store results
        resultsEl.innerHTML = placesData.results.map(store => 
            `<p><strong>${store.name}</strong><br>${store.vicinity}</p>`
        ).join("") || "No stores found nearby.";

        statusEl.innerText = `Found ${placesData.results.length} stores near ${location}.`;

    } catch (error) {
        console.error("Error:", error);
        statusEl.innerText = "Error fetching store data. Check the console.";
    }
}
