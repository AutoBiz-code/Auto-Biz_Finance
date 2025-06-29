
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageCircleCode, Settings2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI WhatsApp Reply Automation | AutoBiz Finance",
  description: "Streamline customer communication with Gemini-powered AI WhatsApp replies by AutoBiz Finance.",
};

export default function WhatsappAutomationPageRedirect() {
  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">AI-Powered WhatsApp Reply Automation</h1>
      
      <Card className="shadow-lg overflow-hidden bg-card text-card-foreground">
        <div className="md:flex">
          <div className="md:w-1/2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="AI WhatsApp Reply Automation with Gemini illustration for AutoBiz Finance" 
              width={600} 
              height={400} 
              className="object-cover h-full w-full"
              data-ai-hint="ai messaging"
            />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-headline text-card-foreground flex items-center gap-2">
                <MessageCircleCode className="h-7 w-7 text-primary" />
                Feature Integrated
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                This feature is now part of the **AI WhatsApp Assistant**. Use Gemini AI to generate contextual and professional replies to customer messages, enhancing customer satisfaction and operational efficiency.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Input business context and customer messages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Receive AI-crafted reply suggestions instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Streamline your customer communication workflow.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild className="w-full sm:w-auto hover-scale">
                  <Link href="/whatsapp-auto-reply">
                    Go to AI Reply Generator
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
