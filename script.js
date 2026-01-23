const apiKey = "b794bd96719d4b0d8e40513649dc90ec";
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateUI(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
    
    // Set the Icon
    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Show the card
    weatherDisplay.classList.remove("hidden");
    
    // Clear input
    cityInput.value = "";
}
