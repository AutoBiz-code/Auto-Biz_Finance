
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquareText, Package, BarChart3, UserCircle as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [userPlan, setUserPlan] = React.useState("Basic");
  const [conversationCount, setConversationCount] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      // Placeholder: In a real app, fetch from Firestore using user.uid
      // e.g., fetchUserAppData(user.uid).then(data => { setUserPlan(data.plan); setConversationCount(data.conversationCount); });
      setTimeout(() => {
        setUserPlan("Basic");
        setConversationCount(120); // Example conversation count
      }, 500);
    }
  }, [user]);

  const getConversationLimit = () => {
    if (userPlan === "Basic") return 500;
    if (userPlan === "Pro") return 1500;
    return Infinity; // Enterprise or unknown
  };
  const conversationLimit = getConversationLimit();
  const conversationProgress = conversationLimit > 0 && conversationLimit !== Infinity ? (conversationCount / conversationLimit) * 100 : 0;

  const keyMetrics: Metric[] = [
    { title: "GST Bills Generated", value: "125", icon: <FileText className="h-6 w-6 text-primary" />, description: "This month" },
    { title: "Automated Replies Sent", value: "850", icon: <MessageSquareText className="h-6 w-6 text-primary" />, description: "Using Gemini AI" },
    { title: "Items in Stock", value: "340", icon: <Package className="h-6 w-6 text-primary" />, description: "Across all categories" },
    { title: "Business Insights", value: "View Report", icon: <BarChart3 className="h-6 w-6 text-primary" />, description: "From connected services" },
  ];

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">AutoBiz Finance Dashboard</h1>

      {user && (
        <Card className="mb-8 shadow-lg bg-card text-card-foreground fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <UserIcon className="h-7 w-7 text-primary" />
              User Details
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back, {user.email || "User"}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><span className="font-medium text-card-foreground">Email:</span> <span className="text-muted-foreground">{user.email}</span></p>
            <p><span className="font-medium text-card-foreground">Current Plan:</span> <span className="text-muted-foreground">{userPlan}</span></p>
            <div>
              <p className="font-medium text-card-foreground mb-1">Conversation Usage (Botpress/Gemini):</p>
              <div className="flex items-center gap-2">
                <Progress value={conversationProgress} aria-label={`Conversation usage ${conversationProgress.toFixed(0)}%`} className="h-3 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-primary" />
                <span className="text-sm text-muted-foreground">{conversationCount} / {conversationLimit === Infinity ? 'Unlimited' : conversationLimit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{conversationProgress.toFixed(0)}% used ({conversationLimit === Infinity ? 'Unlimited' : conversationLimit - conversationCount} remaining)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!user && !authLoading && (
        <Card className="mb-8 shadow-lg bg-card text-card-foreground fade-in p-6 text-center" style={{ animationDelay: '0.1s' }}>
          <CardTitle className="text-card-foreground mb-2">Welcome to AutoBiz Finance!</CardTitle>
          <CardDescription className="text-muted-foreground mb-4">Please sign in to access your automated finance dashboard and tools.</CardDescription>
          <Button onClick={() => router.push('/sign-in')} className="btn-metamask">Sign In</Button>
        </Card>
      )}

      <section aria-labelledby="key-financial-metrics">
        <h2 id="key-financial-metrics" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{ animationDelay: '0.2s' }}>Key Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((metric, idx) => (
            <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground fade-in hover-scale" style={{ animationDelay: `${0.3 + idx * 0.05}s` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
                {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{animationDelay: '0.4s'}}>Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Button onClick={() => router.push('/gst-billing')} className="btn-metamask hover-scale py-6 text-base justify-start">
            <FileText className="mr-3 h-6 w-6"/> Generate GST Bill
          </Button>
          <Button onClick={() => router.push('/whatsapp-auto-reply')} className="btn-metamask hover-scale py-6 text-base justify-start">
            <MessageSquareText className="mr-3 h-6 w-6"/> AI WhatsApp Reply
          </Button>
          <Button onClick={() => router.push('/stock-management')} className="btn-metamask hover-scale py-6 text-base justify-start">
            <Package className="mr-3 h-6 w-6"/> Manage Stock
          </Button>
          <Button onClick={() => router.push('/business-analysis')} className="btn-metamask hover-scale py-6 text-base justify-start">
            <BarChart3 className="mr-3 h-6 w-6"/> Analyze Business
          </Button>
        </div>
      </section>

    </div>
  );
}
