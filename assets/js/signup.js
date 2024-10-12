document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupMessage = document.getElementById('signupMessage');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            signup();
        });
    }

    if (signupName) signupName.addEventListener('blur', validateName);
    if (signupEmail) signupEmail.addEventListener('blur', validateEmail);
    if (signupPassword) signupPassword.addEventListener('blur', validatePassword);
});

function validateName() {
    const signupName = document.getElementById('signupName');
    if (signupName.value.trim() === "") {
        showInputError(signupName, "Name is required.");
        return false;
    }
    const nameRegex = /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s]{2,}$/;
    if (!nameRegex.test(signupName.value)) {
        showInputError(signupName, "Please enter a valid name.");
        return false;
    }
    showInputSuccess(signupName);
    return true;
}

function validateEmail() {
    const signupEmail = document.getElementById('signupEmail');
    if (signupEmail.value.trim() === "") {
        showInputError(signupEmail, "Email is required.");
        return false;
    }
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(signupEmail.value)) {
        showInputError(signupEmail, "Please enter a valid email address.");
        return false;
    }
    showInputSuccess(signupEmail);
    return true;
}

function validatePassword() {
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword.value.trim() === "") {
        showInputError(signupPassword, "Password is required.");
        return false;
    }
    if (signupPassword.value.length < 8) {
        showInputError(signupPassword, "Password must be at least 8 characters long.");
        return false;
    }
    const strength = checkPasswordStrength(signupPassword.value);
    if (strength < 3) {
        showInputError(signupPassword, "Password is too weak. It should contain uppercase, lowercase, numbers, and special characters.");
        return false;
    }
    showInputSuccess(signupPassword);
    return true;
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
}

function showInputError(input, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.textContent = message;
    }
}

function showInputSuccess(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
}

function signup() {
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupMessage = document.getElementById('signupMessage');

    if (validateName() && validateEmail() && validatePassword()) {
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check for existing email
        if (users.some(user => user.email.toLowerCase() === signupEmail.value.toLowerCase())) {
            showSignupMessage("This email is already registered.", "danger");
            return;
        }

        // Proceed with registration
        let newUser = {
            name: signupName.value,
            email: signupEmail.value,
            password: signupPassword.value,
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Log the user in
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // Show success message
        showSignupMessage("Signup successful! You are now logged in.", "success");

        // Clear the form
        signupForm.reset();

        // Close the signup modal
        const signupModalInstance = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        if (signupModalInstance) {
            signupModalInstance.hide();
        }

        // Update UI for logged-in user
        updateUIForLoggedInUser(newUser);
    }
}

function showSignupMessage(message, type) {
    const signupMessage = document.getElementById('signupMessage');
    if (signupMessage) {
        signupMessage.textContent = message;
        signupMessage.className = `alert alert-${type}`;
        signupMessage.style.display = 'block';
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
