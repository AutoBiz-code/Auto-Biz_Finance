
"use client";

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicPages = ['/', '/sign-in', '/sign-up', '/pricing'];
const authPages = ['/sign-in', '/sign-up'];

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isGoToBarOpen, setIsGoToBarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGoToBarOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  // Use an effect to handle all redirection logic. This prevents calling router.replace during render.
  React.useEffect(() => {
    if (loading) return; // Don't redirect until authentication state is loaded

    const isAuthPage = authPages.includes(pathname);
    const isPublicPage = publicPages.includes(pathname);

    // If logged in, redirect from auth/landing pages to the dashboard.
    if (user && (isAuthPage || pathname === '/')) {
      console.log('User authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }

    // If logged out, redirect from protected pages to sign-in.
    if (!user && !isPublicPage) {
      console.log('User not authenticated, redirecting to sign-in');
      router.replace('/sign-in');
    }
  }, [user, loading, pathname, router]);

  // While loading auth state, show a global loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthPage = authPages.includes(pathname);
  const isPublicPage = publicPages.includes(pathname);

  // Conditions for showing a loader during redirection to prevent content flash.
  // 1. User is logged in but is still on a page they should be redirected from.
  const isRedirectingToDashboard = user && (isAuthPage || pathname === '/');
  // 2. User is logged out but is on a protected page.
  const isRedirectingToSignIn = !user && !isPublicPage;

  if (isRedirectingToDashboard || isRedirectingToSignIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in and on a protected page, show the full app layout.
  if (user) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="flex-1 md:pl-[var(--sidebar-width)] group-data-[sidebar-state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
          <div className="p-4 sm:p-6 lg:p-8 fade-in">
            {children}
          </div>
        </main>
        <Toaster />
        <GoToBar isOpen={isGoToBarOpen} setIsOpen={setIsGoToBarOpen} />
      </SidebarProvider>
    );
  }

  // If user is logged out and on a public page, show the simple layout.
  if (!user && isPublicPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // Fallback case, should not be reached often but good for safety.
  return null;
}
