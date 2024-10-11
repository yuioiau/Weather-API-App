let signinEmail = document.getElementById("signinEmail");
let signinPassword = document.getElementById("signinPassword");
let messageElement = document.getElementById("message");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validateEmail() {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(signinEmail.value)) {
    showInputError(
      signinEmail,
      emailError,
      "Please enter a valid email address."
    );
    return false;
  }
  showInputSuccess(signinEmail, emailError);
  return true;
}

function validatePassword() {
  if (signinPassword.value.length < 6) {
    showInputError(
      signinPassword,
      passwordError,
      "Password must be at least 6 characters long."
    );
    return false;
  }
  showInputSuccess(signinPassword, passwordError);
  return true;
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

signinEmail.addEventListener("input", () => {
  if (signinEmail.value === "") {
    signinEmail.classList.remove("is-valid", "is-invalid", "validating");
    emailError.classList.add("d-none");
  } else {
    showInputValidating(signinEmail);
    validateEmail();
  }
});

signinPassword.addEventListener("input", () => {
  if (signinPassword.value === "") {
    signinPassword.classList.remove("is-valid", "is-invalid", "validating");
    passwordError.classList.add("d-none");
  } else {
    showInputValidating(signinPassword);
    validatePassword();
  }
});

function signin() {
  if (!validateEmail() || !validatePassword()) {
    return;
  }

  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  let user = storedUsers.find(
    (u) => u.email === signinEmail.value && u.password === signinPassword.value
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    showSuccessToast();
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } else {
    showMessage("Incorrect email or password", "danger");
  }
}

function showMessage(message, type) {
  messageElement.textContent = message;
  messageElement.classList.remove("d-none", "alert-danger", "alert-success");
  messageElement.classList.add(`alert-${type}`);
  messageElement.style.display = "block";
}

function clearForm() {
  signinEmail.value = "";
  signinPassword.value = "";
  [signinEmail, signinPassword].forEach((input) => {
    input.classList.remove("is-valid", "is-invalid", "validating");
  });
  [emailError, passwordError].forEach((error) => error.classList.add("d-none"));
}

function showSuccessToast() {
  const toastElement = document.getElementById("successToast");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

document.querySelector("button").addEventListener("click", signin);
