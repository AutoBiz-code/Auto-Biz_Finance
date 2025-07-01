
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BarChartHorizontalBig, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeBusinessDataAction } from "@/actions/autobiz-features";

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
    setAnalysisResult(null);

    if (!razorpayKey && !whatsappKey && !botpressKey) {
      toast({ title: "API Key Required", description: "Please enter at least one API key.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeBusinessDataAction({ userId: user?.uid || "guest-user", razorpayKey, whatsappKey, botpressKey });
      
      if (result.success) {
        setAnalysisResult(result.analysisData);
        toast({
          title: "Business Analysis Completed (Simulated)",
          description: `Data processing finished. ${result.message}`,
        });
      } else {
        toast({ title: "Error", description: result.error || "Failed to run business analysis.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling analyzeBusinessDataAction:", error);
      toast({ title: "Critical Error", description: "A critical error occurred. Please check the console.", variant: "destructive" });
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
        <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Business Reporting & Analysis</h1>
        <p className="mt-2 text-muted-foreground">Connect your services to analyze payments and business data.</p>
      </header>

      <Card className="max-w-xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20">
        <CardHeader>
          <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent flex items-center gap-2">
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
                type="password"
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
            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChartHorizontalBig className="mr-2 h-4 w-4" />}
              Analyze Business Data
            </Button>
          </CardFooter>
        </form>
        {analysisResult && (
          <CardContent className="mt-6 border-t border-border pt-6">
            <h3 className="text-lg font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">Analysis Results (Simulated):</h3>
            <pre className="p-4 rounded-md bg-input border border-border text-foreground text-xs overflow-x-auto">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
