const apiKey = CONFIG.WEATHER_API_KEY;

// 1. 3D Tilt Effect
document.addEventListener("mousemove", (e) => {
    const tiles = document.querySelectorAll(".tile");
    // Calculate rotation based on mouse position relative to center
    const xAxis = (window.innerWidth / 2 - e.pageX) / 40; 
    const yAxis = (window.innerHeight / 2 - e.pageY) / 40;

    tiles.forEach(tile => {
        tile.style.transform = `rotateY(${-xAxis}deg) rotateX(${yAxis}deg)`;
    });
});

// 2. Search Logic
document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("city-input").value.trim();
    if (city) fetchWeather(city);
});

async function fetchWeather(city) {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
    try {
        const [currRes, foreRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
        if (!currRes.ok) throw new Error("City not found");

        const curr = await currRes.json();
        const fore = await foreRes.json();

        updateUI(curr, fore);
        updateAtmosphere(curr.weather[0].main);
    } catch (err) {
        alert(err.message);
    }
}

// 3. Update Atmosphere (The "Liquid" shift)
function updateAtmosphere(condition) {
    const b1 = document.getElementById("blob-1");
    const b2 = document.getElementById("blob-2");
    const b3 = document.getElementById("blob-3");

    const themes = {
        Clear: ["#f59e0b", "#ef4444", "#3b82f6"],
        Rain: ["#1e293b", "#334155", "#0f172a"],
        Clouds: ["#64748b", "#94a3b8", "#1e293b"],
        Snow: ["#e2e8f0", "#94a3b8", "#f8fafc"],
        Thunderstorm: ["#4c1d95", "#1e1b4b", "#000000"]
    };

    const colors = themes[condition] || themes.Clear;
    b1.style.background = colors[0];
    b2.style.background = colors[1];
    b3.style.background = colors[2];
}

// 4. Update UI
function updateUI(curr, fore) {
    document.getElementById("city-name").innerText = curr.name;
    document.getElementById("temp").innerText = `${Math.round(curr.main.temp)}°`;
    document.getElementById("humidity").innerText = `${curr.main.humidity}%`;
    document.getElementById("humidity-bar").style.width = `${curr.main.humidity}%`;
    document.getElementById("wind").innerText = `${Math.round(curr.wind.speed)} km/h`;
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

    document.getElementById("weather-display").classList.remove("hidden");
}
