
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, FileText, FileDigit, Scissors } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taxation & Compliance | AutoBiz Finance",
  description: "Handle GST returns, TDS/TCS, and stay compliant with automated tax calculations.",
};

const taxFeatures = [
    { icon: <FileText className="h-6 w-6 text-primary" />, name: "Automated GST Calculations", description: "Supports CGST, SGST, and IGST for all transactions." },
    { icon: <FileDigit className="h-6 w-6 text-primary" />, name: "GST Returns Filing", description: "Prepare and file GSTR-1, GSTR-3B, GSTR-4, and GSTR-9." },
    { icon: <Scissors className="h-6 w-6 text-primary" />, name: "TDS & TCS Management", description: "Deduct, track, and manage tax deducted/collected at source." },
    { icon: <FileText className="h-6 w-6 text-primary" />, name: "E-Invoicing & E-Way Bill", description: "Generate IRN, QR codes, and e-way bills for compliance." },
];

export default function TaxationPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Taxation & Compliance</h1>
        <p className="mt-2 text-muted-foreground">Stay compliant with automated tax features. This module is under active development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Landmark className="h-6 w-6 text-primary" />
            Compliance Tools
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            The taxation module will automate calculations and help you prepare and file returns directly from the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxFeatures.map(feature => (
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
