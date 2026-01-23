const apiKey = "b794bd96719d4b0d8e40513649dc90ec"; 

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");
const forecastContainer = document.getElementById("forecast-container");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) fetchWeatherData(city);
});

async function fetchWeatherData(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok) throw new Error("City not found");

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        updateCurrentUI(currentData);
        updateForecastUI(forecastData);
        
    } catch (error) {
        alert(error.message);
    }
}

function updateCurrentUI(data) {
    document.getElementById("city-name").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("feels-like").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `${data.main.humidity}%`;
    document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
    
    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    updateBackground(data.weather[0].main);
    weatherDisplay.classList.remove("hidden");
    cityInput.value = "";
}

function updateForecastUI(data) {
    forecastContainer.innerHTML = "";
    // Grab items for the next 3 days
    for (let i = 8; i <= 24; i += 8) {
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastHTML = `
            <div class="forecast-item">
                <p class="forecast-day">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="icon">
                <p>${Math.round(dayData.main.temp)}°C</p>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
    }
}

function updateBackground(condition) {
    const body = document.body;
    let color = "";
    switch (condition) {
        case "Clear": color = "linear-gradient(135deg, #f7b733, #fc4a1a)"; break;
        case "Rain": 
        case "Drizzle": color = "linear-gradient(135deg, #616161, #9bc5c3)"; break;
        case "Clouds": color = "linear-gradient(135deg, #757f9a, #d7dde8)"; break;
        case "Snow": color = "linear-gradient(135deg, #83a4d4, #b6fbff)"; break;
        default: color = "linear-gradient(135deg, #00b4db, #0083b0)";
    }
    body.style.background = color;
}
