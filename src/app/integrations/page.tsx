
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plug, Share2, Database, Library } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | AutoBiz Finance",
  description: "Connect with third-party apps, export data, and extend functionality.",
};

const integrationFeatures = [
    { icon: <Share2 className="h-6 w-6 text-primary" />, name: "API & Developer Integration", description: "Connect with third-party apps to extend functionality." },
    { icon: <Plug className="h-6 w-6 text-primary" />, name: "Excel/PDF Export", description: "Easily share your financial data and reports." },
    { icon: <Database className="h-6 w-6 text-primary" />, name: "ODBC Connectivity", description: "Link your live data with other external databases." },
    { icon: <Library className="h-6 w-6 text-primary" />, name: "Multi-Company Management", description: "Handle multiple businesses and consolidate reports." },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Integrations & Connectivity</h1>
        <p className="mt-2 text-muted-foreground">Extend your capabilities by connecting to other services. This module is under active development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Plug className="h-6 w-6 text-primary" />
            Connectivity Features
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            This section will allow you to connect to third-party services, manage API keys, and configure data exports.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrationFeatures.map(feature => (
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
