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


// Scroll reveal animations using Intersection Observer
(function(){
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries){
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections, cards, menu items, and gallery items
  document.addEventListener('DOMContentLoaded', function(){
    const elementsToAnimate = document.querySelectorAll(
      'section, .card, .menu-item, .gallery-grid figure, .feature-card, .contact-form'
    );
    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  });
})();

// Smooth hover scale animations for interactive elements
(function(){
  const interactiveElements = document.querySelectorAll(
    '.menu-item, .card, .gallery-grid figure, button, a[href], .feature-card'
  );
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function(){
      this.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
      this.style.transform = 'translateY(-3px)';
    });
    
    el.addEventListener('mouseleave', function(){
      this.style.transform = 'translateY(0)';
    });
  });
})();


