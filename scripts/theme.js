// Theme switcher - dark mode / light mode
(function() {
  const THEME_KEY = 'tea-shop-theme';
  
  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(savedTheme);
    renderThemeButton();
  }
  
  // Set theme and update localStorage
  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }
  
  // Get current theme
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateThemeButton();
  }
  
  // Create and render theme button
  function renderThemeButton() {
    let themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) {
      themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle-btn';
      themeBtn.className = 'btn btn--sm btn--outline';
      themeBtn.setAttribute('aria-label', 'Toggle theme');
      themeBtn.style.cursor = 'pointer';
      
      const authUi = document.getElementById('auth-ui');
      if (authUi && authUi.parentNode) {
        authUi.parentNode.insertBefore(themeBtn, authUi);
      }
      
      themeBtn.addEventListener('click', toggleTheme);
    }
    updateThemeButton();
  }
  
  // Update button text and appearance
  function updateThemeButton() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      const currentTheme = getTheme();
      themeBtn.textContent = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
  }
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initTheme);
  
  // Fallback: initialize immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  // Expose globally for manual control if needed
  window.ThemeToggle = {
    toggle: toggleTheme,
    set: setTheme,
    get: getTheme
  };
})();
