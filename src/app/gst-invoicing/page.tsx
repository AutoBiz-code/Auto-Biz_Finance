
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GST Billing & Invoicing | AutoBiz Finance",
  description: "Generate GST-compliant PDF invoices with AutoBiz Finance.",
};

// This page might be deprecated in favor of /gst-billing. 
// If so, it can be removed or redirected. For now, it's updated to point to the new page.

export default function GstInvoicingPageRedirect() {
  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">GST Billing and PDF Generation</h1>
      
      <Card className="shadow-lg overflow-hidden bg-card text-card-foreground">
         <div className="md:flex">
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-headline text-card-foreground flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                Effortless GST Bill PDFs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                AutoBiz Finance now offers robust GST bill generation with PDF output. Create detailed invoices and let our system handle the PDF creation for your records and customers.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Input bill details easily through our dedicated form.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Generate GST-compliant PDF invoices via our secure backend.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Reduce manual errors and ensure timely, compliant invoicing.</span>
                </li>
              </ul>
              <div className="mt-8">
                 <Button asChild className="w-full sm:w-auto btn-metamask hover-scale">
                  <Link href="/gst-billing">
                    Go to GST Bill Generation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
           <div className="md:w-1/2 order-1 md:order-2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="GST Bill PDF generation illustration for AutoBiz Finance" 
              width={600} 
              height={400} 
              className="object-cover h-full w-full"
              data-ai-hint="invoice document"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
