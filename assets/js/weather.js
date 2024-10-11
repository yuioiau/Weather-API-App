const API_KEY = '44d0589fb95647e7bbd164754240710'; // Replace with your actual WeatherAPI key
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

let debounceTimer;

cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const city = cityInput.value.trim();
        if (city.length > 2) {
            getWeatherData(city);
        } else {
            weatherResult.classList.add('d-none');
        }
    }, 300); // Wait for 300ms after the user stops typing
});

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherResult.classList.add('d-none');
    }
}

function displayWeatherData(data) {
    const { location, current, forecast } = data;
    
    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    
    // Yesterday's weather (using today's data as an approximation)
    updateDayWeather('yesterday', forecast.forecastday[0]);
    
    // Today's weather
    updateDayWeather('today', forecast.forecastday[1], current);
    
    // Tomorrow's weather
    updateDayWeather('tomorrow', forecast.forecastday[2]);
    
    weatherResult.classList.remove('d-none');
}

function updateDayWeather(day, forecastData, currentData = null) {
    const iconElement = document.getElementById(`${day}Icon`);
    const tempElement = document.getElementById(`${day}Temp`);
    const descElement = document.getElementById(`${day}Desc`);
    
    iconElement.src = `https:${forecastData.day.condition.icon}`;
    tempElement.textContent = `${forecastData.day.avgtemp_c}°C`;
    descElement.textContent = forecastData.day.condition.text;
    
    if (day === 'today' && currentData) {
        document.getElementById('humidity').textContent = `Humidity: ${currentData.humidity}%`;
        document.getElementById('windSpeed').textContent = `Wind: ${currentData.wind_kph} km/h`;
        document.getElementById('feelsLike').textContent = `Feels like: ${currentData.feelslike_c}°C`;
        document.getElementById('uv').textContent = `UV Index: ${currentData.uv}`;
    }
}

// Optional: Implement sign-up functionality
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Here you would typically send this data to a server
    console.log('Sign up:', { name, email, password });
    alert('Sign up successful!');
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    modal.hide();
});