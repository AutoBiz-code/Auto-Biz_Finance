
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  Briefcase, 
  DollarSign, 
  Rocket, 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/features", label: "Features", icon: Briefcase },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/communication-preferences", label: "Preferences", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors fade-in" style={{animationDelay: '0.2s'}}>
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold group-data-[state=collapsed]:hidden">
            AutoBiz Finance
          </h1>
        </Link>
        <div className="group-data-[state=expanded]:hidden">
           <SidebarTrigger asChild><Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-primary"><Settings /></Button></SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
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
                    <>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarHeader className="p-4 mt-auto"> 
      </SidebarHeader>
    </Sidebar>
  );
}
