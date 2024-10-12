let signupName = document.getElementById("signupName");
let signupEmail = document.getElementById("signupEmail");
let signupPassword = document.getElementById("signupPassword");
let messageElement = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validateName() {
  if (signupName.value.trim() === "") {
    showInputSuccess(signupName, nameError);
    return true;
  }
  const nameRegex = /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s]{2,}$/;
  if (!nameRegex.test(signupName.value)) {
    showInputError(signupName, nameError, "Please enter a valid name.");
    return false;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (
    users.some(
      (user) => user.name.toLowerCase() === signupName.value.toLowerCase()
    )
  ) {
    showInputError(signupName, nameError, "This name is already taken.");
    return false;
  }
  showInputSuccess(signupName, nameError);
  return true;
}

function validateEmail() {
  if (signupEmail.value.trim() === "") {
    showInputSuccess(signupEmail, emailError);
    return true;
  }
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(signupEmail.value)) {
    showInputError(
      signupEmail,
      emailError,
      "Please enter a valid email address."
    );
    return false;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (
    users.some(
      (user) => user.email.toLowerCase() === signupEmail.value.toLowerCase()
    )
  ) {
    showInputError(
      signupEmail,
      emailError,
      "This email is already registered."
    );
    return false;
  }
  showInputSuccess(signupEmail, emailError);
  return true;
}

function validatePassword() {
  if (signupPassword.value.trim() === "") {
    showInputError(signupPassword, passwordError, "Password is required.");
    return false;
  }
  const password = signupPassword.value;
  const strength = checkPasswordStrength(password);

  if (password.length < 8) {
    showInputError(
      signupPassword,
      passwordError,
      "Password must be at least 8 characters long."
    );
    return false;
  }

  if (strength < 3) {
    showInputError(
      signupPassword,
      passwordError,
      "Password is too weak. It should contain uppercase, lowercase, numbers, and special characters."
    );
    return false;
  }

  showInputSuccess(signupPassword, passwordError);
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

function showInputError(input, errorElement, message) {
  input.classList.remove("is-valid", "validating");
  input.classList.add("is-invalid");
  errorElement.textContent = message;
  errorElement.classList.remove("d-none");
}

function showInputSuccess(input, errorElement) {
  input.classList.remove("is-invalid", "validating");
  input.classList.add("is-valid");
  errorElement.classList.add("d-none");
}

function showInputValidating(input) {
  input.classList.remove("is-valid", "is-invalid");
  input.classList.add("validating");
}

function hideErrorIfEmpty(input, errorElement) {
  if (input.value === "") {
    input.classList.remove("is-valid", "is-invalid", "validating");
    errorElement.classList.add("d-none");
  }
}

signupName.addEventListener("input", () => {
  hideErrorIfEmpty(signupName, nameError);
  if (signupName.value !== "") {
    showInputValidating(signupName);
    validateName();
    checkExistingName();
  }
});

function checkExistingName() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (
    users.some(
      (user) => user.name.toLowerCase() === signupName.value.toLowerCase()
    )
  ) {
    showInputError(signupName, nameError, "Name is already taken.");
  }
}

signupEmail.addEventListener("input", () => {
  hideErrorIfEmpty(signupEmail, emailError);
  if (signupEmail.value !== "") {
    showInputValidating(signupEmail);
    validateEmail();
    checkExistingEmail();
  }
});

function checkExistingEmail() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (
    users.some(
      (user) => user.email.toLowerCase() === signupEmail.value.toLowerCase()
    )
  ) {
    showInputError(signupEmail, emailError, "Email is already registered.");
  }
}

signupPassword.addEventListener("input", () => {
  if (signupPassword.value === "") {
    resetInputStyle(signupPassword);
    passwordError.classList.add("d-none");
    const strengthContainer = document.querySelector(".password-strength");
    strengthContainer.style.display = "none";
  } else {
    showInputValidating(signupPassword);
    updatePasswordStrength();
    validatePassword();
  }
});

function signup() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Validate all fields first
  let isValid = validateName() && validateEmail() && validatePassword();

  if (!isValid) {
    return;
  }

  // Check for existing email
  if (users.some(user => user.email.toLowerCase() === signupEmail.value.toLowerCase())) {
    showInputError(signupEmail, emailError, "This email is already registered.");
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
  
  console.log('New user registered:', newUser); // Debug log
  console.log('Updated users list:', JSON.parse(localStorage.getItem('users'))); // Debug log
  
  // Log the user in
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  // Show success toast
  showSuccessToast();

  // Clear the form
  clearForm();

  // Close the signup modal
  const signupModalInstance = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
  if (signupModalInstance) {
    signupModalInstance.hide();
  }

  // Update UI for logged-in user
  updateUIForLoggedInUser(newUser);
}

function showSuccessToast() {
  const toastElement = document.getElementById("successToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
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

    // Add event listener for sign out
    document.getElementById('signOutButton').addEventListener('click', signOut);
  }
}

function signOut(e) {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  location.reload();
}

function resetInputStyles() {
  [signupName, signupEmail, signupPassword].forEach((input) => {
    input.classList.remove("is-invalid", "is-valid", "validating");
  });
  [nameError, emailError, passwordError].forEach((error) => {
    error.classList.add("d-none");
  });
}

function validateNameSilently() {
  const nameRegex = /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z\s]{2,}$/;
  return signupName.value.trim() !== "" && nameRegex.test(signupName.value);
}

function showMessage(message, type) {
  messageElement.textContent = message;
  messageElement.classList.remove("d-none", "alert-danger", "alert-success");
  messageElement.classList.add(`alert-${type}`);
  messageElement.style.display = "block";
}

function clearForm() {
  signupName.value = "";
  signupEmail.value = "";
  signupPassword.value = "";
  [signupName, signupEmail, signupPassword].forEach((input) => {
    input.classList.remove("is-valid", "is-invalid", "validating");
  });
  [nameError, emailError, passwordError].forEach((error) =>
    error.classList.add("d-none")
  );
}

function resetInputStyle(input) {
  input.classList.remove("is-valid", "is-invalid", "validating");
}

function updatePasswordStrength() {
  const password = signupPassword.value;
  const strength = checkPasswordStrength(password);
  const meter = document.getElementById("password-strength-meter");
  const text = document.getElementById("password-strength-text");
  const strengthContainer = document.querySelector(".password-strength");

  if (password.length === 0) {
    strengthContainer.style.display = "none";
    return;
  }

  strengthContainer.style.display = "block";
  meter.style.width = `${(strength / 5) * 100}%`;

  meter.className = "progress-bar";
  text.className = "form-text mt-1";

  if (strength === 0) {
    meter.classList.add("bg-danger");
    text.textContent = "Very weak";
    text.classList.add("password-strength-very-weak");
  } else if (strength < 3) {
    meter.classList.add("bg-warning");
    text.textContent = "Weak";
    text.classList.add("password-strength-weak");
  } else if (strength === 3) {
    meter.classList.add("bg-info");
    text.textContent = "Good";
    text.classList.add("password-strength-good");
  } else if (strength === 4) {
    meter.classList.add("bg-primary");
    text.textContent = "Strong";
    text.classList.add("password-strength-strong");
  } else {
    meter.classList.add("bg-success");
    text.textContent = "Very strong";
    text.classList.add("password-strength-very-strong");
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("signupPassword");
  const eyeIcon = document.getElementById("passwordToggle");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  signup();
});

// Add event listeners for real-time validation
signupName.addEventListener("input", validateName);
signupEmail.addEventListener("input", validateEmail);
signupPassword.addEventListener("input", validatePassword);

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    updateUIForLoggedInUser(currentUser);
  }
});

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
});

function signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    
    // Basic validation
    if (!name || !email || !password) {
        showSignupMessage('Please fill in all fields', 'danger');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showSignupMessage('Please enter a valid email address', 'danger');
        return;
    }

    // Password validation (e.g., at least 6 characters)
    if (password.length < 6) {
        showSignupMessage('Password must be at least 6 characters long', 'danger');
        return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showSignupMessage('Email already registered', 'danger');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('New user registered:', newUser); // Debug log
    console.log('Updated users list:', JSON.parse(localStorage.getItem('users'))); // Debug log
    
    // Auto-login the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Show success message and update UI
    showSignupMessage('Registration successful!', 'success');
    updateUIForLoggedInUser(newUser);
    closeSignupModal();
    showSuccessToast('Welcome, ' + name + '!');
}

function showSignupMessage(message, type) {
    const signupMessage = document.getElementById('signupMessage');
    if (signupMessage) {
        signupMessage.textContent = message;
        signupMessage.className = `alert alert-${type}`;
        signupMessage.style.display = 'block';
    }
}

function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        const modal = bootstrap.Modal.getInstance(signupModal);
        if (modal) {
            modal.hide();
        }
    }
}

// These functions are already defined in login.js, so we don't need to redefine them here
// updateUIForLoggedInUser(user)
// showSuccessToast(message)