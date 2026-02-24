const apiKey = CONFIG.WEATHER_API_KEY;
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");
const loader = document.getElementById("loader");
const geoBtn = document.getElementById("geo-btn");
const historyContainer = document.getElementById("recent-searches");

let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// 1. Initial Load
window.onload = () => {
    renderHistory();
    if (searchHistory.length > 0) fetchWeatherData(searchHistory[0]);
};

// 2. Geolocation Feature
geoBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(null, latitude, longitude);
    });
});

// 3. Main Fetch Function
async function fetchWeatherData(city, lat = null, lon = null) {
    loader.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");

    let currentUrl, forecastUrl;
    
    if (lat && lon) {
        currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
        currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    }

    try {
        const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        if (!currentRes.ok) throw new Error("City not found");

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        updateUI(currentData, forecastData);
        saveToHistory(currentData.name);
    } catch (err) {
        alert(err.message);
    } finally {
        loader.classList.add("hidden");
    }
}

// 4. Update UI with Local Time
function updateUI(current, forecast) {
    document.getElementById("city-name").innerText = current.name;
    document.getElementById("temp").innerText = `${Math.round(current.main.temp)}°C`;
    
    // Calculate Local Time using timezone offset
    const utcDate = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localDate = new Date(utcDate + (current.timezone * 1000));
    document.getElementById("local-time").innerText = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById("humidity").innerText = `${current.main.humidity}%`;
    document.getElementById("wind").innerText = `${current.wind.speed} km/h`;
    document.getElementById("description").innerText = current.weather[0].description;
    
    const iconCode = current.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    renderForecast(forecast);
    weatherDisplay.classList.remove("hidden");
}

// 5. Search History Logic
function saveToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
        renderHistory();
    }
}

function renderHistory() {
    historyContainer.innerHTML = searchHistory.map(city => `<span class="tag" onclick="fetchWeatherData('${city}')">${city}</span>`).join("");
}

function renderForecast(data) {
    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    for (let i = 8; i <= 24; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        container.innerHTML += `
            <div class="forecast-item">
                <p class="forecast-day">${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchWeatherData(cityInput.value.trim());
});
