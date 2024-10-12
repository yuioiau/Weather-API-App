const API_KEY = '44d0589fb95647e7bbd164754240710'; // Replace with your actual WeatherAPI key
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');

let debounceTimer;
let lastValidCity = "Cairo"; // Store the last valid city

// Remove the getUserLocationAndWeather function

// Call this function when the page loads with a default city
document.addEventListener('DOMContentLoaded', () => getWeatherData(lastValidCity));

// Add this at the beginning of the file, after other DOM content loaded listeners
document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weatherForm');
    if (weatherForm) {
        weatherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = cityInput.value.trim();
            if (city.length > 2) {
                getWeatherData(city);
            }
        });
    }
});

cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const city = cityInput.value.trim();
        if (city.length > 2) {
            getWeatherData(city);
        } else if (city.length === 0) {
            // If input is empty, use the last valid city
            getWeatherData(lastValidCity);
        }
    }, 300); // Wait for 300ms after the user stops typing
});

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=14&aqi=no`);
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
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
    
    setTimeIcon(now.getHours());
    
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    // Create a wrapper for horizontal scrolling
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'forecast-scroll-wrapper';
    forecastContainer.appendChild(scrollWrapper);

    // Current day (first day in the API response)
    const currentDay = createWeatherCard(forecast.forecastday[0], current, true);
    scrollWrapper.appendChild(currentDay);

    // Next 13 days
    for (let i = 1; i < forecast.forecastday.length; i++) {
        const card = createWeatherCard(forecast.forecastday[i], null, false);
        scrollWrapper.appendChild(card);
    }

    weatherResult.classList.remove('d-none');
}

function createWeatherCard(forecastData, currentData, isCurrentDay) {
    const card = document.createElement('div');
    card.className = `weather-card ${isCurrentDay ? 'current-day' : ''}`;

    const date = new Date(forecastData.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    card.innerHTML = `
        <h5>${dayName}</h5>
        <p>${monthDay}</p>
        <img src="https:${forecastData.day.condition.icon}" alt="${forecastData.day.condition.text}" class="weather-icon">
        <p class="temp">${isCurrentDay && currentData ? currentData.temp_c : forecastData.day.avgtemp_c}°C</p>
        <p class="desc">${forecastData.day.condition.text}</p>
        <div class="weather-details" style="display: none;">
            <p><i class="fas fa-tint"></i> ${forecastData.day.avghumidity}%</p>
            <p><i class="fas fa-wind"></i> ${forecastData.day.maxwind_kph} km/h</p>
            <p><i class="fas fa-sun"></i> UV: ${forecastData.day.uv}</p>
            <p><i class="fas fa-cloud-rain"></i> ${forecastData.day.daily_chance_of_rain}%</p>
            <p><i class="fas fa-temperature-high"></i> ${forecastData.day.maxtemp_c}°C</p>
            <p><i class="fas fa-temperature-low"></i> ${forecastData.day.mintemp_c}°C</p>
        </div>
        <button class="btn btn-link btn-sm mt-2 show-more">Show More</button>
        <button class="btn btn-link btn-sm mt-2 show-less" style="display: none;">Show Less</button>
    `;

    const showMoreBtn = card.querySelector('.show-more');
    const showLessBtn = card.querySelector('.show-less');
    const detailsDiv = card.querySelector('.weather-details');

    showMoreBtn.addEventListener('click', () => {
        detailsDiv.style.display = 'block';
        showMoreBtn.style.display = 'none';
        showLessBtn.style.display = 'inline-block';
    });

    showLessBtn.addEventListener('click', () => {
        detailsDiv.style.display = 'none';
        showMoreBtn.style.display = 'inline-block';
        showLessBtn.style.display = 'none';
    });

    return card;
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

// Add this new function at the end of the file
function addWheelScrolling() {
    const scrollWrapper = document.querySelector('.forecast-scroll-wrapper');
    scrollWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        scrollWrapper.scrollLeft += e.deltaY;
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData(lastValidCity);
    addWheelScrolling();
});
