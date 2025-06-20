
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { PT_Sans, Space_Grotesk } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'AutoBiz Finance',
  description: 'Automate your business finances with AI-powered tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined, 
        variables: {
          colorPrimary: 'hsl(var(--primary))', 
          colorBackground: 'hsl(var(--card))', 
          colorText: 'hsl(var(--card-foreground))',
          colorInputBackground: 'hsl(var(--input))',
          colorInputText: 'hsl(var(--card-foreground))',
        },
        elements: {
          card: 'bg-card text-card-foreground border-border shadow-xl',
          formButtonPrimary: 'btn-metamask', 
          footerActionLink: 'text-primary hover:text-primary/80',
        }
      }}
    >
      <html lang="en" className={`${ptSans.variable} ${spaceGrotesk.variable}`}>
        <head>
          {/* Using next/font, direct Google Font links removed */}
        </head>
        <body className="font-body antialiased">
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1 md:pl-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
              <div className="p-4 sm:p-6 lg:p-8 fade-in">
                {children}
              </div>
            </main>
            <Toaster />
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
