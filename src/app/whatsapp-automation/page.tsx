
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Bot, Settings2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp Automation (Botpress) | AutoBiz Finance",
  description: "Streamline customer communication with Botpress-powered WhatsApp automation by AutoBiz Finance.",
};

export default function WhatsappAutomationPage() {
  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Automated WhatsApp Communication (Botpress)</h1>
      
      <Card className="shadow-lg overflow-hidden bg-card text-card-foreground">
        <div className="md:flex">
          <div className="md:w-1/2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="WhatsApp Automation with Botpress illustration for AutoBiz Finance" 
              width={600} 
              height={400} 
              className="object-cover h-full w-full"
              data-ai-hint="messaging automation"
            />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-headline text-card-foreground flex items-center gap-2">
                <Bot className="h-7 w-7 text-primary" />
                Streamline Your Messaging with Botpress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                Integrate seamlessly with Botpress to automate your WhatsApp responses using AutoBiz Finance. Utilize predefined templates and intelligent triggers to handle common queries, send alerts, and engage with customers 24/7. Enhance customer satisfaction and operational efficiency for your SME in Gurugram.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Connect your Botpress instance to manage conversations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Design conversational flows for various financial queries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Automate payment reminders and status updates.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button className="w-full sm:w-auto btn-metamask hover-scale">
                  Configure Botpress Integration (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

