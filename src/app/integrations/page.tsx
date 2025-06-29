
"use client";

import { useState, type FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plug, KeyRound, Loader2 } from "lucide-react";
import { saveApiKeysAction } from "@/actions/autobiz-features";
import { useAuth } from "@/contexts/AuthContext";

export default function IntegrationsPage() {
  const [razorpayKey, setRazorpayKey] = useState("");
  const [whatsappKey, setWhatsappKey] = useState("");
  const [botpressKey, setBotpressKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const result = await saveApiKeysAction({
        userId: user?.uid || "guest-user",
        razorpayKey,
        whatsappKey,
        botpressKey,
      });
      toast({ title: "Success", description: result.message });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save connections.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Integrations & Connectivity</h1>
        <p className="mt-2 text-muted-foreground">Extend your capabilities by connecting to other services.</p>
      </header>
      
      <Card className="max-w-2xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Plug className="h-6 w-6 text-primary" />
            Manage Connections
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Securely connect to third-party services by providing your API keys. These keys are illustrative and would be stored securely on the backend in a real app.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="razorpayKey" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Razorpay API Key
              </Label>
              <Input
                id="razorpayKey"
                type="password"
                placeholder="Enter Razorpay Key"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappKey" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                WhatsApp API Key
              </Label>
              <Input
                id="whatsappKey"
                type="password"
                placeholder="Enter WhatsApp Business API Key"
                value={whatsappKey}
                onChange={(e) => setWhatsappKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botpressKey" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                Botpress API Key
              </Label>
              <Input
                id="botpressKey"
                type="password"
                placeholder="Enter Botpress API Key"
                value={botpressKey}
                onChange={(e) => setBotpressKey(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-tally-gradient" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plug className="mr-2 h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Connections"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
