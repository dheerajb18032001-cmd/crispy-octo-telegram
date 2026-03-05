// Theme toggle utility: toggles `dark` class on <html> and persists choice in localStorage
(function(){
  const storageKey = 'theme-preference';
  function applyTheme(theme){
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }

  function getPreferredTheme(){
    const stored = localStorage.getItem(storageKey);
    if(stored) return stored;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  // Public toggle function
  window.toggleTheme = function(){
    const currentlyDark = document.documentElement.classList.contains('dark');
    const next = currentlyDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(storageKey, next);
  };

  // Apply on load
  document.addEventListener('DOMContentLoaded', function(){
    applyTheme(getPreferredTheme());
  });
})();
