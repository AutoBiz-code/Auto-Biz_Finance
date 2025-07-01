
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileClock, Scale, TrendingUp, Loader2 } from "lucide-react";
import React, { Suspense } from 'react';
import GeneralLedger from '@/components/features/GeneralLedger';
import AccountingActions from "@/components/features/AccountingActions";

export const metadata: Metadata = {
  title: "Accounting & Ledger | AutoBiz Finance",
  description: "Manage your chart of accounts, journal entries, ledgers, and financial statements.",
};

const otherFeatures = [
    { icon: <DollarSign className="h-6 w-6 text-primary" />, name: "Accounts Receivable & Payable" },
    { icon: <Scale className="h-6 w-6 text-primary" />, name: "Budgeting & Forecasting" },
    { icon: <TrendingUp className="h-6 w-6 text-primary" />, name: "Profitability Analysis" },
    { icon: <FileClock className="h-6 w-6 text-primary" />, name: "Financial Statements" },
];


export default function AccountingPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold bg-primary-gradient bg-clip-text text-transparent">Accounting & Financial Management</h1>
          <p className="mt-2 text-muted-foreground">The core of your financial operations, featuring the General Ledger.</p>
        </div>
        <AccountingActions />
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Suspense fallback={
          <div className="lg:col-span-2 flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        }>
          <GeneralLedger />
        </Suspense>

        {/* Other features sidebar */}
        <div className="space-y-6 lg:col-span-1">
            <Card className="shadow-lg bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-card-foreground">Other Modules</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {otherFeatures.map(feature => (
                            <div key={feature.name} className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                                {feature.icon}
                                <h3 className="font-semibold text-card-foreground">{feature.name}</h3>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
