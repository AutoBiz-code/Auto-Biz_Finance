
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { IndianRupee, MessageSquare, FileTextIcon, BarChart3, Zap, Bot, FileSignature, UserCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { automateWhatsApp, generateGSTInvoice, reconcileUPITransactions } from "@/actions/autobiz";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation"; // Import useRouter

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  progress?: number;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter(); // Initialize useRouter

  // Placeholder data for plan and conversation count
  // In a real app, this would come from Firestore for the logged-in user
  const [userPlan, setUserPlan] = React.useState("Basic"); 
  const [conversationCount, setConversationCount] = React.useState(0); 
  
  // Simulate fetching user-specific data like plan and conversation count
  React.useEffect(() => {
    if (user) {
      // Placeholder: In a real app, fetch from Firestore using user.uid
      // e.g., fetchUserAppData(user.uid).then(data => { setUserPlan(data.plan); setConversationCount(data.conversationCount); });
      // For now, using defaults or simulating fetch
      setTimeout(() => {
        setUserPlan("Basic"); // Example
        setConversationCount(250); // Example
      }, 500);
    }
  }, [user]);

  const conversationLimit = userPlan === "Basic" ? 500 : userPlan === "Pro" ? 1500 : Infinity;
  const conversationProgress = conversationLimit > 0 && conversationLimit !== Infinity ? (conversationCount / conversationLimit) * 100 : 0;


  const financialMetrics: Metric[] = [
    { title: "Transactions Processed", value: "2,345", icon: <IndianRupee className="h-6 w-6 text-primary" /> },
    { title: "Invoices Generated", value: "580", icon: <FileSignature className="h-6 w-6 text-primary" /> },
    { title: "Automated Replies", value: "1,200", icon: <Bot className="h-6 w-6 text-primary" /> },
    { title: "Revenue Target Progress", value: "₹1.2 Cr / ₹5 Cr", icon: <BarChart3 className="h-6 w-6 text-primary" />, progress: 24 },
  ];

  const handleAction = async (action: () => Promise<any>, successMessage: string) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to perform this action.", variant: "destructive" });
      router.push("/sign-in"); // Redirect to sign-in if not authenticated
      return;
    }
    try {
      // Simulate API call, replace with actual action
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      // await action(); // Uncomment when actual actions are implemented
      toast({ title: "Success (Simulated)", description: successMessage });
    } catch (error: any) {
      toast({ title: "Error (Simulated)", description: error.message || "An error occurred. Please try again.", variant: "destructive" });
      console.error(error);
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
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground fade-in">AutoBiz Finance Dashboard</h1>
      
      {user && (
        <Card className="mb-8 shadow-lg bg-card text-card-foreground fade-in" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <UserCircle className="h-7 w-7 text-primary" />
              User Details
            </CardTitle>
             <CardDescription className="text-muted-foreground">
              Welcome, {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><span className="font-medium text-card-foreground">Email:</span> <span className="text-muted-foreground">{user.email}</span></p>
            <p><span className="font-medium text-card-foreground">Current Plan:</span> <span className="text-muted-foreground">{userPlan}</span></p>
            <div>
              <p className="font-medium text-card-foreground mb-1">Conversation Usage:</p>
              <div className="flex items-center gap-2">
                <Progress value={conversationProgress} aria-label={`Conversation usage ${conversationProgress.toFixed(0)}%`} className="h-3 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-primary" />
                <span className="text-sm text-muted-foreground">{conversationCount} / {conversationLimit === Infinity ? 'Unlimited' : conversationLimit}</span>
              </div>
               <p className="text-xs text-muted-foreground mt-1">{conversationProgress.toFixed(0)}% used</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!user && !authLoading && (
         <Card className="mb-8 shadow-lg bg-card text-card-foreground fade-in p-6 text-center" style={{animationDelay: '0.1s'}}>
            <CardTitle className="text-card-foreground mb-2">Welcome to AutoBiz Finance!</CardTitle>
            <CardDescription className="text-muted-foreground mb-4">Please sign in to access your dashboard and features.</CardDescription>
            <Button onClick={() => router.push('/sign-in')} className="btn-metamask">Sign In</Button>
        </Card>
      )}

      <section aria-labelledby="financial-metrics">
        <h2 id="financial-metrics" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{animationDelay: '0.1s'}}>Key Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {financialMetrics.map((metric, idx) => (
            <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground fade-in hover-scale" style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
                {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
                {metric.progress !== undefined && (
                  <Progress value={metric.progress} aria-label={`${metric.title} progress ${metric.progress}%`} className="mt-2 h-2 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="automation-actions">
        <h2 id="automation-actions" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{animationDelay: '0.3s'}}>Automation Actions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-lg bg-card text-card-foreground fade-in hover-scale" style={{animationDelay: '0.4s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground"><MessageSquare className="text-primary"/>Automate WhatsApp</CardTitle>
              <CardDescription className="text-muted-foreground">Handle customer queries via Botpress.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-metamask" onClick={() => handleAction(async () => automateWhatsApp({userId: user?.uid, message: "Test"}), "WhatsApp automation initiated.")}>
                <Bot className="mr-2"/> Start WhatsApp Automation
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-card text-card-foreground fade-in hover-scale" style={{animationDelay: '0.5s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground"><FileTextIcon className="text-primary"/>Generate GST Invoices</CardTitle>
              <CardDescription className="text-muted-foreground">Automate invoicing via ClearTax.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-metamask" onClick={() => handleAction(async () => generateGSTInvoice({userId: user?.uid, invoiceDetails: {amount: 100}}), "GST invoice generation started.")}>
                <FileSignature className="mr-2"/> Generate Invoices
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-card text-card-foreground fade-in hover-scale" style={{animationDelay: '0.6s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground"><Zap className="text-primary"/>Reconcile UPI Transactions</CardTitle>
              <CardDescription className="text-muted-foreground">Sync and reconcile UPI payments via Razorpay.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-metamask" onClick={() => handleAction(async () => reconcileUPITransactions({userId: user?.uid, rawData: "Test Data"}), "UPI reconciliation process initiated.")}>
                <IndianRupee className="mr-2"/> Reconcile Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
