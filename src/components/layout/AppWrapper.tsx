
"use client";

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { GoToBar } from '@/components/layout/GoToBar';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicRoutes = ["/", "/sign-in", "/sign-up", "/pricing"];
const authPages = ["/sign-in", "/sign-up"];

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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isPublic = publicRoutes.includes(pathname);
  const isAuthPage = authPages.includes(pathname);
  
  // SCENARIO 1: User is LOGGED IN
  if (user) {
    // If they are on the landing page or an auth page, redirect to dashboard
    if (isAuthPage || pathname === '/') {
      router.replace('/dashboard');
      // Show loader during redirect
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    // Otherwise, they are on a protected page, show the app layout
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

  // SCENARIO 2: User is LOGGED OUT
  if (!user) {
    // If they are on a protected page, redirect to sign-in
    if (!isPublic) {
      router.replace('/sign-in');
      // Show loader during redirect
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }
    // Otherwise, they are on a public page, show it without the app layout
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return null;
}
