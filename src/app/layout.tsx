
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Roboto_Mono as RobotoMono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppWrapper } from '@/components/layout/AppWrapper';

const inter = Inter({
  subsets: ['latin'],
  weight: ['500', '700'], // Medium and Bold
  variable: '--font-inter',
});

const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'AutoBiz Finance',
  description: 'Automate your business finances with AI-powered tools for Indian SMEs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff6200" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
