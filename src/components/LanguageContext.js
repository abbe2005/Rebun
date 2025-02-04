import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Retrieve the saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'; // Default language
  });

  const translations = {
    en: {
      market: "Market",
      safety: "Safety",
      faq: "FAQ",
      guide: "Guide",
      contact: "Contact",
      adminDashboard: "Admin Dashboard",
      profile: "Profile",
      dashboard: "Dashboard",
      goSell: "Go Sell",
      darkTheme: "Dark Theme",
      lightTheme: "Light Theme",
      logout: "Logout",
      notifications: "Notifications",
      noNotifications: "No notifications",
      login: "Login",
      about: "About Us",
      buyWhatYouNeed: "BUY WHAT YOU NEED",
      rentWhatYouWant: "RENT WHAT YOU WANT",
      wantToBecomeSeller: "WANT TO BECOME A SELLER?",
      addYourProduct: "ADD YOUR PRODUCT TO THE MARKET!",
      highPrices: "HIGH PRICES?",
      rentAndSave: "RENT AND SAVE MONEY!",
      wannaKnowMore: "WANNA KNOW MORE ABOUT REBUN?",
      takeALookAtFAQ: "TAKE A LOOK AT OUR FAQ!",
    },
    ar: {
      market: "المتجر",
      safety: "السلامة",
      faq: "الأسئلة الشائعة",
      guide: "الدليل",
      contact: "اتصل بنا",
      adminDashboard: "لوحة تحكم المسؤول",
      profile: "الملف الشخصي",
      dashboard: "لوحة القيادة",
      goSell: "اذهب للبيع",
      darkTheme: "الوضع داكن",
      lightTheme: "الوضع فاتح",
      logout: "تسجيل الخروج",
      notifications: "الإشعارات",
      noNotifications: "لا توجد إشعارات",
      login: "تسجيل الدخول",
      about: "معلومات عنا",
      buyWhatYouNeed: "اشتر ما تحتاجه",
      rentWhatYouWant: "استأجر ما تريده",
      wantToBecomeSeller: "تريد أن تبيع منتجاتك؟",
      addYourProduct: "أضفها إلى المتجر الآن",
      highPrices: "أسعار عالية؟",
      rentAndSave: "استأجر و اقتصد في مالك",
      wannaKnowMore: "تريد أن تعرف أكثر عن موقعنا؟",
      takeALookAtFAQ: "ألق نظرة على أسئلتنا الشائعة",
    },
  };

  const t = (key) => translations[language][key] || key; // Translation function

  // Update localStorage whenever the language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);