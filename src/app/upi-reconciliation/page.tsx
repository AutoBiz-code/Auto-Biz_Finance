
"use client";

import { useState, useTransition } from "react";
import { categorizeUpiTransaction, CategorizeUpiTransactionOutput } from "@/ai/flows/categorize-upi-transactions";
import { flagReconciliationDiscrepancies, FlagReconciliationDiscrepanciesOutput } from "@/ai/flows/flag-reconciliation-discrepancies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function UpiReconciliationPage() {
  const [transactionData, setTransactionData] = useState<string>("");
  const [categorizationResult, setCategorizationResult] = useState<CategorizeUpiTransactionOutput | null>(null);
  const [discrepancyResult, setDiscrepancyResult] = useState<FlagReconciliationDiscrepanciesOutput | null>(null);
  
  const [isCategorizing, startCategorizingTransition] = useTransition();
  const [isFlagging, startFlaggingTransition] = useTransition();

  const { toast } = useToast();

  const handleCategorize = async () => {
    if (!transactionData.trim()) {
      toast({ title: "Input Required", description: "Please enter UPI transaction data.", variant: "destructive" });
      return;
    }
    setCategorizationResult(null);
    setDiscrepancyResult(null);
    startCategorizingTransition(async () => {
      try {
        const result = await categorizeUpiTransaction({ transactionData });
        setCategorizationResult(result);
      } catch (error) {
        console.error("Categorization error:", error);
        toast({ title: "Error", description: "Failed to categorize transaction. Please try again.", variant: "destructive" });
      }
    });
  };

  const handleFlagDiscrepancies = async () => {
    if (!transactionData.trim()) {
      toast({ title: "Input Required", description: "Please enter UPI transaction data.", variant: "destructive" });
      return;
    }
    setCategorizationResult(null);
    setDiscrepancyResult(null);
    startFlaggingTransition(async () => {
      try {
        const result = await flagReconciliationDiscrepancies({ upiTransactionData: transactionData });
        setDiscrepancyResult(result);
      } catch (error) {
        console.error("Discrepancy flagging error:", error);
        toast({ title: "Error", description: "Failed to flag discrepancies. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Smart UPI Reconciliation</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-card-foreground">Analyze UPI Transaction</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter unstructured UPI transaction data below. Our AI will help categorize it and flag potential discrepancies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="transactionData" className="text-card-foreground">Transaction Data</Label>
            <Textarea
              id="transactionData"
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              placeholder="Paste UPI transaction details here... e.g., 'UPI/REF12345/JOHN DOE/Payment for goods/AXISBANK'"
              rows={6}
              className="mt-1 bg-white border-input text-card-foreground"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleCategorize} disabled={isCategorizing || isFlagging} className="w-full sm:w-auto">
            {isCategorizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Categorize Transaction
          </Button>
          <Button onClick={handleFlagDiscrepancies} disabled={isCategorizing || isFlagging} variant="outline" className="w-full sm:w-auto">
            {isFlagging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Flag Discrepancies
          </Button>
        </CardFooter>
      </Card>

      {(isCategorizing || isFlagging) && (
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-card-foreground">Analyzing, please wait...</p>
          </CardContent>
        </Card>
      )}

      {categorizationResult && (
        <Card className="shadow-lg fade-in-element">
          <CardHeader>
            <CardTitle className="text-card-foreground">Categorization Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><strong className="text-card-foreground">Category:</strong> <span className="text-muted-foreground">{categorizationResult.category}</span></p>
            <p className="text-sm"><strong className="text-card-foreground">Description:</strong> <span className="text-muted-foreground">{categorizationResult.description}</span></p>
            <p className="text-sm flex items-center">
              <strong className="text-card-foreground">Reconciled:</strong> 
              {categorizationResult.isReconciled ? 
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" /> : 
                <AlertCircle className="h-5 w-5 text-yellow-500 ml-2" />}
              <span className="ml-1 text-muted-foreground">{categorizationResult.isReconciled ? "Yes" : "No"}</span>
            </p>
            {categorizationResult.reconciliationNotes && (
              <p className="text-sm"><strong className="text-card-foreground">Reconciliation Notes:</strong> <span className="text-muted-foreground">{categorizationResult.reconciliationNotes}</span></p>
            )}
          </CardContent>
        </Card>
      )}

      {discrepancyResult && (
        <Card className="shadow-lg fade-in-element">
          <CardHeader>
            <CardTitle className="text-card-foreground">Discrepancy Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <p className="text-sm flex items-center">
              <strong className="text-card-foreground">Discrepancies Found:</strong> 
              {discrepancyResult.discrepanciesFound ? 
                <AlertCircle className="h-5 w-5 text-destructive ml-2" /> : 
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />}
              <span className="ml-1 text-muted-foreground">{discrepancyResult.discrepanciesFound ? "Yes" : "No"}</span>
            </p>
            {discrepancyResult.discrepanciesFound && (
               <p className="text-sm"><strong className="text-card-foreground">Details:</strong> <span className="text-muted-foreground">{discrepancyResult.discrepancyDetails}</span></p>
            )}
             {!discrepancyResult.discrepanciesFound && (
               <p className="text-sm text-muted-foreground">No discrepancies found in the provided transaction data.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
