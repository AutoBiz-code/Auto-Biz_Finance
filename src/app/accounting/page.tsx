
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileClock, Scale, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneralLedger } from "@/components/features/GeneralLedger";

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
          <h1 className="text-3xl font-headline font-semibold text-foreground">Accounting & Financial Management</h1>
          <p className="mt-2 text-muted-foreground">The core of your financial operations, featuring the General Ledger.</p>
        </div>
        <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter by Date
        </Button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Ledger takes up the full width on mobile, and 2/3 on desktop */}
        <GeneralLedger />

        {/* Other features sidebar */}
        <div className="space-y-6 lg:col-span-1">
            <Card className="shadow-lg bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-card-foreground">Other Modules</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {otherFeatures.map(feature => (
                            <div key={feature.name} className="flex items-center gap-4 p-3 rounded-lg border bg-input/50 hover:bg-accent transition-colors cursor-pointer">
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
