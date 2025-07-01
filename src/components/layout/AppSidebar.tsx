
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
  DollarSign,
  Rocket,
  LogIn,
  LogOut,
  UserPlus,
  UserCircle as UserIcon,
  PanelLeft,
  FileText,
  MessageCircleCode,
  Package,
  BarChartHorizontalBig,
  Users,
  DatabaseBackup,
  Loader2,
  BookOpenCheck,
  Landmark,
  Banknote,
  ShieldCheck,
  Plug,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Home", icon: Home },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/communication-preferences", label: "Preferences", icon: Settings },
];

const featureNavItems = [
  { href: "/gst-billing", label: "GST Billing", icon: FileText },
  { href: "/stock-management", label: "Inventory", icon: Package },
  { href: "/accounting", label: "Accounting", icon: BookOpenCheck },
  { href: "/payroll", label: "Payroll", icon: Users },
  { href: "/taxation", label: "Taxation", icon: Landmark },
  { href: "/banking", label: "Banking", icon: Banknote },
  { href: "/business-analysis", label: "Business Reporting", icon: BarChartHorizontalBig },
  { href: "/data-backup", label: "Data Backup", icon: DatabaseBackup },
  { href: "/security", label: "Security", icon: ShieldCheck },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/whatsapp-auto-reply", label: "AI Assistant", icon: MessageCircleCode },
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
      router.push("/");
    } catch (error) {
      console.error("Sign out error in sidebar:", error);
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors fade-in" style={{ animationDelay: '0.1s' }}>
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
          {mainNavItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href.length > 1);
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                <Link href={item.href} passHref>
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
          {featureNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{ animationDelay: `${0.3 + mainNavItems.length * 0.05 + index * 0.05}s` }}>
                <Link href={item.href} passHref>
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
        {loading ? (
          <div className="flex justify-center items-center h-16 group-data-[state=collapsed]:hidden">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : user ? (
          <>
            {/* Expanded view - logged in */}
            <div className="flex flex-col gap-2 items-start group-data-[state=collapsed]:hidden fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 w-full mb-2 p-2 rounded-md bg-sidebar-accent/30">
                <UserIcon className="h-6 w-6 text-sidebar-primary" />
                <span className="text-sm text-sidebar-foreground truncate" title={user.email || ""}>{user.email || "User"}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
            {/* Collapsed view - logged in */}
            <div className="hidden group-data-[state=collapsed]:flex flex-col gap-2 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary">
                    <LogOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            </div>
          </>
        ) : (
          <>
            {/* Expanded view - logged out */}
            <div className="flex flex-col gap-2 items-start group-data-[state=collapsed]:hidden fade-in" style={{ animationDelay: '0.5s' }}>
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </div>
            {/* Collapsed view - logged out */}
            <div className="hidden group-data-[state=collapsed]:flex flex-col gap-2 items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/sign-in" className="text-sidebar-foreground hover:text-sidebar-primary">
                      <LogIn />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign In</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="icon">
                    <Link href="/sign-up" className="text-sidebar-foreground hover:text-sidebar-primary">
                      <UserPlus />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Up</TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </SidebarHeader>
    </Sidebar>
  );
}
