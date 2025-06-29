
"use client";

import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileClock, Scale, TrendingUp, Filter, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportReportAction } from "@/actions/autobiz-features";
import React, { Suspense, lazy } from 'react';

const GeneralLedger = lazy(() => import('@/components/features/GeneralLedger'));

// export const metadata: Metadata = {
//   title: "Accounting & Ledger | AutoBiz Finance",
//   description: "Manage your chart of accounts, journal entries, ledgers, and financial statements.",
// };

const otherFeatures = [
    { icon: <DollarSign className="h-6 w-6 text-primary" />, name: "Accounts Receivable & Payable" },
    { icon: <Scale className="h-6 w-6 text-primary" />, name: "Budgeting & Forecasting" },
    { icon: <TrendingUp className="h-6 w-6 text-primary" />, name: "Profitability Analysis" },
    { icon: <FileClock className="h-6 w-6 text-primary" />, name: "Financial Statements" },
];


export default function AccountingPage() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportReportAction({ reportType: 'General Ledger', format: 'PDF' });
      if (result.success) {
        toast({
          title: "Export Successful",
          description: "Your General Ledger report is ready for download.",
          action: (
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">Download</Button>
            </a>
          ),
        });
      } else {
        toast({ title: "Export Failed", description: result.error || "Could not export the report.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling exportReportAction:", error);
      toast({ title: "Export Failed", description: "A critical error occurred. Please check the console.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
       <head>
          <title>Accounting & Ledger | AutoBiz Finance</title>
          <meta name="description" content="Manage your chart of accounts, journal entries, ledgers, and financial statements." />
        </head>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-semibold text-foreground">Accounting & Financial Management</h1>
          <p className="mt-2 text-muted-foreground">The core of your financial operations, featuring the General Ledger.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Date
            </Button>
             <Button onClick={handleExport} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
        </div>
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
