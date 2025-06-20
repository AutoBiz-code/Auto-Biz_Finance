
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { generateGstPdfAction } from "@/actions/autobiz-features"; // Placeholder

export default function GstBillingPage() {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState(""); // Comma-separated or one item per line
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to generate GST bills.", variant: "destructive" });
      router.push("/sign-in");
      return;
    }
    if (!customerName || !amount || !items) {
      toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would call a server action that triggers a Cloud Function
      // The Cloud Function would use LaTeX or another library to generate the PDF
      // and then store it in Firebase Storage, returning the URL.
      const itemsArray = items.split('\n').map(item => item.trim()).filter(item => item.length > 0);
      const result = await generateGstPdfAction({ userId: user.uid, customerName, amount: parseFloat(amount), items: itemsArray });
      
      toast({
        title: "GST Bill PDF Generation Initiated (Simulated)",
        description: `PDF for ${customerName} is being generated. Result: ${result.message}`,
      });
      // Potentially display a link to the PDF if URL is returned: result.pdfUrl
      setCustomerName("");
      setAmount("");
      setItems("");
    } catch (error: any) {
      console.error("GST Bill generation error:", error);
      toast({ title: "Error", description: error.message || "Failed to initiate PDF generation.", variant: "destructive" });
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">GST Bill Generation</h1>
        <p className="mt-2 text-muted-foreground">Create and generate GST-compliant bills as PDFs.</p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <FileText className="h-6 w-6 text-primary" />
            New GST Bill
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the details below to generate a new GST bill. The PDF will be generated via a secure backend process.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-card-foreground">Customer Name</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="e.g., Acme Corp"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-card-foreground">Total Amount (INR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 1250.75"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items" className="text-card-foreground">Items (One item per line with description and quantity)</Label>
              <Textarea
                id="items"
                placeholder="e.g., Product A - 2 units\nService B - 1 month"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                required
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-metamask" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate GST PDF
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
