const API_KEY = '44d0589fb95647e7bbd164754240710'; // Replace with your actual WeatherAPI key
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

let debounceTimer;
let lastValidCity = "Cairo"; // Store the last valid city

// Remove the getUserLocationAndWeather function

// Call this function when the page loads with a default city
document.addEventListener('DOMContentLoaded', () => getWeatherData(lastValidCity));

cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const city = cityInput.value.trim();
        if (city.length > 2) {
            getWeatherData(city);
        } else if (city.length === 0) {
            // If input is empty, use the last valid city
            getWeatherData(lastValidCity);
        } else {
            // Do nothing if input length is 1 or 2 characters
            // This prevents the weather display from disappearing for short inputs
        }
    }, 300); // Wait for 300ms after the user stops typing
});

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        displayWeatherData(data);
        lastValidCity = location; // Update the last valid city
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Don't hide the weather result if there's an error, keep showing the last valid data
    }
}

function displayWeatherData(data) {
    const { location, current, forecast } = data;
    
    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    
    // Display current date and time
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
    
    // Set time icon
    setTimeIcon(now.getHours());
    
    // Yesterday's weather (current day)
    updateDayWeather('yesterday', forecast.forecastday[0], current, true);
    
    // Today's weather
    updateDayWeather('today', forecast.forecastday[1], null, false);
    
    // Tomorrow's weather
    updateDayWeather('tomorrow', forecast.forecastday[2], null, false);
    
    weatherResult.classList.remove('d-none');
}

function updateDayWeather(day, forecastData, currentData = null, isCurrentDay = false) {
    const dayElement = document.getElementById(`${day}Date`).closest('.weather-day');
    const iconElement = document.getElementById(`${day}Icon`);
    const tempElement = document.getElementById(`${day}Temp`);
    const descElement = document.getElementById(`${day}Desc`);
    const dateElement = document.getElementById(`${day}Date`);
    
    const date = new Date(forecastData.date);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateElement.textContent = date.toLocaleDateString('en-US', options);
    
    iconElement.src = `https:${forecastData.day.condition.icon}`;
    
    if (isCurrentDay && currentData) {
        tempElement.textContent = `${currentData.temp_c}°C`;
        descElement.textContent = currentData.condition.text;
        document.getElementById('humidity').textContent = `Humidity: ${currentData.humidity}%`;
        document.getElementById('windSpeed').textContent = `Wind: ${currentData.wind_kph} km/h`;
        document.getElementById('feelsLike').textContent = `Feels like: ${currentData.feelslike_c}°C`;
        document.getElementById('uv').textContent = `UV Index: ${currentData.uv}`;
    } else {
        tempElement.textContent = `${forecastData.day.avgtemp_c}°C`;
        descElement.textContent = forecastData.day.condition.text;
    }
    
    // Add or remove the 'current-day' class based on whether it's the current day
    dayElement.classList.toggle('current-day', isCurrentDay);
}

function setTimeIcon(hour) {
    const timeIcon = document.getElementById('timeIcon');
    if (hour >= 6 && hour < 18) {
        timeIcon.className = 'fas fa-sun';
    } else if (hour >= 18 && hour < 20) {
        timeIcon.className = 'fas fa-sunset';
    } else {
        timeIcon.className = 'fas fa-moon';
    }
}

// Optional: Implement sign-up functionality
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Add new user
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    
    // Close signup modal and open login modal
    const signupModalInstance = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    signupModalInstance.hide();
    const loginModalInstance = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModalInstance.show();
});

// Login functionality
function initializeLoginFunctionality() {
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if user exists
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login successful
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateUIForLoggedInUser(user);
                closeLoginModal();
                showSuccessToast('Login successful!');
            } else {
                // Login failed
                showLoginMessage('Invalid email or password', 'danger');
            }
        });
    } else {
        console.error('Login form not found');
    }
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData(lastValidCity);
    initializeLoginFunctionality();
    
    // Check if user is logged in on page load
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});

function showLoginMessage(message, type) {
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = `alert alert-${type}`;
        loginMessage.style.display = 'block';
    }
}

function updateUIForLoggedInUser(user) {
    const navbarLoginItem = document.querySelector('.nav-item:has(.nav-link[data-bs-target="#loginModal"])');
    if (navbarLoginItem) {
        navbarLoginItem.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Welcome, ${user.name}
                </a>
                <ul class="dropdown-menu" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#" id="signOutButton">Sign Out</a></li>
                </ul>
            </div>
        `;
        const signOutButton = document.getElementById('signOutButton');
        if (signOutButton) {
            signOutButton.addEventListener('click', signOut);
        }
    }
}

function signOut(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    location.reload();
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const modal = bootstrap.Modal.getInstance(loginModal);
        if (modal) {
            modal.hide();
        }
    }
}

function showSuccessToast(message) {
    const toastElement = document.getElementById("successToast");
    if (toastElement) {
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) {
            toastBody.textContent = message;
        }
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
}
