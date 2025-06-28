
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plug, Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | AutoBiz Finance",
  description: "Connect with third-party apps, export data, and extend functionality.",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Integrations & Connectivity</h1>
        <p className="mt-2 text-muted-foreground">This feature is under development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Plug className="h-6 w-6 text-primary" />
            Coming Soon
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            This section will allow you to connect to various third-party services, manage API keys, and configure data export options to formats like Excel and PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
