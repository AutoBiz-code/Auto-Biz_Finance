
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircleCode, Loader2, Wand2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateWhatsAppReply } from "@/ai/flows/generate-whatsapp-reply-flow";

export default function WhatsappAutoReplyPage() {
  const [businessCategory, setBusinessCategory] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loading: authLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // No longer checking for user sign-in

    if (!businessCategory || !customerMessage) {
      toast({ title: "Missing Information", description: "Please provide business category and customer message.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setGeneratedReply("");
    try {
      const result = await generateWhatsAppReply({ businessCategory, customerMessage });
      setGeneratedReply(result.reply);
      toast({ title: "Reply Generated", description: "AI has crafted a response." });
    } catch (error: any) {
      console.error("WhatsApp reply generation error:", error);
      toast({ title: "Error Generating Reply", description: error.message || "Failed to generate AI reply.", variant: "destructive" });
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">AI WhatsApp Reply Generator</h1>
        <p className="mt-2 text-muted-foreground">Generate contextual replies for customer messages using Gemini AI.</p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <MessageCircleCode className="h-6 w-6 text-primary" />
            Craft a Reply
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your business type and the customer's message to get an AI-generated reply suggestion.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessCategory" className="text-card-foreground">Business Category/Type</Label>
              <Input
                id="businessCategory"
                type="text"
                placeholder="e.g., E-commerce Store, Local Bakery, SaaS Provider"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerMessage" className="text-card-foreground">Customer's WhatsApp Message</Label>
              <Textarea
                id="customerMessage"
                placeholder="e.g., Hi, I'd like to know the status of my order #12345."
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                required
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Reply
            </Button>
          </CardFooter>
        </form>
        {generatedReply && (
          <CardContent className="mt-6 border-t border-border pt-6">
            <h3 className="text-lg font-medium text-card-foreground mb-2">Suggested Reply:</h3>
            <div className="p-4 rounded-md bg-input border border-border text-foreground whitespace-pre-wrap">
              {generatedReply}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
