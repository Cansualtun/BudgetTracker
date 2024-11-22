"use client"

import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Languages } from 'lucide-react';

export function Sidebar() {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6 
            bg-background/50 backdrop-blur-lg border-r border-border/40 
            shadow-[5px_0_30px_-15px_rgba(0,0,0,0.1)]">

            {/* Logo Container */}
            <div className="mb-12">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary 
                    flex items-center justify-center text-primary-foreground font-bold text-xl
                    shadow-lg shadow-primary/20 hover:shadow-primary/30 
                    transition-all duration-300 hover:scale-105 cursor-pointer">
                    B
                </div>
            </div>

            {/* Actions Container */}
            <div className="flex flex-col items-center gap-6">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="group relative p-3 rounded-xl hover:bg-secondary/10 
                        transition-all duration-300 hover:scale-105 active:scale-95"
                    title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                >
                    <div className="absolute inset-0 rounded-xl bg-secondary/0 
                        group-hover:bg-secondary/5 transition-colors"/>
                    {theme === 'light' ? (
                        <Moon size={24} className="text-foreground/80 group-hover:text-foreground 
                            transition-colors relative z-10" />
                    ) : (
                        <Sun size={24} className="text-foreground/80 group-hover:text-foreground 
                            transition-colors relative z-10" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </button>

                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="group relative p-3 rounded-xl hover:bg-secondary/10 
                        transition-all duration-300 hover:scale-105 active:scale-95"
                    title="Change Language"
                >
                    <div className="absolute inset-0 rounded-xl bg-secondary/0 
                        group-hover:bg-secondary/5 transition-colors"/>
                    <div className="flex flex-col items-center gap-1 relative z-10">
                        <Languages size={24} className="text-foreground/80 group-hover:text-foreground 
                            transition-colors" />
                        <span className="text-xs font-medium text-foreground/70 
                            group-hover:text-foreground transition-colors">
                            {language.toUpperCase()}
                        </span>
                    </div>
                    <span className="sr-only">Change language</span>
                </button>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t 
                from-background to-transparent pointer-events-none"/>
        </div>
    );
}