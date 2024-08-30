if (!window.location.href.includes("?#")) {
    // Append "?#" to the URL
    window.location.href += "?#";
}

const apiKey = "3324f9601a1befeeeb630abdd2e7665f";
const apiUrl = "https://tile.openweathermap.org/map/";

const cloudsBtn = document.querySelector(".clouds-btn");
const precipitationBtn = document.querySelector(".precipitation-btn");
const SealevelpressureBtn = document.querySelector(".Sealevelpressure-btn");
const windspeedBtn = document.querySelector(".windspeed-btn");
const temperatureBtn = document.querySelector(".temperature-btn");

async function fetchData(layer) {
    try {
        const response = await fetch(apiUrl + layer + "/0/0/0.png?appid=" + apiKey);
        const imageURL = response.url;
        return imageURL;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function displayImage(layer) {
    try {
        const imageUrl = await fetchData(layer);
        if (imageUrl) {
            const img = document.querySelector(".img-fluid");
            img.src = imageUrl;
            localStorage.setItem('selectedLayer', layer); // Store the selected layer in localStorage
        } else {
            console.error("Failed to fetch image.");
        }
    } catch (error) {
        console.error("Error displaying image:", error);
    }
}

function updateCloudIcon(temperature) {
    const cloudIcon = getCloudIcon(temperature);
    document.getElementById('cloud').src = cloudIcon;
}

cloudsBtn.addEventListener("click", () => displayImage("clouds_new"));
precipitationBtn.addEventListener("click", () => displayImage("precipitation_new"));
SealevelpressureBtn.addEventListener("click", () => displayImage("pressure_new"));
windspeedBtn.addEventListener("click", () => displayImage("wind_new"));
temperatureBtn.addEventListener("click", () => displayImage("temp_new"));


