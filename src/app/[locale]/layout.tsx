import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Layout } from './components/ui/layout';
import "../globals.css";

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>
        <ThemeProvider>
          <LanguageProvider initialLocale={params.locale as 'tr' | 'en'}>
            <Layout>
              {children}
            </Layout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}