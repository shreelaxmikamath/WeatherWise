if (!window.location.href.includes("?#")) {
    // Append "?#" to the URL
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

        // Store the data in localStorage
        localStorage.setItem('weatherData', JSON.stringify(data));
        localStorage.setItem('weatherCity', city);

        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(data) {
    const tempUnit = localStorage.getItem('temperatureUnit') || 'Celsius';
    const tempC = data.main.temp - 273.15;
    const feelsLikeC = data.main.feels_like - 273.15;

    const temp = tempUnit === 'Fahrenheit' ? celsiusToFahrenheit(tempC) : tempC;
    const feelsLike = tempUnit === 'Fahrenheit' ? celsiusToFahrenheit(feelsLikeC) : feelsLikeC;
    const tempUnitSymbol = tempUnit === 'Fahrenheit' ? '°F' : '°C';

    document.querySelector(".city").innerHTML = data.name;
    document.querySelectorAll(".temp").forEach(element => element.innerHTML = Math.round(temp) + tempUnitSymbol);
    document.querySelectorAll(".feels_like").forEach(element => element.innerHTML = Math.round(data.main.feels_like - 273.15) + "°c");
    document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
    document.querySelector(".humidity").innerHTML = data.main.humidity;
    document.querySelector(".description").innerHTML = data.clouds.all + " %";
    document.querySelector(".time").innerHTML = "Updates As Of " + new Date().toLocaleTimeString();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const today = days[date.getDay()];
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();

    document.querySelector(".day").innerHTML = today + ", " + month + " " + day;
    const tempCelsius = Math.round(data.main.temp - 273.15);
    updateWeatherImage(tempCelsius);
    updateCloudIcon(tempCelsius);
}

function getWeatherImage(temperature) {
    if (temperature <= -10) {
        return 'Images/Extreme_cold.jpg';  // Extremely cold
    } else if (temperature > -10 && temperature <= 0) {
        return 'Images/Freezing.jpg';  // Freezing
    } else if (temperature > 0 && temperature <= 10) {
        return 'Images/Cold.jpg';  // Cold
    } else if (temperature > 10 && temperature <= 20) {
        return 'Images/Cool.jpg';  // Cool
    } else if (temperature > 20 && temperature <= 30) {
        return 'Images/Warm.jpg';  // Warm
    } else if (temperature > 30 && temperature <= 40) {
        return 'Images/Hot.jpg';  // Hot
    } else {
        return 'Images/Extreme_hot.jpg';  // Extremely hot
    }
}

function isNight() {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6;
}

function getCloudIcon(temperature) {
    if (temperature <= -10) {
        return 'Images/Snow.png';  // Snow
    } else if (temperature > -10 && temperature <= 0) {
        return 'Images/Overcast_cloud.png';  // Snow
    } else if (temperature > 0 && temperature <= 10) {
        return 'Images/Rain.png';  // Cloudy
    } else if (temperature > 10 && temperature <= 20) {
        return 'Images/Broken_cloud.png';  // Partly cloudy
    } else if (temperature > 20 && temperature <= 30) {
        if (isNight()) {
            return 'Images/moon.png';  // Sunny
        } else {
            return 'Images/partial_sun.jpg';  // Sunny
        }
    } else if (temperature > 30 && temperature <= 40) {
        if (isNight()) {
            return 'Images/hotmoon.png';  // Sunny
        } else {
            return 'Images/Sunny_cloud.png';  // Sunny
        }
    } else {
        if (isNight()) {
            return 'Images/halfmoon.png';  // Sunny
        }
        return 'Images/Sun_extreme.png'; // Extremely hot
    }
}

function updateWeatherImage(temperature) {
    const weatherImage = getWeatherImage(temperature);
    document.getElementById('weather-image').src = weatherImage;
}

function updateCloudIcon(temperature) {
    const cloudIcon = getCloudIcon(temperature);
    document.getElementById('cloud-icon').src = cloudIcon;
}


function celsiusToFahrenheit(tempC) {
    return (tempC * 9/5) + 32;
}

function fahrenheitToCelsius(tempF) {
    return (tempF - 32) * 5/9;
}


// Event listener for search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim(); // Trim any leading/trailing whitespace
    if (city) {
        localStorage.setItem('selectedCity', city); // Store the selected city in localStorage
        checkWeather(city); // Perform weather check for the selected city
    } else {
        console.error("City name is empty.");
    }
});

// Load the selected city from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
        searchBox.value = storedCity; // Set the value of the search box to the stored city
        checkWeather(storedCity); // Perform weather check for the stored city
    }
});

