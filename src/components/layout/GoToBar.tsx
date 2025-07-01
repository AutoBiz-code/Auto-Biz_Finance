
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface GoToBarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const allPages = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/communication-preferences", label: "Preferences" },
  { href: "/gst-billing", label: "GST Billing" },
  { href: "/stock-management", label: "Inventory" },
  { href: "/accounting", label: "Accounting" },
  { href: "/payroll", label: "Payroll" },
  { href: "/taxation", label: "Taxation" },
  { href: "/banking", label: "Banking" },
  { href: "/business-analysis", label: "Business Reporting" },
  { href: "/data-backup", label: "Data Backup" },
  { href: "/security", label: "Security" },
  { href: "/integrations", label: "Integrations" },
  { href: "/whatsapp-auto-reply", label: "AI Assistant" },
];

export function GoToBar({ isOpen, setIsOpen }: GoToBarProps) {
    const [search, setSearch] = useState('');
    const pathname = usePathname();

    const filteredPages = allPages.filter(page => 
        page.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setSearch(''); // Reset search on open
        }
    }, [isOpen]);

    // Close bar on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, setIsOpen]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Go To</DialogTitle>
                    <DialogDescription>
                        Quickly navigate to any page. (Press Alt+G to open)
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search for a page..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                            autoFocus
                        />
                    </div>
                    <ul className="mt-4 max-h-[300px] overflow-y-auto">
                        {filteredPages.map(page => (
                            <li key={page.href}>
                                <Link href={page.href} passHref>
                                    <div className="block p-3 -mx-3 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                        {page.label}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
}
