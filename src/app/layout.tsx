import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Space_Grotesk, PT_Sans } from 'next/font/google';

// Using PT Sans and Space Grotesk as defined in tailwind.config.ts
// If "Matter" font is desired, it would need to be added here.
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
    <ClerkProvider appearance={{
      baseTheme: undefined, // For full control with globals.css if needed, or use Clerk's dark theme: import { dark } from '@clerk/themes'; baseTheme: dark
      variables: {
        colorPrimary: 'hsl(var(--primary))', // Orange
        colorBackground: 'hsl(var(--card))', // Dark card background
        colorText: 'hsl(var(--card-foreground))',
        colorInputBackground: 'hsl(var(--input))',
        colorInputText: 'hsl(var(--card-foreground))',
      },
      elements: {
        card: 'bg-card text-card-foreground border-border shadow-xl',
        formButtonPrimary: 'btn-metamask', // Apply custom button style
        footerActionLink: 'text-primary hover:text-primary/80',
      }
    }}>
      <html lang="en" className={`${ptSans.variable} ${spaceGrotesk.variable}`}>
        <head>
          {/* Removed direct Google Font links, using next/font */}
        </head>
        <body className="font-body antialiased">
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1 md:pl-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
              <div className="p-4 sm:p-6 lg:p-8 fade-in"> {/* Added fade-in class */}
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
