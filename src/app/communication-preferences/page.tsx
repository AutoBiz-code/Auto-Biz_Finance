
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast"; 
import { BellRing, Mail, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Preferences {
  emailPaymentAlerts: boolean;
  whatsappPaymentAlerts: boolean;
  emailReportDelivery: boolean;
  whatsappReportDelivery: boolean;
}

export default function CommunicationPreferencesPage() {
  const { user, loading: authLoading } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>({
    emailPaymentAlerts: false,
    whatsappPaymentAlerts: true,
    emailReportDelivery: true,
    whatsappReportDelivery: false,
  });
  const [isLoading, setIsLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching preferences. This will now run for guests too.
    setIsLoading(true);
    setTimeout(() => {
      // Example: setPreferences(fetchedPreferencesFromFirestore); 
      setIsLoading(false);
    }, 500);
  }, [user]);


  const handlePreferenceChange = (key: keyof Preferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    // No longer checking for user sign-in
    setIsSaving(true);
    // Simulate saving to backend (e.g., Firestore via a server action or API call for user.uid)
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Preferences saved for user:", user?.uid || 'guest-user', preferences);
    toast({ title: "Success", description: "Communication preferences updated." });
    setIsSaving(false);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold bg-primary-gradient bg-clip-text text-transparent">Communication Preferences</h1>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage how you receive payment alerts and report deliveries from AutoBiz Finance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-3">Payment Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border border-border bg-input hover:bg-input/80 transition-colors">
                <Label htmlFor="emailPaymentAlerts" className="flex items-center gap-2 text-foreground cursor-pointer">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Payment Alerts
                </Label>
                <Switch
                  id="emailPaymentAlerts"
                  checked={preferences.emailPaymentAlerts}
                  onCheckedChange={(value) => handlePreferenceChange("emailPaymentAlerts", value)}
                  aria-label="Toggle email payment alerts"
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border border-border bg-input hover:bg-input/80 transition-colors">
                <Label htmlFor="whatsappPaymentAlerts" className="flex items-center gap-2 text-foreground cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp Payment Alerts
                </Label>
                <Switch
                  id="whatsappPaymentAlerts"
                  checked={preferences.whatsappPaymentAlerts}
                  onCheckedChange={(value) => handlePreferenceChange("whatsappPaymentAlerts", value)}
                  aria-label="Toggle WhatsApp payment alerts"
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-card-foreground mb-3">Report Delivery</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md border border-border bg-input hover:bg-input/80 transition-colors">
                <Label htmlFor="emailReportDelivery" className="flex items-center gap-2 text-foreground cursor-pointer">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Report Delivery
                </Label>
                <Switch
                  id="emailReportDelivery"
                  checked={preferences.emailReportDelivery}
                  onCheckedChange={(value) => handlePreferenceChange("emailReportDelivery", value)}
                  aria-label="Toggle email report delivery"
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border border-border bg-input hover:bg-input/80 transition-colors">
                <Label htmlFor="whatsappReportDelivery" className="flex items-center gap-2 text-foreground cursor-pointer">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  WhatsApp Report Delivery
                </Label>
                <Switch
                  id="whatsappReportDelivery"
                  checked={preferences.whatsappReportDelivery}
                  onCheckedChange={(value) => handlePreferenceChange("whatsappReportDelivery", value)}
                  aria-label="Toggle WhatsApp report delivery"
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto hover-scale">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
