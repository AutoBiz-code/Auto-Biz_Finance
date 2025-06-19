
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FileText, Zap } from "lucide-react";

export default function GstInvoicingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Automated GST Invoicing</h1>
      
      <Card className="shadow-lg overflow-hidden">
         <div className="md:flex">
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-headline text-card-foreground flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                Effortless Invoice Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                Automate your GST invoice generation process by connecting your financial data sources. Our system fetches relevant information and generates GST-compliant invoices through ClearTax integration, ensuring accuracy and saving valuable time.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Fetch data automatically from integrated accounting systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Generate GST-compliant invoices via ClearTax.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Reduce manual errors and ensure timely invoicing.</span>
                </li>
              </ul>
              <CardDescription className="text-sm text-muted-foreground mt-6">
                Note: This feature requires integration with ClearTax and relevant data sources. Setup instructions will be provided.
              </CardDescription>
            </CardContent>
          </div>
           <div className="md:w-1/2 order-1 md:order-2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="GST Invoicing illustration" 
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
