
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Mail, MessageCircle } from "lucide-react";

interface Preferences {
  emailPaymentAlerts: boolean;
  whatsappPaymentAlerts: boolean;
  emailReportDelivery: boolean;
  whatsappReportDelivery: boolean;
}

export default function CommunicationPreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    emailPaymentAlerts: false,
    whatsappPaymentAlerts: true,
    emailReportDelivery: true,
    whatsappReportDelivery: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate loading preferences from a backend
  useEffect(() => {
    setIsLoading(true);
    // In a real app, fetch these from user settings
    setTimeout(() => {
      // Example: setPreferences(fetchedPreferences);
      setIsLoading(false);
    }, 500);
  }, []);


  const handlePreferenceChange = (key: keyof Preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    // Simulate saving to backend
    setTimeout(() => {
      console.log("Preferences saved:", preferences);
      toast({ title: "Success", description: "Communication preferences updated successfully." });
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading && !preferences.emailPaymentAlerts && !preferences.whatsappPaymentAlerts) { // Only show full loader on initial load
    return (
      <div className="flex justify-center items-center h-64">
        <BellRing className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Communication Preferences</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage how you receive payment alerts and report deliveries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-3">Payment Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border border-input bg-card hover:bg-muted/50 transition-colors">
                <Label htmlFor="emailPaymentAlerts" className="flex items-center gap-2 text-card-foreground cursor-pointer">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Payment Alerts
                </Label>
                <Switch
                  id="emailPaymentAlerts"
                  checked={preferences.emailPaymentAlerts}
                  onCheckedChange={(value) => handlePreferenceChange("emailPaymentAlerts", value)}
                  aria-label="Toggle email payment alerts"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border border-input bg-card hover:bg-muted/50 transition-colors">
                <Label htmlFor="whatsappPaymentAlerts" className="flex items-center gap-2 text-card-foreground cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp Payment Alerts
                </Label>
                <Switch
                  id="whatsappPaymentAlerts"
                  checked={preferences.whatsappPaymentAlerts}
                  onCheckedChange={(value) => handlePreferenceChange("whatsappPaymentAlerts", value)}
                  aria-label="Toggle WhatsApp payment alerts"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-3">Report Delivery</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border border-input bg-card hover:bg-muted/50 transition-colors">
                <Label htmlFor="emailReportDelivery" className="flex items-center gap-2 text-card-foreground cursor-pointer">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Report Delivery
                </Label>
                <Switch
                  id="emailReportDelivery"
                  checked={preferences.emailReportDelivery}
                  onCheckedChange={(value) => handlePreferenceChange("emailReportDelivery", value)}
                  aria-label="Toggle email report delivery"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border border-input bg-card hover:bg-muted/50 transition-colors">
                <Label htmlFor="whatsappReportDelivery" className="flex items-center gap-2 text-card-foreground cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp Report Delivery
                </Label>
                <Switch
                  id="whatsappReportDelivery"
                  checked={preferences.whatsappReportDelivery}
                  onCheckedChange={(value) => handlePreferenceChange("whatsappReportDelivery", value)}
                  aria-label="Toggle WhatsApp report delivery"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveChanges} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

