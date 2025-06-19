
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Bot, Settings2 } from "lucide-react";

export default function WhatsappAutomationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Automated WhatsApp Communication</h1>
      
      <Card className="shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="WhatsApp Automation illustration" 
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
                Streamline Your Messaging
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CardDescription className="text-base text-muted-foreground mb-6">
                Integrate seamlessly with Botpress to automate your WhatsApp responses. Utilize predefined templates and intelligent triggers to handle common queries, send alerts, and engage with customers 24/7.
              </CardDescription>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Configure predefined message templates for various scenarios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Set up automated triggers based on transaction events or customer actions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Settings2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>Provide instant support and improve customer satisfaction.</span>
                </li>
              </ul>
              <CardDescription className="text-sm text-muted-foreground mt-6">
                Note: This feature requires integration with a Botpress account. Configuration details will be available in the settings panel.
              </CardDescription>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
