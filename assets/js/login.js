document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    console.log('Attempting login for:', email); // Debug log
    console.log('Stored users:', users); // Debug log
    
    // Check if user exists
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        console.log('Login successful for:', user); // Debug log
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedInUser(user);
        closeLoginModal();
        showSuccessToast('Login successful!');
    } else {
        console.log('Login failed'); // Debug log
        // Login failed
        showLoginMessage('Invalid email or password', 'danger');
    }
}

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
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
