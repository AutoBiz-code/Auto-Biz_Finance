
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileText, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Invoicing (ClearTax) | AutoBiz Finance",
};

export default function GstInvoicingPage() {
  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Automated GST Invoicing (ClearTax)</h1>
      
      <Card className="shadow-lg overflow-hidden bg-card text-card-foreground">
         <div className="md:flex">
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-headline text-card-foreground flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                Effortless Invoice Generation with ClearTax
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                Automate your GST invoice generation by connecting with ClearTax. Our system helps fetch relevant data and generate GST-compliant invoices, ensuring accuracy and saving valuable time for your SME.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Integrate your accounting data for seamless invoice creation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Generate and send GST-compliant invoices via ClearTax API.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Reduce manual errors and ensure timely, compliant invoicing.</span>
                </li>
              </ul>
              <div className="mt-8">
                 <Button className="w-full sm:w-auto btn-metamask hover-scale">
                  Connect ClearTax Account (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </div>
           <div className="md:w-1/2 order-1 md:order-2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="GST Invoicing with ClearTax illustration" 
              width={600} 
              height={400} 
              className="object-cover h-full w-full"
              data-ai-hint="invoice document tax"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
