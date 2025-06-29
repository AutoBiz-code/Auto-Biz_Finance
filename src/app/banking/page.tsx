
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CheckSquare, Combine, BellRing, Laptop } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banking & Payments | AutoBiz Finance",
  description: "Reconcile bank statements, manage cheques, and track digital payments.",
};

const bankingFeatures = [
    { icon: <Combine className="h-6 w-6 text-primary" />, name: "Bank Reconciliation", description: "Match your bank statements with your books seamlessly." },
    { icon: <CheckSquare className="h-6 w-6 text-primary" />, name: "Cheque Printing", description: "Generate and print cheques in various formats." },
    { icon: <BellRing className="h-6 w-6 text-primary" />, name: "Payment Reminders", description: "Automate follow-ups for outstanding payments." },
    { icon: <Laptop className="h-6 w-6 text-primary" />, name: "Digital Payments Support", description: "Integrate with UPI and other modern payment gateways." },
];


export default function BankingPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Banking & Payments</h1>
        <p className="mt-2 text-muted-foreground">Streamline your cash flow and payment processes. This module is under active development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary" />
            Banking Features
          </CardTitle>
          <CardDescription className="text-muted-foreground">
             Connect your bank, manage payments, and automate reminders.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bankingFeatures.map(feature => (
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
