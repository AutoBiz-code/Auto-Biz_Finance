
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  DollarSign,
  Rocket,
  LogIn,
  LogOut,
  UserPlus,
  MessageCircle,
  FileSignature,
  Zap,
  UserCircle as UserIcon, // Renamed to avoid conflict with local User type
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/features", label: "Features", icon: Briefcase },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
];

const featurePages = [
  { href: "/whatsapp-automation", label: "WhatsApp Bot", icon: MessageCircle },
  { href: "/gst-invoicing", label: "GST Invoicing", icon: FileSignature },
  { href: "/upi-reconciliation", label: "UPI Reconciliation", icon: Zap },
  { href: "/communication-preferences", label: "Preferences", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut: firebaseSignOut, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error in sidebar:", error);
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors fade-in" style={{animationDelay: '0.1s'}}>
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold group-data-[state=collapsed]:hidden">
            AutoBiz Finance
          </h1>
        </Link>
        <div className="group-data-[state=expanded]:md:hidden group-data-[state=collapsed]:block">
           <SidebarTrigger asChild>
             <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary">
               <PanelLeft />
             </Button>
           </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{animationDelay: `${0.2 + index * 0.05}s`}}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "justify-start w-full text-sidebar-foreground",
                       isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        
        <SidebarMenu className="mt-4">
           <SidebarGroupLabel className="group-data-[state=collapsed]:hidden text-xs uppercase text-muted-foreground tracking-wider">Tools</SidebarGroupLabel>
          {featurePages.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{animationDelay: `${0.3 + navItems.length * 0.05 + index * 0.05}s`}}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "justify-start w-full text-sidebar-foreground",
                       isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                  >
                     <span className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarHeader className="p-4 mt-auto border-t border-sidebar-border"> 
        {!loading && (
          user ? (
            <div className="flex flex-col gap-2 items-start group-data-[state=collapsed]:hidden fade-in" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center gap-2 w-full mb-2 p-2 rounded-md bg-sidebar-accent/30">
                <UserIcon className="h-6 w-6 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground truncate" title={user.email || ""}>{user.email || "User"}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center group-data-[state=collapsed]:hidden fade-in" style={{animationDelay: '0.5s'}}>
              <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/sign-in">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Link>
              </Button>
              <Button asChild className="w-full btn-metamask">
                <Link href="/sign-up">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </div>
          )
        )}
        {!loading && (
          <div className="hidden group-data-[state=collapsed]:flex flex-col gap-2 items-center">
            {user ? (
              <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary" title="Sign Out">
                <LogOut />
              </Button>
            ) : (
              <>
                <Link href="/sign-in" passHref>
                  <Button asChild variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary" title="Sign In">
                     <LogIn />
                  </Button>
                </Link>
                <Link href="/sign-up" passHref>
                  <Button asChild variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary" title="Sign Up">
                    <UserPlus />
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </SidebarHeader>
    </Sidebar>
  );
}
