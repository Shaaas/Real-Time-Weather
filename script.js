const apiKey = CONFIG.WEATHER_API_KEY;
let currentUnit = 'metric'; // 'metric' = C, 'imperial' = F

// 1. Interactive 3D Tilt
document.addEventListener("mousemove", (e) => {
    const tiles = document.querySelectorAll(".tile");
    const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
    tiles.forEach(tile => {
        tile.style.transform = `rotateY(${-xAxis}deg) rotateX(${yAxis}deg)`;
    });
});

// 2. Unit Toggle Logic
const unitBtn = document.getElementById("unit-toggle");
unitBtn.addEventListener("click", () => {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitBtn.innerText = currentUnit === 'metric' ? '°C' : '°F';
    const lastCity = document.getElementById("city-name").innerText;
    if (lastCity && lastCity !== "Ready?") fetchWeather(lastCity);
});

// 3. Search Handler
document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("city-input").value.trim();
    if (city) fetchWeather(city);
});

async function fetchWeather(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${apiKey}`;
    
    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        if (!currRes.ok) throw new Error("Location not found");

        const curr = await currRes.json();
        const fore = await foreRes.json();

        updateUI(curr, fore);
        updateAtmosphere(curr.weather[0].main);
    } catch (err) {
        alert(err.message);
    }
}

function updateAtmosphere(condition) {
    const blobs = [document.getElementById("blob-1"), document.getElementById("blob-2"), document.getElementById("blob-3")];
    const themes = {
        Clear: ["#f59e0b", "#ef4444", "#3b82f6"],
        Rain: ["#0f172a", "#334155", "#1e293b"],
        Clouds: ["#475569", "#94a3b8", "#1e293b"],
        Snow: ["#f8fafc", "#cbd5e1", "#94a3b8"],
        Thunderstorm: ["#4c1d95", "#1e1b4b", "#020617"]
    };
    const colors = themes[condition] || themes.Clear;
    blobs.forEach((b, i) => b.style.background = colors[i]);
    
    // Update Favicon
    const icons = { Clear: "☀️", Rain: "🌧️", Clouds: "☁️", Snow: "❄️" };
    document.querySelector("link[rel='icon']").href = `https://fav.farm/${icons[condition] || "🌤️"}`;
}

function updateUI(curr, fore) {
    document.getElementById("city-name").innerText = curr.name;
    document.getElementById("temp").innerText = `${Math.round(curr.main.temp)}°`;
    document.getElementById("humidity").innerText = `${curr.main.humidity}%`;
    document.getElementById("humidity-bar").style.width = `${curr.main.humidity}%`;
    
    const unitLabel = currentUnit === 'metric' ? 'km/h' : 'mph';
    document.getElementById("wind").innerText = `${Math.round(curr.wind.speed)} ${unitLabel}`;
    
    // Wind Rotation
    const arrow = document.getElementById("wind-dir");
    arrow.innerText = "↑";
    arrow.style.transform = `rotate(${curr.wind.deg}deg)`;

    document.getElementById("description").innerText = curr.weather[0].description;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${curr.weather[0].icon}@4x.png`;
    
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    document.getElementById("local-date").innerText = new Date().toLocaleDateString('en-US', options);

    const container = document.getElementById("forecast-container");
    container.innerHTML = "";
    for (let i = 8; i <= 24; i += 8) {
        const d = fore.list[i];
        const day = new Date(d.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        container.innerHTML += `
            <div class="forecast-item">
                <p class="label">${day}</p>
                <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
                <p class="value" style="font-size: 1.4rem">${Math.round(d.main.temp)}°</p>
            </div>
        `;
    }
}
