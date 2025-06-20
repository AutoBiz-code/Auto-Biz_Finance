
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel, // Added import
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
  UserPlus,
  MessageCircle,
  FileSignature,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/features", label: "Features", icon: Briefcase },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/communication-preferences", label: "Preferences", icon: Settings },
];

const featurePages = [
  { href: "/whatsapp-automation", label: "WhatsApp Bot", icon: MessageCircle },
  { href: "/gst-invoicing", label: "GST Invoicing", icon: FileSignature },
  { href: "/upi-reconciliation", label: "UPI Reconciliation", icon: Zap },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors fade-in" style={{animationDelay: '0.2s'}}>
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold group-data-[state=collapsed]:hidden">
            AutoBiz Finance
          </h1>
        </Link>
        <div className="group-data-[state=expanded]:md:hidden group-data-[state=collapsed]:block">
           <SidebarTrigger asChild><Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary"><Settings /></Button></SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
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
           <SidebarGroupLabel className="group-data-[state=collapsed]:hidden text-xs uppercase text-muted-foreground tracking-wider">Features</SidebarGroupLabel>
          {featurePages.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href} className="fade-in" style={{animationDelay: `${0.4 + navItems.length * 0.1 + index * 0.1}s`}}>
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
        <div className="flex flex-col gap-2 items-center group-data-[state=collapsed]:hidden fade-in" style={{animationDelay: '0.8s'}}>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
          <Button className="w-full btn-metamask">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Button>
        </div>
        <div className="hidden group-data-[state=collapsed]:flex flex-col gap-2 items-center">
           <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary"><LogIn /></Button>
           <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary"><UserPlus /></Button>
        </div>
      </SidebarHeader>
    </Sidebar>
  );
}
