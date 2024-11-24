import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from './components/ui/layout';
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '../provider';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bütçe Takip Uygulaması',
  description: 'Kişisel gelir ve giderlerinizi takip edin',
};

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
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
      </head>
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