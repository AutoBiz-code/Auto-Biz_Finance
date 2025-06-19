
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
  Briefcase, // Placeholder for Features
  DollarSign, // Placeholder for Pricing
  Rocket, // Placeholder for AutoBiz logo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "justify-start w-full text-sidebar-foreground",
                       isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={{ children: item.label, side: "right", align: "center" }}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarHeader className="p-4 mt-auto"> {/* Footer for auth */}
        <SignedIn>
          <div className="flex items-center justify-center group-data-[state=collapsed]:hidden">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "bg-card border-border text-card-foreground",
              }
            }}/>
          </div>
           <div className="hidden items-center justify-center group-data-[state=collapsed]:flex">
             <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                 userButtonPopoverCard: "bg-card border-border text-card-foreground",
              }
            }}/>
          </div>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="w-full group-data-[state=collapsed]:px-2 btn-metamask">
               <span className="group-data-[state=collapsed]:hidden">Sign In</span>
               <span className="hidden group-data-[state=collapsed]:inline">In</span>
            </Button>
          </SignInButton>
        </SignedOut>
      </SidebarHeader>
    </Sidebar>
  );
}
