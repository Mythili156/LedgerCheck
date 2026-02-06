import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const currencies = {
    USD: { code: 'USD', symbol: '$', rate: 1 },
    INR: { code: 'INR', symbol: '₹', rate: 83.5 }, // Mock conversion rate
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 }
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState(() => {
        const saved = localStorage.getItem('app_currency');
        return saved ? JSON.parse(saved) : currencies.INR; // Default to INR based on recent requests
    });

    const changeCurrency = (currencyCode) => {
        const newCurrency = currencies[currencyCode];
        setCurrency(newCurrency);
        localStorage.setItem('app_currency', JSON.stringify(newCurrency));
    };

    // Helper to format money
    const formatMoney = (amount) => {
        if (amount === undefined || amount === null) return "0";
        // If the backend sends always USD or "Base Units", we might want to convert.
        // For now, assuming backend sends "Raw Numbers" and we just prepend symbol 
        // OR we convert? User request implies "select for analysis".
        // Usually analysis numbers are absolute. 
        // Let's assume input data matches output numbers, but just the SYMBOL changes? 
        // OR do we convert? 
        // The user said "type of currency to be select". 
        // If I upload a CSV in Rupees, and select USD, should it convert? 
        // That's complex without knowing the source currency.
        // SIMPLE APPROACH: Just change the Symbol. The numbers remain as is (assuming user uploads in that currency).
        // ADVANCED APPROACH: Convert.

        // Let's stick to SIMPLE approach: "Display Symbol".
        // If user wants conversion, that's a bigger task requiring source currency metadata.
        return `${currency.symbol}${amount.toLocaleString()}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatMoney, currencies }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
