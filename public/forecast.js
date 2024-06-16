if (!window.location.href.includes("?#")) {
    // Append "?#" to the URL
    window.location.href += "?#";
}

const apiKey = "3324f9601a1befeeeb630abdd2e7665f";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?&q=";
const apiUrl1 = "https://api.openweathermap.org/data/2.5/weather?&q=";
const apiUrl2 = "https://api.open-meteo.com/v1/forecast?daily=weather_code,temperature_2m_max,apparent_temperature_max&past_days=7";

const searchBox = document.querySelector('form input');
const searchBtn = document.querySelector("form button");

async function checkWeather(city) {
    console.log("checkWeather function called with city:", city);
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();

        const response1 = await fetch(apiUrl1 + city + `&appid=${apiKey}`);
        const data1 = await response1.json();
        const lat = data1.coord.lat;
        const lon = data1.coord.lon;
        const response2 = await fetch(apiUrl2 + `&latitude=${lat}` + `&longitude=${lon}`);
        const data2 = await response2.json();

        // Store the data in localStorage
        localStorage.setItem('weatherData', JSON.stringify({ forecast: data, current: data1, past: data2 }));
        localStorage.setItem('weatherCity', city);

        updateWeatherUI(city, data, data1, data2);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(city, data, data1, data2) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const today = days[date.getDay()];
    document.querySelectorAll(".days").forEach(element => {
        element.innerHTML = today;
    });

    for (let i = 0; i <= 3; i++) {
        const firstDtTxt = data.list[i].dt_txt;
        const timeOnly = firstDtTxt.split(" ")[1].slice(0, -3); // Extracting hours and minutes and removing seconds
        const [time, period] = timeOnly.split(":");
        let hour = parseInt(time, 10);
        // Convert hour to 12-hour format and set period (AM/PM)
        hour = (hour % 12) || 12;
        const timeIn12HourFormat = `${hour}:${timeOnly.slice(-2)} ${hour < 12 ? 'AM' : 'PM'}`;

        document.querySelector(".time" + (i + 1)).innerHTML = timeIn12HourFormat;
        document.querySelector(".temps" + (i + 1)).innerHTML = Math.round(data.list[i].main.temp - 273.15) + "°";
        document.querySelector(".feels_like" + (i + 1)).innerHTML = Math.round(data.list[i].main.feels_like - 273.15) + "°";
        document.querySelector(".wind" + (i + 1)).innerHTML = Math.round(data.list[i].wind.speed * 3.6) + " km/h";
        document.querySelector(".clouds" + (i + 1)).innerHTML = data.list[i].clouds.all + "%";
        document.querySelector(".description" + (i + 1)).innerHTML = data.list[i].weather[0].description;

        const cloudIcon = getCloudIcon(data.list[i].weather[0].description);
        const cloudElement = document.querySelector('.cloud' + (i));
        if (cloudElement) {
            cloudElement.src = cloudIcon;
        }
    }

    const weatherDescriptions = {
        0: "Clear sky",
        1: "Clear sky",
        2: "cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        52: "Drizzle",
        53: "Drizzle",
        56: "Freezing Drizzle",
        57: "Freezing Drizzle",
        61: "Rain",
        62: "Rain",
        63: "Rain",
        66: "Freezing Rain",
        67: "Freezing Rain",
        71: "Snow fall",
        72: "Snow fall",
        73: "Snow fall",
        77: "Snow grains",
        80: "Rain showers",
        82: "Rain showers",
        85: "Snow showers",
        86: "Snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"
    };

    for (let i = 1; i <= 7; i++) {
        document.querySelector(".forecasttemp" + i).innerHTML = Math.round(data2.daily.temperature_2m_max[i]) + "°";
        document.querySelector(".forefeels_like" + i).innerHTML = "/" + Math.round(data2.daily.apparent_temperature_max[i]);
        document.querySelector(".desc" + i).innerHTML = weatherDescriptions[data2.daily.weather_code[i]];
        const cloudIcon2 = getIcon(weatherDescriptions[data2.daily.weather_code[i]]);

        const cloudElement2 = document.querySelector('.cloudicon' + (i));
        if (cloudElement2) {
            cloudElement2.src = cloudIcon2;
        }
    }
}

function getIcon(weatherDescription) {
    switch (weatherDescription) {
        case "Drizzle":
        case "Rain":
        case "Rain showers":
            return 'Images/icons/rain.png';

        case "Snow":
        case "Freezing Drizzle":
        case "Freezing Rain":
        case "Snow grains":
            return 'Images/icons/snow.png';  // Snow
        case "Overcast":
        case "cloudy":
        case "Fog":
            return 'Images/icons/cloudy.png';  // Overcast

        case "Thunderstorm":
            return 'Images/icons/thunder.png';  // Partly cloudy

        case "Clear sky":
            return 'Images/icons/sunny.png';
        default:
            return 'Images/icons/sunny.png';
    }
}

function getCloudIcon(weatherDescription) {
    switch (weatherDescription) {
        case "light rain":
        case "Rain":
        case "moderate rain":
            return 'Images/Rain.png';

        case "Snow":
        case "light snow":
            return 'Images/Snow.png';  // Snow
        case "overcast clouds":
        case "scattered clouds":
            return 'Images/Overcast_cloud.png';  // Overcast

        case "Cloudy":
        case "broken clouds":
        case "few clouds":
            return 'Images/Broken_cloud.png';  // Partly cloudy

        case "Sunny":
            return isNight() ? 'Images/moon.png' : 'Images/partial_sun.jpg';  // Sunny
        default:
            return 'Images/Sunny_cloud.png';  // Default
    }
}

function isNight() {
    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour > 18;  // Example night time check
}

// Load the weather data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedWeatherData = localStorage.getItem('weatherData');
    const storedWeatherCity = localStorage.getItem('weatherCity');
    if (storedWeatherData && storedWeatherCity) {
        const { forecast, current, past } = JSON.parse(storedWeatherData);
        updateWeatherUI(storedWeatherCity, forecast, current, past);
    }
});


// Load the selected city from localStorage on page load

document.addEventListener('DOMContentLoaded', () => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
        // Do something with the selected city
        checkWeather(storedCity);
    }
});




