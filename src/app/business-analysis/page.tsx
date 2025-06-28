"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BarChartHorizontalBig, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeBusinessDataAction } from "@/actions/autobiz-features"; // Placeholder

export default function BusinessAnalysisPage() {
  const [razorpayKey, setRazorpayKey] = useState("");
  const [whatsappKey, setWhatsappKey] = useState("");
  const [botpressKey, setBotpressKey] = useState("");
  const [analysisResult, setAnalysisResult] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // No longer checking for user sign-in

    // Basic validation for key presence, real validation would be more complex
    if (!razorpayKey && !whatsappKey && !botpressKey) {
      toast({ title: "API Key Required", description: "Please enter at least one API key.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    try {
      // In a real app, this server action would securely trigger a Cloud Function.
      // The Cloud Function would use these keys to fetch data from the respective APIs.
      // IMPORTANT: Handling API keys client-side like this is NOT secure for production.
      // They should be managed server-side (e.g., stored securely per user and used by Cloud Functions).
      const result = await analyzeBusinessDataAction({ userId: user?.uid || "guest-user", razorpayKey, whatsappKey, botpressKey });
      
      setAnalysisResult(result.analysisData); // Assuming result has analysisData
      toast({
        title: "Business Analysis Initiated (Simulated)",
        description: `Data processing started. ${result.message}`,
      });
    } catch (error: any) {
      console.error("Business analysis error:", error);
      toast({ title: "Error", description: error.message || "Failed to initiate business analysis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Business Performance Analysis</h1>
        <p className="mt-2 text-muted-foreground">Connect your services to analyze payments and business data.</p>
      </header>

      <Card className="max-w-xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <KeyRound className="h-6 w-6 text-primary" />
            Connect API Keys
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your API keys to fetch and analyze data. These keys are illustrative and would be handled securely on the backend in a real application.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="razorpayKey" className="text-card-foreground">Razorpay API Key (Illustrative)</Label>
              <Input
                id="razorpayKey"
                type="password" // Use password type for sensitive-looking fields
                placeholder="Enter Razorpay Key"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappKey" className="text-card-foreground">WhatsApp API Key (Illustrative)</Label>
              <Input
                id="whatsappKey"
                type="password"
                placeholder="Enter WhatsApp Key"
                value={whatsappKey}
                onChange={(e) => setWhatsappKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="botpressKey" className="text-card-foreground">Botpress API Key (Illustrative)</Label>
              <Input
                id="botpressKey"
                type="password"
                placeholder="Enter Botpress Key"
                value={botpressKey}
                onChange={(e) => setBotpressKey(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-metamask" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChartHorizontalBig className="mr-2 h-4 w-4" />}
              Analyze Business Data
            </Button>
          </CardFooter>
        </form>
        {analysisResult && (
          <CardContent className="mt-6 border-t border-border pt-6">
            <h3 className="text-lg font-medium text-card-foreground mb-2">Analysis Results (Simulated):</h3>
            <pre className="p-4 rounded-md bg-input border border-border text-foreground text-xs overflow-x-auto">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
