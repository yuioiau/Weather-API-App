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

  // Dispatch a custom event for login.js to handle the UI update
  const event = new CustomEvent('userSignedUp', { detail: newUser });
  document.dispatchEvent(event);
}

function showSignupMessage(message, type) {
  const signupMessage = document.getElementById('signupMessage');
  if (signupMessage) {
    signupMessage.textContent = message;
    signupMessage.className = `alert alert-${type}`;
    signupMessage.style.display = 'block';
  }
}