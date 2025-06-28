
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Access | AutoBiz Finance",
  description: "Control user roles, manage permissions, and view audit logs.",
};

export default function SecurityPage() {
  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Security & Access Control</h1>
        <p className="mt-2 text-muted-foreground">This feature is under development.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Coming Soon
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            The security module will provide granular control over user roles and permissions, along with a detailed audit log to track all activities within your organization.
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
