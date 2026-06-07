// Multi-language translations for Tea Shop
const translations = {
  en: {
    // Header & Navigation
    brand: '🍵 Tea Shop',
    nav_home: 'Home',
    nav_menu: 'Menu',
    nav_about: 'About',
    nav_gallery: 'Gallery',
    nav_contact: 'Contact',
    nav_dashboard: 'Dashboard',
    nav_admin: 'Admin',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    
    // Home Page
    welcome_title: 'Welcome to Tea Shop',
    welcome_subtitle: 'Handcrafted teas, fresh ingredients, and cozy atmosphere',
    browse_menu: 'Browse the menu',
    btn_menu: '☕ Browse Menu',
    btn_gallery: '📷 Gallery',
    btn_order: '🛒 Order Now',
    feature_fresh: '🌿 Fresh Ingredients',
    feature_fresh_desc: 'We source premium loose leaf teas from around the world and use fresh, locally-sourced milk and ingredients.',
    feature_cozy: '☁️ Cozy Atmosphere',
    feature_cozy_desc: 'Relax in our comfortable seating, enjoy free Wi‑Fi, and take your time with a good book or conversation.',
    feature_local: '⭐ Local Favorites',
    feature_local_desc: 'Try our seasonal blends, house specials, and modern tea creations that change every week.',
    ready_title: 'Ready to taste the difference?',
    ready_desc: 'Visit our menu to explore all available teas and beverages',
    view_menu: 'View Our Full Menu',
    footer_text: '© 2024 Tea Shop — Handcrafted with ☕',
    footer_tagline: 'Experience the perfect cup, every time',
    
    // Dashboard
    dashboard_title: 'Client Dashboard',
    signin_prompt: 'Sign In to View Your Dashboard',
    signin_prompt_desc: 'Please sign in to see your profile, cart, and order history.',
    signin_now: 'Sign In Now',
    
    // Your Info Section
    your_info: 'Your Info',
    label_name: 'Name:',
    label_email: 'Email:',
    label_phone: 'Phone:',
    label_address: 'Address (optional)',
    placeholder_name: 'Optional name',
    placeholder_email: 'Optional email',
    placeholder_phone: 'Mobile number',
    placeholder_address: 'Address (optional)',
    save_info: 'Save Info',
    info_saved: 'Info saved!',
    
    // Cart Section
    your_cart: 'Your Cart',
    cart_empty: 'Your cart is empty.',
    browse_menu: 'Browse the menu',
    cart_item: 'Item',
    cart_qty: 'Qty',
    cart_line: 'Line',
    cart_total: 'Total:',
    place_order: 'Place Order',
    clear_cart: 'Clear Cart',
    
    // Orders Section
    recent_orders: 'Recent Orders',
    create_test_order: '📋 Create Test Order',
    no_orders: 'No orders yet.',
    start_ordering: 'Start ordering!',
    order_created: '✓ Test order created successfully!',
    
    // Status Badges
    status_pending: 'pending',
    status_completed: 'completed',
    status_cancelled: 'cancelled',
    
    // Messages
    cart_is_empty: 'Cart is empty.',
    please_signin: 'Please sign in first.',
    order_placed: 'Order placed — thank you!',
    failed_place_order: 'Failed to place order: ',
    failed_save_info: 'Failed to save: ',
    error_loading_orders: 'Error loading orders.',
    loading_orders: 'Loading orders…',
    error_loading_cart: 'Failed to load cart from Firestore:',
    failed_create_test_order: 'Failed to create test order: ',
    confirm_test_order: 'Create a test order with sample items?'
  },
  
  hi: {
    // Header & Navigation
    brand: '🍵 चाय की दुकान',
    nav_home: 'होम',
    nav_menu: 'मेनू',
    nav_about: 'हमारे बारे में',
    nav_gallery: 'गैलरी',
    nav_contact: 'संपर्क',
    nav_dashboard: 'डैशबोर्ड',
    nav_admin: 'एडमिन',
    sign_in: 'साइन इन',
    sign_out: 'साइन आउट',
    
    // Dashboard
    dashboard_title: 'क्लाइंट डैशबोर्ड',
    signin_prompt: 'अपना डैशबोर्ड देखने के लिए साइन इन करें',
    signin_prompt_desc: 'अपनी प्रोफाइल, कार्ट और ऑर्डर इतिहास देखने के लिए साइन इन करें।',
    signin_now: 'अभी साइन इन करें',
    
    // Your Info Section
    your_info: 'आपकी जानकारी',
    label_name: 'नाम:',
    label_email: 'ईमेल:',
    label_phone: 'फोन:',
    label_address: 'पता (वैकल्पिक)',
    placeholder_name: 'वैकल्पिक नाम',
    placeholder_email: 'वैकल्पिक ईमेल',
    placeholder_phone: 'मोबाइल नंबर',
    placeholder_address: 'पता (वैकल्पिक)',
    save_info: 'जानकारी सहेजें',
    info_saved: 'जानकारी सहेजी गई!',
    
    // Cart Section
    your_cart: 'आपकी कार्ट',
    cart_empty: 'आपकी कार्ट खाली है।',
    browse_menu: 'मेनू ब्राउज़ करें',
    cart_item: 'वस्तु',
    cart_qty: 'मात्रा',
    cart_line: 'कुल',
    cart_total: 'कुल:',
    place_order: 'ऑर्डर दें',
    clear_cart: 'कार्ट साफ़ करें',
    
    // Orders Section
    recent_orders: 'हाल के ऑर्डर',
    create_test_order: '📋 टेस्ट ऑर्डर बनाएं',
    no_orders: 'अभी कोई ऑर्डर नहीं।',
    start_ordering: 'ऑर्डर करना शुरू करें!',
    order_created: '✓ टेस्ट ऑर्डर सफलतापूर्वक बनाया गया!',
    
    // Status Badges
    status_pending: 'लंबित',
    status_completed: 'पूर्ण',
    status_cancelled: 'रद्द',
    
    // Messages
    cart_is_empty: 'कार्ट खाली है।',
    please_signin: 'पहले साइन इन करें।',
    order_placed: 'ऑर्डर दिया गया — धन्यवाद!',
    failed_place_order: 'ऑर्डर देने में विफल: ',
    failed_save_info: 'सहेजने में विफल: ',
    error_loading_orders: 'ऑर्डर लोड करने में त्रुटि।',
    loading_orders: 'ऑर्डर लोड हो रहे हैं…',
    error_loading_cart: 'Firestore से कार्ट लोड करने में विफल:',
    failed_create_test_order: 'टेस्ट ऑर्डर बनाने में विफल: ',
    confirm_test_order: 'नमूना वस्तुओं के साथ एक परीक्षण ऑर्डर बनाएं?'
  },
  
  ra: {
    // Header & Navigation (Rajasthani)
    brand: '🍵 चायनी दुकान',
    nav_home: 'होम',
    nav_menu: 'मेनू',
    nav_about: 'बारे मां',
    nav_gallery: 'गैलरी',
    nav_contact: 'संपर्क',
    nav_dashboard: 'डैशबोर्ड',
    nav_admin: 'एडमिन',
    sign_in: 'साइन इन',
    sign_out: 'साइन आउट',
    
    // Dashboard
    dashboard_title: 'क्लाइंट डैशबोर्ड',
    signin_prompt: 'आपनो डैशबोर्ड देखण खातर साइन इन करो',
    signin_prompt_desc: 'आपनी प्रोफाइल, कार्ट अर ऑर्डर इतिहास देखण खातर साइन इन करो।',
    signin_now: 'अभे साइन इन करो',
    
    // Your Info Section
    your_info: 'आपनी जणकारी',
    label_name: 'नांव:',
    label_email: 'ईमेल:',
    label_phone: 'मोबाइल:',
    label_address: 'पता (विकल्प)',
    placeholder_name: 'नांव दो',
    placeholder_email: 'ईमेल दो',
    placeholder_phone: 'मोबाइल नंबर',
    placeholder_address: 'पता (विकल्प)',
    save_info: 'जणकारी राखो',
    info_saved: 'जणकारी राख दी गई!',
    
    // Cart Section
    your_cart: 'आपनी कार्ट',
    cart_empty: 'आपनी कार्ट खाली है।',
    browse_menu: 'मेनू देखो',
    cart_item: 'चीज़',
    cart_qty: 'मात्रा',
    cart_line: 'कुल',
    cart_total: 'कुल:',
    place_order: 'ऑर्डर दो',
    clear_cart: 'कार्ट साफ़ करो',
    
    // Orders Section
    recent_orders: 'हाल का ऑर्डर',
    create_test_order: '📋 टेस्ट ऑर्डर बनाओ',
    no_orders: 'अभे कोई ऑर्डर नी है।',
    start_ordering: 'ऑर्डर करना शुरू करो!',
    order_created: '✓ टेस्ट ऑर्डर सफल है!',
    
    // Status Badges
    status_pending: 'प्रतीक्षा',
    status_completed: 'पूरो',
    status_cancelled: 'रद्द',
    
    // Messages
    cart_is_empty: 'कार्ट खाली है।',
    please_signin: 'पहले साइन इन करो।',
    order_placed: 'ऑर्डर दे दिओ — धन्यवाद!',
    failed_place_order: 'ऑर्डर देवमां विफल: ',
    failed_save_info: 'राखवामां विफल: ',
    error_loading_orders: 'ऑर्डर लोड करवामां त्रुटि।',
    loading_orders: 'ऑर्डर लोड हो रेय है…',
    error_loading_cart: 'Firestore से कार्ट लोड करवामां विफल:',
    failed_create_test_order: 'टेस्ट ऑर्डर बनावामां विफल: ',
    confirm_test_order: 'नमूना चीज़ के साथ परीक्षण ऑर्डर बनाओ?'
  },
  
  ut: {
    // Header & Navigation (Uttarakhandi)
    brand: '🍵 चा की दोकान',
    nav_home: 'होम',
    nav_menu: 'मेनू',
    nav_about: 'हमारे बारे',
    nav_gallery: 'गैलरी',
    nav_contact: 'संपर्क',
    nav_dashboard: 'डैशबोर्ड',
    nav_admin: 'एडमिन',
    sign_in: 'साइन इन',
    sign_out: 'साइन आउट',
    
    // Dashboard
    dashboard_title: 'क्लाइंट डैशबोर्ड',
    signin_prompt: 'अपणो डैशबोर्ड देखण खातर साइन इन करो',
    signin_prompt_desc: 'अपणी प्रोफाइल, कार्ट अने ऑर्डर इतिहास देखण खातर साइन इन करो।',
    signin_now: 'हेला साइन इन करो',
    
    // Your Info Section
    your_info: 'अपणी जणकारी',
    label_name: 'नांव:',
    label_email: 'ईमेल:',
    label_phone: 'मोबाइल:',
    label_address: 'पता (चुन सको)',
    placeholder_name: 'नांव दो',
    placeholder_email: 'ईमेल दो',
    placeholder_phone: 'मोबाइल नंबर',
    placeholder_address: 'पता (चुन सको)',
    save_info: 'जणकारी बचाओ',
    info_saved: 'जणकारी बच गई!',
    
    // Cart Section
    your_cart: 'अपणी कार्ट',
    cart_empty: 'अपणी कार्ट खाली है।',
    browse_menu: 'मेनू देखो',
    cart_item: 'चीज़',
    cart_qty: 'मात्रा',
    cart_line: 'कुल',
    cart_total: 'कुल:',
    place_order: 'ऑर्डर दो',
    clear_cart: 'कार्ट साफ़ करो',
    
    // Orders Section
    recent_orders: 'हाल का ऑर्डर',
    create_test_order: '📋 टेस्ट ऑर्डर बनाओ',
    no_orders: 'अभे कोई ऑर्डर नी है।',
    start_ordering: 'ऑर्डर करना शुरू करो!',
    order_created: '✓ टेस्ट ऑर्डर सफल बन गयो!',
    
    // Status Badges
    status_pending: 'प्रतीक्षा',
    status_completed: 'पूरो',
    status_cancelled: 'रद्द',
    
    // Messages
    cart_is_empty: 'कार्ट खाली है।',
    please_signin: 'पहले साइन इन करो।',
    order_placed: 'ऑर्डर दे दिओ — धन्यवाद!',
    failed_place_order: 'ऑर्डर देवमां विफल: ',
    failed_save_info: 'बचावमां विफल: ',
    error_loading_orders: 'ऑर्डर लोड करवामां त्रुटि।',
    loading_orders: 'ऑर्डर लोड हो रेय है…',
    error_loading_cart: 'Firestore से कार्ट लोड करवामां विफल:',
    failed_create_test_order: 'टेस्ट ऑर्डर बनावामां विफल: ',
    confirm_test_order: 'नमूना चीज़ के साथ परीक्षण ऑर्डर बनाओ?'
  },
  
  fr: {
    // Header & Navigation (French)
    brand: '🍵 Salon de Thé',
    nav_home: 'Accueil',
    nav_menu: 'Menu',
    nav_about: 'À propos',
    nav_gallery: 'Galerie',
    nav_contact: 'Contact',
    nav_dashboard: 'Tableau de bord',
    nav_admin: 'Admin',
    sign_in: 'Connexion',
    sign_out: 'Déconnexion',
    
    // Dashboard
    dashboard_title: 'Tableau de bord client',
    signin_prompt: 'Connectez-vous pour voir votre tableau de bord',
    signin_prompt_desc: 'Connectez-vous pour voir votre profil, panier et historique des commandes.',
    signin_now: 'Se connecter maintenant',
    
    // Your Info Section
    your_info: 'Vos informations',
    label_name: 'Nom:',
    label_email: 'E-mail:',
    label_phone: 'Téléphone:',
    label_address: 'Adresse (optionnel)',
    placeholder_name: 'Nom optionnel',
    placeholder_email: 'E-mail optionnel',
    placeholder_phone: 'Numéro de téléphone',
    placeholder_address: 'Adresse (optionnel)',
    save_info: 'Enregistrer les informations',
    info_saved: 'Informations enregistrées!',
    
    // Cart Section
    your_cart: 'Votre panier',
    cart_empty: 'Votre panier est vide.',
    browse_menu: 'Parcourir le menu',
    cart_item: 'Article',
    cart_qty: 'Qté',
    cart_line: 'Total',
    cart_total: 'Total:',
    place_order: 'Passer la commande',
    clear_cart: 'Vider le panier',
    
    // Orders Section
    recent_orders: 'Commandes récentes',
    create_test_order: '📋 Créer commande test',
    no_orders: 'Aucune commande pour le moment.',
    start_ordering: 'Commencer!',
    order_created: '✓ Commande test créée avec succès!',
    
    // Status Badges
    status_pending: 'en attente',
    status_completed: 'complété',
    status_cancelled: 'annulé',
    
    // Messages
    cart_is_empty: 'Le panier est vide.',
    please_signin: 'Veuillez d\'abord vous connecter.',
    order_placed: 'Commande passée — merci!',
    failed_place_order: 'Échec du passage de commande: ',
    failed_save_info: 'Échec de l\'enregistrement: ',
    error_loading_orders: 'Erreur lors du chargement des commandes.',
    loading_orders: 'Chargement des commandes…',
    error_loading_cart: 'Échec du chargement du panier depuis Firestore:',
    failed_create_test_order: 'Échec de la création de la commande test: ',
    confirm_test_order: 'Créer une commande test avec des articles d\'exemple?'
  }
};

// Get translation for a given key and language
function getTranslation(key, lang = 'en') {
  const currentLang = translations[lang] || translations['en'];
  return currentLang[key] || key;
}

// Get current language from localStorage or default to 'en'
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

// Set language and save to localStorage
function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('language', lang);
    return true;
  }
  return false;
}

// Get all available languages
function getAvailableLanguages() {
  return Object.keys(translations);
}

// Get language display names
function getLanguageNames() {
  return {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    ra: 'राजस्थानी (Rajasthani)',
    ut: 'उत्तरखंडी (Uttarakhandi)',
    fr: 'Français (French)'
  };
}
