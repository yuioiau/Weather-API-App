document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
    } else {
        displayWelcomeMessage(currentUser.name);
    }
}

function displayWelcomeMessage(name) {
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = name;
    } else {
        console.error("Element with id 'username' not found");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}