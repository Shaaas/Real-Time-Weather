const apiKey = "b794bd96719d4b0d8e40513649dc90ec"; 

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateUI(data);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert("Unable to connect to the server.");
    }
}

function updateUI(data) {
    // Update Text
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("feels-like").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
    
    // Update Icon
    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Dynamic Backgrounds
    const condition = data.weather[0].main;
    const body = document.body;

    if (condition === "Clear") {
        body.style.background = "linear-gradient(135deg, #f7b733, #fc4a1a)";
    } else if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
        body.style.background = "linear-gradient(135deg, #616161, #9bc5c3)";
    } else if (condition === "Clouds") {
        body.style.background = "linear-gradient(135deg, #757f9a, #d7dde8)";
    } else {
        body.style.background = "linear-gradient(135deg, #00b4db, #0083b0)";
    }

    weatherDisplay.classList.remove("hidden");
    cityInput.value = "";
}
