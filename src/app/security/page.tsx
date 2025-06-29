
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Lock, History, Wifi } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Access | AutoBiz Finance",
  description: "Control user roles, manage permissions, and view audit logs.",
};

const securityFeatures = [
    { icon: <Users className="h-6 w-6 text-primary" />, name: "User Roles & Permissions", description: "Restrict access to sensitive data based on employee roles." },
    { icon: <Lock className="h-6 w-6 text-primary" />, name: "Data Encryption", description: "Your financial data is encrypted at rest and in transit." },
    { icon: <History className="h-6 w-6 text-primary" />, name: "Audit Logs", description: "Track all important actions and changes made by users." },
    { icon: <Wifi className="h-6 w-6 text-primary" />, name: "Secure Remote Access", description: "Access your company data securely from anywhere." },
];

export default function SecurityPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Security & Access Control</h1>
        <p className="mt-2 text-muted-foreground">Protect your financial data with granular controls. This module is under active development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Security Features
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            This module will provide granular control over user roles, permissions, and a detailed audit log.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityFeatures.map(feature => (
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
