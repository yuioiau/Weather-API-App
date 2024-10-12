document.addEventListener('DOMContentLoaded', function() {
  const switcherBtn = document.querySelector('.switcher-btn');
  const switcherPanel = document.querySelector('.switcher-panel');
  const colorOptions = document.querySelectorAll('.color-options li');
  const darkModeSwitch = document.getElementById('darkModeSwitch');
  const modeLabel = document.getElementById('modeLabel');

  function applyTheme(color) {
    document.documentElement.style.setProperty('--main-color', color);
    colorOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.color === color);
    });
    updateColors(color);
  }

  function updateColors(color) {
    const mainColor = color || getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
    
    // Update button colors
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
      button.style.backgroundColor = mainColor;
      button.style.borderColor = mainColor;
    });

    // Update navbar colors
    const navbar = document.querySelector('.navbar');
    const navbarBrand = document.querySelector('.navbar-brand');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navbar) {
      navbar.style.color = mainColor;
    }
    if (navbarBrand) {
      navbarBrand.style.color = mainColor;
    }
    navLinks.forEach(link => {
      link.style.color = mainColor;
    });

    // Update footer colors
    const footer = document.querySelector('footer');
    const footerLinks = document.querySelectorAll('footer a');
    const socialIcons = document.querySelectorAll('.social-icons a');
    const footerInput = document.querySelector('footer .subscribe-form .form-control');
    const footerButton = document.querySelector('footer .subscribe-form .btn-primary');
    
    if (footer) {
      footer.style.setProperty('--main-color', mainColor);
    }
    footerLinks.forEach(link => {
      link.style.color = mainColor;
    });
    socialIcons.forEach(icon => {
      icon.style.color = mainColor;
    });
    if (footerInput) {
      footerInput.style.borderColor = mainColor;
    }
    if (footerButton) {
      footerButton.style.backgroundColor = mainColor;
      footerButton.style.borderColor = mainColor;
    }

    // Update city name color
    const cityName = document.getElementById('cityName');
    if (cityName) {
      cityName.style.color = mainColor;
    }

    // Update current day border
    const currentDay = document.querySelector('.current-day');
    if (currentDay) {
      currentDay.style.borderColor = mainColor;
    }

    // Update weather card colors
    const weatherCards = document.querySelectorAll('.weather-card');
    weatherCards.forEach(card => {
      card.style.setProperty('--main-color', mainColor);
    });
  }

  function updateButtonColors() {
    const buttons = document.querySelectorAll('.btn-primary');
    const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
    buttons.forEach(button => {
      button.style.backgroundColor = mainColor;
      button.style.borderColor = mainColor;
    });
  }

  function updateModalColors(color) {
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
      modal.style.borderColor = color;
    });
    const modalHeaders = document.querySelectorAll('.modal-header');
    modalHeaders.forEach(header => {
      header.style.backgroundColor = color;
      header.style.color = '#fff';
    });
  }

  function updateModeLabel(isDarkMode) {
    modeLabel.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
  }

  function toggleDarkMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('footer');
    const modals = document.querySelectorAll('.modal-content');
    const footerInput = document.querySelector('footer .subscribe-form .form-control');
    const weatherResult = document.getElementById('weatherResult');
    const weatherCards = document.querySelectorAll('.weather-card');

    if (isDarkMode) {
      navbar.classList.add('navbar-dark', 'bg-dark');
      navbar.classList.remove('navbar-light', 'bg-light');
      footer.classList.add('bg-dark', 'text-white');
      footer.classList.remove('bg-light', 'text-dark');
      modals.forEach(modal => {
        modal.classList.add('bg-dark', 'text-white');
        modal.classList.remove('bg-light', 'text-dark');
      });
      if (footerInput) {
        footerInput.classList.add('bg-dark', 'text-white');
        footerInput.classList.remove('bg-light', 'text-dark');
      }
    } else {
      navbar.classList.add('navbar-light', 'bg-light');
      navbar.classList.remove('navbar-dark', 'bg-dark');
      footer.classList.add('bg-light', 'text-dark');
      footer.classList.remove('bg-dark', 'text-white');
      modals.forEach(modal => {
        modal.classList.add('bg-light', 'text-dark');
        modal.classList.remove('bg-dark', 'text-white');
      });
      if (footerInput) {
        footerInput.classList.add('bg-light', 'text-dark');
        footerInput.classList.remove('bg-dark', 'text-white');
      }
    }

    updateModeLabel(isDarkMode);
    updateColors();
  }

  switcherBtn.addEventListener('click', function() {
    switcherPanel.classList.toggle('open');
  });

  function setThemeColor(color) {
    document.documentElement.style.setProperty('--theme-color', color);
    localStorage.setItem('themeColor', color);
    
    // Update the border color of the current day
    const currentDay = document.querySelector('.current-day');
    if (currentDay) {
        currentDay.style.borderColor = color;
    }
  }

  function updateCurrentDayBorder() {
    const currentDay = document.querySelector('.current-day');
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();
    if (currentDay && themeColor) {
        currentDay.style.borderColor = themeColor;
    }
  }

  function updateCityNameColor(color) {
    const cityName = document.getElementById('cityName');
    if (cityName) {
      cityName.style.color = color;
    }
  }

  colorOptions.forEach(option => {
    option.style.backgroundColor = option.dataset.color;
    option.addEventListener('click', () => {
      const color = option.getAttribute('data-color');
      applyTheme(color);
      localStorage.setItem('themeColor', color);
    });
  });

  darkModeSwitch.addEventListener('change', function() {
    const isDarkMode = this.checked;
    toggleDarkMode(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  });

  const savedColor = localStorage.getItem('themeColor') || '#17a2b8';
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  applyTheme(savedColor);
  toggleDarkMode(savedDarkMode);
  darkModeSwitch.checked = savedDarkMode;
});
