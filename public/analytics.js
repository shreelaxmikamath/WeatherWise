if (!window.location.href.includes("?#")) {
    // Append "?#" to the URL
    window.location.href += "?#";
}

const apiKey = "3324f9601a1befeeeb630abdd2e7665f";
const apiUrl1 = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiUrl2 = "https://air-quality-api.open-meteo.com/v1/air-quality?current=pm10,ozone,dust,uv_index&domains=cams_global";

const searchBox = document.querySelector('form input');
const searchBtn = document.querySelector("form button");

async function checkWeather(city) {
    console.log("checkWeather function called with city:", city);
    try {
        const response1 = await fetch(apiUrl1 + city + `&appid=${apiKey}`);
        const data1 = await response1.json();
        if (!response1.ok) {
            throw new Error(data1.message);
        }
        const lat = data1.coord.lat;
        const lon = data1.coord.lon;
        const response2 = await fetch(apiUrl2 + `&latitude=${lat}&longitude=${lon}`);
        const data2 = await response2.json();
        if (!response2.ok) {
            throw new Error(data2.message);
        }
        
        const airQualityData = {
            city: city,
            uv: data2.current.uv_index,
            dust: data2.current.dust,
            ozone: data2.current.ozone,
            pm10: data2.current.pm10
        };
        
        // Store the air quality data in localStorage
        localStorage.setItem('airQualityData', JSON.stringify(airQualityData));
        
        updateAirQualityDisplay(airQualityData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateAirQualityDisplay(data) {
    document.querySelector(".aircity").innerHTML = data.city;
    document.querySelector(".uv").innerHTML = data.uv;
    document.querySelector(".dust").innerHTML = data.dust + " μg/m³";
    document.querySelector(".ozone").innerHTML = data.ozone + " μg/m³";
    document.querySelector(".pm").innerHTML = data.pm10 + " μg/m³";
}

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    checkWeather(searchBox.value);
});

document.addEventListener('DOMContentLoaded', () => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
        checkWeather(storedCity);
    } 
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to update analytics based on current settings
    function updateAnalytics() {
        const temperatureUnit = localStorage.getItem('temperatureUnit');
        const windSpeedUnit = localStorage.getItem('windSpeedUnit');

        // Example logic based on chosen units
        console.log(`Analytics updated: Temperature unit - ${temperatureUnit}, Wind speed unit - ${windSpeedUnit}`);
        
        // Update your analytics here with the selected units
        // Replace this with your actual analytics integration
        // Example: 
        // analytics.track('Temperature Unit Changed', { unit: temperatureUnit });
        // analytics.track('Wind Speed Unit Changed', { unit: windSpeedUnit });
    }

    // Initial call to update based on current settings
    updateAnalytics();

    // Listen for changes in settings.js and update analytics accordingly
    document.addEventListener('settingsChanged', () => {
        updateAnalytics();
    });
});
