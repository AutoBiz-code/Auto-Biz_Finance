
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, BarChartHorizontalBig } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; 
import Link from "next/link";

export default function UpiReconciliationPageRedirect() {
  const { loading: authLoading } = useAuth(); 

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">UPI Reconciliation & Business Analysis</h1>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent flex items-center gap-2">
            <BarChartHorizontalBig className="h-6 w-6 text-primary" />
            Feature Integrated
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            UPI transaction reconciliation is now integrated into our comprehensive **Business Analysis** feature. Connect your Razorpay and other service API keys to get a holistic view of your finances and operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            To analyze UPI transactions and other business data, please navigate to our Business Analysis page. You can securely input your API keys there to generate reports and insights.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full sm:w-auto hover-scale">
            <Link href="/business-analysis">
              Go to Business Analysis
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
