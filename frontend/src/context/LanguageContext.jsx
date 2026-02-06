import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Initialize from localStorage or default to 'en'
    const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'en');

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('app_language', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
