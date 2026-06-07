// Language Manager - Handles language switching and translation updates
(function() {
  const LANG_STORAGE_KEY = 'tea-shop-language';
  
  // Initialize language system
  function initLanguage() {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    applyLanguage(savedLang);
  }

  // Apply language to the page
  function applyLanguage(lang) {
    if (!translations[lang]) {
      lang = 'en';
    }
    
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      const text = getTranslation(key, lang);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('data-translate-placeholder')) {
          element.placeholder = text;
        }
        if (element.hasAttribute('data-translate-value')) {
          element.value = text;
        }
      } else {
        element.textContent = text;
      }
    });
    
    // Update language selector if exists
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
      langSelector.value = lang;
    }
    
    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  // Create language selector UI
  function createLanguageSelector() {
    const existingSelector = document.getElementById('lang-selector');
    if (existingSelector) {
      return; // Already exists
    }

    const langNames = getLanguageNames();
    const currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    
    let selectorHtml = '<select id="lang-selector" class="lang-selector" aria-label="Select language" style="padding: 6px 8px; border: 1px solid rgba(0,0,0,0.15); border-radius: 6px; background: var(--bg); color: var(--text); cursor: pointer; font-family: inherit; font-size: 0.9rem;">';
    
    Object.keys(translations).forEach(lang => {
      const selected = lang === currentLang ? ' selected' : '';
      selectorHtml += `<option value="${lang}"${selected}>${langNames[lang]}</option>`;
    });
    
    selectorHtml += '</select>';

    // Find header and insert selector
    const header = document.querySelector('.site-header');
    if (header) {
      // Create a language selector container
      const selectorContainer = document.createElement('div');
      selectorContainer.innerHTML = selectorHtml;
      selectorContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';
      
      // Insert before auth-ui or at end of header container
      const authUi = header.querySelector('#auth-ui');
      if (authUi) {
        authUi.parentNode.insertBefore(selectorContainer, authUi);
      } else {
        header.appendChild(selectorContainer);
      }

      // Add change listener
      const selector = document.getElementById('lang-selector');
      selector.addEventListener('change', function() {
        applyLanguage(this.value);
        // Re-render dynamic content if needed
        if (window.renderDashCart) {
          window.renderDashCart();
        }
        if (window.loadOrders) {
          // Get current user and reload
          const user = firebase.auth().currentUser;
          if (user) {
            window.loadOrders(user);
          }
        }
      });
    }
  }

  // Global function to get translation
  window.t = function(key) {
    const lang = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    return getTranslation(key, lang);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initLanguage();
      createLanguageSelector();
    });
  } else {
    initLanguage();
    createLanguageSelector();
  }

  // Export for global use
  window.teaLangManager = {
    applyLanguage,
    getCurrentLanguage: () => localStorage.getItem(LANG_STORAGE_KEY) || 'en',
    setLanguage: applyLanguage
  };
})();
