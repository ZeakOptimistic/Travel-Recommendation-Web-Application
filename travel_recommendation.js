document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");
    const resultsContainer = document.getElementById("results");
    const recommendationContainer = document.getElementById("recommendationContainer");

    async function fetchData() {
        const response = await fetch("travel_recommendation_api.json");
        const data = await response.json();
        return data;
    }

    function displayResults(matches) {
        // Clear previous results
        resultsContainer.innerHTML = "";

        // If no matches, show a message and hide the container
        if (matches.length === 0) {
            recommendationContainer.style.display = "none";
            return;
        }

        // Show container
        recommendationContainer.style.display = "block";

        // Create cards
        matches.forEach(item => {
            const card = document.createElement("div");
            card.className = "recommendation-card";
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    async function searchKeyword() {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) {
            recommendationContainer.style.display = "none";
            return;
        }

        const data = await fetchData();
        let matches = [];

        // Search logic
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (
                    city.name.toLowerCase().includes(keyword) ||
                    city.description.toLowerCase().includes(keyword)
                ) {
                    matches.push(city);
                }
            });
        });
        data.temples.forEach(temple => {
            if (
                temple.name.toLowerCase().includes(keyword) ||
                temple.description.toLowerCase().includes(keyword)
            ) {
                matches.push(temple);
            }
        });
        data.beaches.forEach(beach => {
            if (
                beach.name.toLowerCase().includes(keyword) ||
                beach.description.toLowerCase().includes(keyword)
            ) {
                matches.push(beach);
            }
        });

        displayResults(matches);
    }

    function clearResults() {
        searchInput.value = "";
        recommendationContainer.style.display = "none"; // Hide container on clear
    }

    searchButton.addEventListener("click", searchKeyword);
    clearButton.addEventListener("click", clearResults);
});
