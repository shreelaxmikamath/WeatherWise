document.addEventListener('DOMContentLoaded', () => {
    // Temperature Unit
    const temperatureUnitSelect = document.getElementById('temperatureUnit');
    const saveTemperatureSettingsButton = document.getElementById('saveSettings');
    const currentTemperatureUnit = localStorage.getItem('temperatureUnit') || 'Celsius';
    temperatureUnitSelect.value = currentTemperatureUnit;
    
    saveTemperatureSettingsButton.addEventListener('click', () => {
        const selectedTemperatureUnit = temperatureUnitSelect.value;
        localStorage.setItem('temperatureUnit', selectedTemperatureUnit);
        updateWeatherDisplay();
        alert('Temperature settings saved successfully!');
    });

    // Wind Speed Unit
    const windUnitSelect = document.getElementById('windUnit');
    const saveWindSettingsButton = document.getElementById('saveWindSettings');
    const currentWindUnit = localStorage.getItem('windUnit') || 'm/s';
    windUnitSelect.value = currentWindUnit;
    
    saveWindSettingsButton.addEventListener('click', () => {
        const selectedWindUnit = windUnitSelect.value;
        localStorage.setItem('windUnit', selectedWindUnit);
        updateWeatherDisplay();
        alert('Wind speed settings saved successfully!');
    });

    // Humidity Unit
    const humidityUnitSelect = document.getElementById('humidity-unit');
    const saveHumiditySettingsButton = document.getElementById('saveHumiditySettings');
    const currentHumidityUnit = localStorage.getItem('humidityUnit') || 'percentage';
    humidityUnitSelect.value = currentHumidityUnit;
    
    saveHumiditySettingsButton.addEventListener('click', () => {
        const selectedHumidityUnit = humidityUnitSelect.value;
        localStorage.setItem('humidityUnit', selectedHumidityUnit);
        updateWeatherDisplay();
        alert('Humidity settings saved successfully!');
    });

    // Time Format
    const timeFormatSelect = document.getElementById('timeFormat');
    const saveTimeSettingsButton = document.getElementById('saveTimeSettings');
    const currentTimeFormat = localStorage.getItem('timeFormat') || '24-hour';
    timeFormatSelect.value = currentTimeFormat;
    
    saveTimeSettingsButton.addEventListener('click', () => {
        const selectedTimeFormat = timeFormatSelect.value;
        localStorage.setItem('timeFormat', selectedTimeFormat);
        updateWeatherDisplay();
        alert('Time format settings saved successfully!');
    });

    // Function to update weather display after settings change
    function updateWeatherDisplay() {
        const storedWeatherData = localStorage.getItem('weatherData');
        if (storedWeatherData) {
            const weatherData = JSON.parse(storedWeatherData);
            updateWeatherUI(weatherData);
        }
    }

    // Function to update weather UI (simplified version, actual implementation in home.js)
    function updateWeatherUI(data) {
        // This function should be implemented in home.js
        // Here, we're just dispatching a custom event that home.js can listen for
        const event = new CustomEvent('weatherSettingsChanged', { detail: data });
        document.dispatchEvent(event);
    }
});