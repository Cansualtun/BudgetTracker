import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from './components/ui/layout';
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '../provider';
import { Toaster } from 'react-hot-toast';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={params.locale}>
      <body>
        <Providers>
          <Toaster />
          <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
              <Layout>
                {children}
              </Layout>
            </NextIntlClientProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}