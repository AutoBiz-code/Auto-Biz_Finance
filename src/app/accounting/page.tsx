
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, DollarSign, FileClock, Scale, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accounting & Ledger | AutoBiz Finance",
  description: "Manage your chart of accounts, journal entries, ledgers, and financial statements.",
};

const accountingFeatures = [
    { icon: <BookOpenCheck className="h-6 w-6 text-primary" />, name: "General Ledger", description: "The master record of all financial transactions." },
    { icon: <DollarSign className="h-6 w-6 text-primary" />, name: "Accounts Receivable & Payable", description: "Track money owed to you and money you owe." },
    { icon: <Scale className="h-6 w-6 text-primary" />, name: "Budgeting & Forecasting", description: "Plan and project your financial future." },
    { icon: <TrendingUp className="h-6 w-6 text-primary" />, name: "Profitability Analysis", description: "Analyze performance by cost centers." },
    { icon: <FileClock className="h-6 w-6 text-primary" />, name: "Financial Statements", description: "Generate Balance Sheets, P&L, and Cash Flow statements." },
];

export default function AccountingPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Accounting & Financial Management</h1>
        <p className="mt-2 text-muted-foreground">The core of your financial operations. This module is under active development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Core Accounting Features
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We are building a robust, double-entry accounting system to ensure accuracy and compliance.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {accountingFeatures.map(feature => (
                    <div key={feature.name} className="flex items-start gap-4 p-4 rounded-lg border bg-input/50">
                        {feature.icon}
                        <div>
                            <h3 className="font-semibold text-card-foreground">{feature.name}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
             <p className="mt-6 text-center text-sm text-primary font-medium">Full functionality for these features is coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
