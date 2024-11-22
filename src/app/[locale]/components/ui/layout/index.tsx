"use client"
import { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sidebar } from '../sidebar';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { theme } = useTheme();

    return (
        <div className={theme}>
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
                }`}>
                <Sidebar />
                <main className="pl-16">
                    {children}
                </main>
            </div>
        </div>
    );
}