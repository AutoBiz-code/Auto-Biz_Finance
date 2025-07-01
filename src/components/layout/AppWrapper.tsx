"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Define all pages that do NOT require authentication to view.
const publicRoutes = ["/", "/sign-in", "/sign-up", "/pricing"];

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [isGoToBarOpen, setIsGoToBarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGoToBarOpen(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Show a loader while authentication status is being determined.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const isPublicPage = publicRoutes.includes(pathname);

  // 2. Handle routing for LOGGED-OUT users.
  if (!user) {
    // If a logged-out user is on a public page (like the landing page), show it.
    if (isPublicPage) {
        return (
            <>
              {children}
              <Toaster />
            </>
        )
    }
    // Otherwise, they are on a protected page, so redirect to sign-in.
    else {
      router.replace('/sign-in');
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
    }
  }

  // 3. Handle routing for LOGGED-IN users.
  if (user) {
    // If a logged-in user is on the landing, sign-in, or sign-up page, redirect to dashboard.
    if (pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up') {
      router.replace('/dashboard');
      return (
          <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
    }
  }

  // 4. If none of the above conditions caused a redirect, the user is logged in
  //    and on a page that should be displayed within the main app layout.
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
