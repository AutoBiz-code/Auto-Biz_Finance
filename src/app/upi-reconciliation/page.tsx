
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, IndianRupee, BarChartHorizontalBig } from "lucide-react";
// import { reconcileUPITransactions } from "@/actions/autobiz"; // Old action
import { useAuth } from "@/contexts/AuthContext"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";


// This page might be deprecated. UPI Reconciliation is now part of Business Analysis.
// It can be removed or updated to redirect/point to the Business Analysis feature.

export default function UpiReconciliationPageRedirect() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter(); 

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">UPI Reconciliation & Business Analysis</h1>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BarChartHorizontalBig className="h-6 w-6 text-primary" />
            Advanced Business Insights
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            UPI transaction reconciliation is now integrated into our comprehensive Business Analysis feature. Connect your Razorpay and other service API keys to get a holistic view of your finances and operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            To analyze UPI transactions and other business data, please navigate to our Business Analysis page. You can securely input your API keys there to generate reports and insights.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full sm:w-auto btn-tally-gradient hover-scale">
            <Link href="/business-analysis">
              Go to Business Analysis
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
