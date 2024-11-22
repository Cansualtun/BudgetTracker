"use client"

import { Language } from '@/types/generalType';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    changeLanguage: (newLanguage: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    initialLocale = 'tr'
}: {
    children: ReactNode;
    initialLocale?: Language;
}) {
    const [language, setLanguage] = useState<Language>(initialLocale);
    const router = useRouter();
    const pathname = usePathname();

    // URL'den dil değişimini takip et
    useEffect(() => {
        const locale = pathname.split('/')[1] as Language;
        if (locale && (locale === 'tr' || locale === 'en')) {
            setLanguage(locale);
        }
    }, [pathname]);

    // Dil değiştirme fonksiyonu
    const changeLanguage = (newLanguage: Language) => {
        const currentPath = pathname.split('/').slice(2).join('/') || '';
        router.push(`/${newLanguage}/${currentPath}`);
        setLanguage(newLanguage);
    };

    // Toggle fonksiyonu
    const toggleLanguage = () => {
        const newLanguage = language === 'tr' ? 'en' : 'tr';
        changeLanguage(newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};