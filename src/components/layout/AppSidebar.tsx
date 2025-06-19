
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
  IndianRupee,
  Bot,
  FileText,
  Settings,
  Target, // Placeholder for logo
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upi-reconciliation", label: "UPI Reconciliation", icon: IndianRupee },
  { href: "/whatsapp-automation", label: "WhatsApp Bot", icon: Bot },
  { href: "/gst-invoicing", label: "GST Invoicing", icon: FileText },
  { href: "/communication-preferences", label: "Preferences", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-semibold group-data-[state=collapsed]:hidden">
            FinanceFlow
          </h1>
        </Link>
        <div className="group-data-[state=expanded]:hidden"> {/* Hide trigger when expanded, show on mobile implicitly by sidebar component */}
           <SidebarTrigger asChild><Button variant="ghost" size="icon"><Settings /></Button></SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "justify-start w-full",
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
    </Sidebar>
  );
}
