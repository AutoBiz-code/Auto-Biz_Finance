
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, IndianRupee } from "lucide-react";
import { reconcileUPITransactions } from "@/actions/autobiz";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useRouter } from "next/navigation"; // Import useRouter
// Metadata cannot be used in client components like this, moved to layout or parent server component if needed
// import type { Metadata } from "next";
// export const metadata: Metadata = { 
//   title: "UPI Reconciliation (Razorpay) | AutoBiz Finance",
//   description: "Reconcile UPI transactions efficiently with Razorpay integration via AutoBiz Finance.",
// };


export default function UpiReconciliationPage() {
  const [transactionData, setTransactionData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Get user from AuthContext
  const router = useRouter(); // Initialize useRouter

  const handleReconcile = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to perform this action.", variant: "destructive" });
      router.push("/sign-in");
      return;
    }
    if (!transactionData.trim()) {
      toast({ title: "Input Required", description: "Please enter UPI transaction data.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      // In a real app, this would involve more specific data for Razorpay
      const result = await reconcileUPITransactions({ userId: user.uid, rawData: transactionData }); 
      toast({ title: "Success (Simulated)", description: "UPI reconciliation process initiated with Razorpay." });
      console.log("Reconciliation result:", result);
      setTransactionData(""); 
    } catch (error: any) {
      console.error("Reconciliation error:", error);
      toast({ title: "Error (Simulated)", description: error.message || "Failed to initiate UPI reconciliation.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">UPI Reconciliation (Razorpay)</h1>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground">Reconcile UPI Transactions via Razorpay</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter unstructured UPI transaction data below, or connect your Razorpay account (feature coming soon) to automatically reconcile payments with AutoBiz Finance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="transactionData" className="text-card-foreground">Transaction Data (Manual Entry)</Label>
            <Textarea
              id="transactionData"
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              placeholder="Paste UPI transaction details here for manual processing... e.g., 'UPI/REF12345/JOHN DOE/Payment/AXISBANK'"
              rows={6}
              className="mt-1 bg-input border-border text-foreground focus:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReconcile} disabled={isLoading} className="w-full sm:w-auto btn-metamask hover-scale">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <IndianRupee className="mr-2 h-4 w-4" />}
            Initiate Reconciliation
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <Card className="shadow-lg bg-card mt-6">
          <CardContent className="pt-6 flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-card-foreground">Processing with Razorpay, please wait...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
