
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { Roboto, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
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
    <html lang="en" className={`${roboto.variable} ${spaceGrotesk.variable}`}>
      <head>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1 md:pl-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
              <div className="p-4 sm:p-6 lg:p-8 fade-in">
                {children}
              </div>
            </main>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
