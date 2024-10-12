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
    updateButtonColors();
    updateModalColors(color);
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

    if (isDarkMode) {
      navbar.classList.add('navbar-dark', 'bg-dark');
      navbar.classList.remove('navbar-light', 'bg-light');
      footer.classList.add('bg-dark', 'text-white');
      footer.classList.remove('bg-light', 'text-dark');
      modals.forEach(modal => {
        modal.classList.add('bg-dark', 'text-white');
        modal.classList.remove('bg-light', 'text-dark');
      });
    } else {
      navbar.classList.add('navbar-light', 'bg-light');
      navbar.classList.remove('navbar-dark', 'bg-dark');
      footer.classList.add('bg-light', 'text-dark');
      footer.classList.remove('bg-dark', 'text-white');
      modals.forEach(modal => {
        modal.classList.add('bg-light', 'text-dark');
        modal.classList.remove('bg-dark', 'text-white');
      });
    }

    updateButtonColors();
    updateModeLabel(isDarkMode);
  }

  switcherBtn.addEventListener('click', function() {
    switcherPanel.classList.toggle('open');
  });

  colorOptions.forEach(option => {
    option.style.backgroundColor = option.dataset.color;
    option.addEventListener('click', function() {
      const color = this.dataset.color;
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
