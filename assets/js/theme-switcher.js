document.addEventListener('DOMContentLoaded', function() {
  const switcher = document.getElementById('theme-switcher');
  const switcherBtn = switcher.querySelector('.switcher-btn');
  const switcherPanel = switcher.querySelector('.switcher-panel');
  const colorOptions = switcher.querySelectorAll('.color-options li');
  const darkModeSwitch = document.getElementById('darkModeSwitch');
  const modeLabel = document.getElementById('modeLabel');

  function applyTheme(color) {
    document.documentElement.style.setProperty('--main-color', color);
    colorOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.color === color);
      opt.style.backgroundColor = opt.dataset.color;
    });
    updateButtonColors();
    updateLogoutButtonColor();
    updateLogoutButtonHoverColor();
    updateToastStyles();
  }

  function updateButtonColors() {
    const buttons = document.querySelectorAll('.btn-outline-info');
    buttons.forEach(button => {
      button.style.color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
      button.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
    });
  }

  function updateToastStyles() {
    const toasts = document.querySelectorAll('.toast');
    const mainColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim();
    toasts.forEach(toast => {
      toast.style.backgroundColor = mainColor;
      toast.style.color = isColorLight(mainColor) ? '#000' : '#fff';
    });
  }

  function isColorLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
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
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
    updateButtonColors();
    updateLogoutButtonColor();
    updateLogoutButtonHoverColor();
    updateModeLabel(isDarkMode);
  });

  const savedColor = localStorage.getItem('themeColor') || '#17a2b8';
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  applyTheme(savedColor);

  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeSwitch.checked = true;
  }

  updateModeLabel(savedDarkMode);

  updateButtonColors();

  function updateLogoutButtonColor() {
    const logoutButton = document.querySelector('.btn-outline-theme');
    if (logoutButton) {
      logoutButton.style.color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
      logoutButton.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
    }
  }

  function updateLogoutButtonHoverColor() {
    const style = document.createElement('style');
    const isDarkMode = document.body.classList.contains('dark-mode');
    const hoverColor = isDarkMode ? getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() : getComputedStyle(document.documentElement).getPropertyValue('--dark-color').trim();
    
    style.textContent = `
      .btn-outline-theme:hover {
        color: ${hoverColor} !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  function updateModeLabel(isDarkMode) {
    modeLabel.textContent = isDarkMode ? 'Dark Mode' : 'Light Mode';
  }
});