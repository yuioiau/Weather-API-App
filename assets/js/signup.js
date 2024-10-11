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
    showInputSuccess(signupPassword, passwordError);
    return true;
  }
  const password = signupPassword.value;
  const strength = checkPasswordStrength(password);

  if (password.length < 6) {
    showInputError(
      signupPassword,
      passwordError,
      "Password must be at least 6 characters long."
    );
    return false;
  }

  if (strength < 3) {
    showInputError(
      signupPassword,
      passwordError,
      "Password is too weak. Please choose a stronger password."
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

  // Check for existing name and email
  if (
    users.some(
      (user) => user.name.toLowerCase() === signupName.value.toLowerCase()
    )
  ) {
    showInputError(signupName, nameError, "This name is already taken.");
    return;
  }

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
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  // Reset input styles before showing success
  resetInputStyles();

  showSuccessToast();
  clearForm();

  // Redirect to home page after 2 seconds
  setTimeout(() => {
    window.location.href = "home.html";
  }, 2000);
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

function showSuccessToast() {
  const toastElement = document.getElementById("successToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

document.querySelector("button").addEventListener("click", signup);

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

signupPassword.removeEventListener("blur", resetInputStyle);

function resetInputStyle(input) {
  input.classList.remove("is-valid", "is-invalid", "validating");
}
