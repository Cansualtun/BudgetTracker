"use client"
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Languages, BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Sidebar() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();

    const toggleLanguage = () => {
        const currentLang = pathname.split('/')[1];
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
        router.push(newPath);
    };

    const currentLang = pathname.split('/')[1];

    return (
        <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6 
            bg-background/50 backdrop-blur-lg border-r border-border/40 
            shadow-[5px_0_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="mb-8">
                <Link href={"/"}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary 
                        flex items-center justify-center text-primary-foreground font-bold text-xl
                        shadow-lg shadow-primary/20 hover:shadow-primary/30 
                        transition-all duration-300 hover:scale-105 cursor-pointer">
                        B
                    </div>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <Link
                    href={`/${currentLang}/stats/all`}
                    className="group relative p-3 rounded-xl hover:bg-secondary/10 
                        transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-xl bg-secondary/0 
                        group-hover:bg-secondary/5 transition-colors"/>
                    <div className="flex flex-col items-center gap-1">
                        <BarChart3
                            size={24}
                            className="text-foreground/80 group-hover:text-foreground 
                                transition-colors relative z-10"
                        />
                        <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground 
                            transition-colors relative z-10">
                            {t("budget.stats.stats")}
                        </span>
                    </div>
                    <span className="sr-only">Go to Statistics</span>
                </Link>
            </div>
            <div className="mt-auto flex flex-col items-center gap-4 mb-12">
                <button
                    onClick={toggleTheme}
                    className="group relative p-3 rounded-xl hover:bg-secondary/10 
                        transition-all duration-300 hover:scale-105 active:scale-95"
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

                <button
                    onClick={toggleLanguage}
                    className="group relative p-3 rounded-xl hover:bg-secondary/10 
                        transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-xl bg-secondary/0 
                        group-hover:bg-secondary/5 transition-colors"/>
                    <div className="flex flex-col items-center gap-1">
                        <Languages size={24} className="text-foreground/80 group-hover:text-foreground 
                            transition-colors relative z-10" />
                        <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground 
                            transition-colors relative z-10">
                            {currentLang.toUpperCase()}
                        </span>
                    </div>
                    <span className="sr-only">Change language</span>
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t 
                from-background to-transparent pointer-events-none"/>
        </div>
    );
}