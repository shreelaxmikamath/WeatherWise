document.addEventListener('DOMContentLoaded', () => {
    // Create the loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100vw';
    loadingScreen.style.height = '100vh';
    loadingScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingScreen.style.display = 'flex';
    loadingScreen.style.justifyContent = 'center';
    loadingScreen.style.alignItems = 'center';
    loadingScreen.style.zIndex = '9999';
    loadingScreen.style.overflow = 'hidden';
    loadingScreen.style.transition = 'opacity 5s';
    loadingScreen.style.opacity = '1';
    loadingScreen.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            <img src="../Images/icons/loading.gif" alt="Loading..." style="width: 100%; height: 100%; object-fit: cover;">
            <p style="position: absolute; bottom: 20px; color: black; font-size: 16px; background: rgba(255, 255, 255, 0.5); padding: 5px;">Loading, please wait...</p>
        </div>
    `;
    document.body.appendChild(loadingScreen);

    // Hide the loading screen after the window has loaded
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    });

    // Load the selected city from localStorage on page load
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
        searchBox.value = storedCity;
        checkWeather(storedCity);
    }
});

if (!window.location.href.includes("?#")) {
    window.location.href += "?#";
}

const apiKey = "3324f9601a1befeeeb630abdd2e7665f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";

const searchBox = document.querySelector('form input');
const searchBtn = document.querySelector("form button");

async function checkWeather(city) {
    console.log("checkWeather function called with city:", city);
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        var data = await response.json();
        localStorage.setItem('weatherData', JSON.stringify(data));
        localStorage.setItem('weatherCity', city);
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(data) {
    const tempUnit = localStorage.getItem('temperatureUnit') || 'Celsius';
    const windUnit = localStorage.getItem('windUnit') || 'm/s';
    const humidityUnit = localStorage.getItem('humidityUnit') || 'percentage';
    const timeFormat = localStorage.getItem('timeFormat') || '24-hour';

    const tempK = data.main.temp;
    const feelsLikeK = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;

    let temp, feelsLike, tempUnitSymbol;
    let windSpeedConverted, windUnitSymbol;
    let humidityConverted, humidityUnitSymbol;

    // Temperature conversion
    switch (tempUnit) {
        case 'Fahrenheit':
            temp = kelvinToFahrenheit(tempK);
            feelsLike = kelvinToFahrenheit(feelsLikeK);
            tempUnitSymbol = '°F';
            break;
        case 'Kelvin':
            temp = tempK;
            feelsLike = feelsLikeK;
            tempUnitSymbol = 'K';
            break;
        default: // Celsius
            temp = kelvinToCelsius(tempK);
            feelsLike = kelvinToCelsius(feelsLikeK);
            tempUnitSymbol = '°C';
    }

    // Wind speed conversion
    switch (windUnit) {
        case 'km/h':
            windSpeedConverted = windSpeed * 3.6;
            windUnitSymbol = 'km/h';
            break;
        case 'mph':
            windSpeedConverted = windSpeed * 2.237;
            windUnitSymbol = 'mph';
            break;
        default: // m/s
            windSpeedConverted = windSpeed;
            windUnitSymbol = 'm/s';
    }

    // Humidity conversion
    switch (humidityUnit) {
        case 'absolute':
            humidityConverted = (humidity / 100) * 0.02;
            humidityUnitSymbol = 'kg/m³';
            break;
        default: // percentage
            humidityConverted = humidity;
            humidityUnitSymbol = '%';
    }

    // Update UI elements
    document.querySelector(".city").innerHTML = data.name;
    document.querySelectorAll(".temp").forEach(element => element.innerHTML = Math.round(temp) + tempUnitSymbol);
    document.querySelectorAll(".feels_like").forEach(element => element.innerHTML = Math.round(feelsLike) + tempUnitSymbol);
    document.querySelector(".wind").innerHTML = windSpeedConverted.toFixed(1) + " " + windUnitSymbol;
    document.querySelector(".humidity").innerHTML = humidityConverted.toFixed(2) + " " + humidityUnitSymbol;
    document.querySelector(".description").innerHTML = data.clouds.all + " %";

    // Update time and date
    const now = new Date();
    const timeString = formatTime(now, timeFormat);
    document.querySelector(".time").innerHTML = "Updates As Of " + timeString;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    document.querySelector(".day").innerHTML = today + ", " + month + " " + day;

    // Update weather image and cloud icon
    const tempCelsius = kelvinToCelsius(tempK);
    updateWeatherImage(tempCelsius);
    updateCloudIcon(tempCelsius);
}

function formatTime(date, format) {
    if (format === '12-hour') {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    }
}

function getWeatherImage(temperature) {
    if (temperature <= -10) return 'Images/Extreme_cold.jpg';
    if (temperature <= 0) return 'Images/Freezing.jpg';
    if (temperature <= 10) return 'Images/Cold.jpg';
    if (temperature <= 20) return 'Images/Cool.jpg';
    if (temperature <= 30) return 'Images/Warm.jpg';
    if (temperature <= 40) return 'Images/Hot.jpg';
    return 'Images/Extreme_hot.jpg';
}

function isNight() {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
}

function getCloudIcon(temperature) {
    if (temperature <= -10) return 'Images/Snow.png';
    if (temperature <= 0) return 'Images/Overcast_cloud.png';
    if (temperature <= 10) return 'Images/Rain.png';
    if (temperature <= 20) return 'Images/Broken_cloud.png';
    if (temperature <= 30) return isNight() ? 'Images/moon.png' : 'Images/Sunny_cloud.png';
    if (temperature <= 40) return isNight() ? 'Images/hotmoon.png' : 'Images/Sunny_cloud.png';
    return isNight() ? 'Images/halfmoon.png' : 'Images/Sun_extreme.png';
}

function updateWeatherImage(temperature) {
    document.getElementById('weather-image').src = getWeatherImage(temperature);
}

function updateCloudIcon(temperature) {
    document.getElementById('cloud-icon').src = getCloudIcon(temperature);
}

function kelvinToCelsius(tempK) {
    return tempK - 273.15;
}

function kelvinToFahrenheit(tempK) {
    return (tempK - 273.15) * 9/5 + 32;
}

// Event listener for search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        localStorage.setItem('selectedCity', city);
        checkWeather(city);
    } else {
        console.error("City name is empty.");
    }
});

// Listen for changes in weather settings
document.addEventListener('weatherSettingsChanged', (event) => {
    console.log('Weather settings changed event received');
    const weatherData = JSON.parse(localStorage.getItem('weatherData'));
    if (weatherData) {
        updateWeatherUI(weatherData);
    }
});