// 1. Replace the string below with your actual API key from OpenWeather
const apiKey = "b794bd96719d4b0d8e40513649dc90ec"; 

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city !== "") {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    // encodeURIComponent handles spaces in city names like "San Francisco"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateUI(data);
        } else {
            // This will tell you exactly what went wrong in an alert
            alert(`Error: ${data.message}`); 
        }
    } catch (error) {
        alert("Check your internet connection and try again.");
    }
}

function updateUI(data) {
    // Mapping the JSON data to your HTML IDs
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
    
    // Icon logic
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById("weather-icon").src = iconUrl;

    // Show the results card and clear the input
    weatherDisplay.classList.remove("hidden");
    cityInput.value = "";
}
