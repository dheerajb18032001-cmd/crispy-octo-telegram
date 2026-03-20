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


//Ye file ek JavaScript theme toggle utility hai. Simple shabdon mein:
// Ye website par dark mode / light mode switch karne ka code hai.
// <button onclick="toggleTheme()">Toggle Theme</button>
// User ki choice ko localStorage mein save karta hai taaki reload ke baad bhi yaad rahe.
// Page load hote hi system preference ya saved choice ke hisaab se theme apply karta hai.
// Ek toggleTheme() function banata hai jo button click se dark/light mode badal deta hai.
//Bas itna hi — ye file tumhare site ke theme ko manage karti hai
//Toh ye code dark/light mode switch karega aur preference yaad rakhega.
//👉 Matlab: Ye file ek theme switcher utility hai jo website par dark mode/light mode toggle karne ke liye banayi gayi hai, aur user ki choice ko localStorage mein persist karti hai.
//Kya tum chahte ho main isko ek step-by-step demo bana kar dikhaun jisme HTML + CSS + JS combine ho, taki tum apne project mein directly use kar sako?


