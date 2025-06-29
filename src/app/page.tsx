
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquareText, Package, UserCircle as UserIcon, Loader2, Banknote, Clock, Zap, BarChartHorizontalBig } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  actionPath?: string;
}

const chartData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [userPlan, setUserPlan] = React.useState("Basic");
  const [conversationCount, setConversationCount] = React.useState(0);

  React.useEffect(() => {
    // This now fetches data for guest users too, showing default values.
    // Placeholder: In a real app, you might fetch different data for guests.
    setTimeout(() => {
      setUserPlan(user ? "Pro" : "Basic"); // Example logic
      setConversationCount(user ? 120 : 0); // Example logic
    }, 500);
  }, [user]);

  const getConversationLimit = () => {
    if (userPlan === "Basic") return 500;
    if (userPlan === "Pro") return 1500;
    return Infinity; // Enterprise or unknown
  };
  const conversationLimit = getConversationLimit();
  const conversationProgress = conversationLimit > 0 && conversationLimit !== Infinity ? (conversationCount / conversationLimit) * 100 : 0;

  const keyMetrics: Metric[] = [
    { title: "Invoices Generated", value: "125", icon: <FileText className="h-6 w-6 text-primary" />, description: "This month", actionPath: "/gst-billing" },
    { title: "Pending Payments", value: "₹45,230", icon: <Banknote className="h-6 w-6 text-primary" />, description: "Total outstanding", actionPath: "/banking" },
    { title: "Hours Saved", value: "25+", icon: <Clock className="h-6 w-6 text-primary" />, description: "Via automation this month", actionPath: "/business-analysis" },
    { title: "Active Automations", value: "3", icon: <Zap className="h-6 w-6 text-primary" />, description: "Across all services", actionPath: "/integrations" },
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

      <Card className="mb-8 shadow-lg bg-card text-card-foreground fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <UserIcon className="h-7 w-7 text-primary" />
            User Details
          </CardTitle>
          <CardDescription>
            Welcome back, {user?.email || "Guest"}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><span className="font-medium">Email:</span> <span className="text-muted-foreground">{user?.email || "Not signed in"}</span></p>
          <p><span className="font-medium">Current Plan:</span> <span className="text-muted-foreground">{userPlan}</span></p>
          <div>
            <p className="font-medium mb-1">Conversation Usage (Botpress/Gemini):</p>
            <div className="flex items-center gap-2">
              <Progress value={conversationProgress} aria-label={`Conversation usage ${conversationProgress.toFixed(0)}%`} className="h-3 flex-1 [&>div]:bg-primary" />
              <span className="text-sm text-muted-foreground">{conversationCount} / {conversationLimit === Infinity ? 'Unlimited' : conversationLimit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{conversationProgress.toFixed(0)}% used ({conversationLimit === Infinity ? 'Unlimited' : conversationLimit - conversationCount} remaining)</p>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="key-financial-metrics">
        <h2 id="key-financial-metrics" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{ animationDelay: '0.2s' }}>Key Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((metric, idx) => (
             <Card 
              key={metric.title} 
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground fade-in hover-scale cursor-pointer" 
              style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              onClick={() => metric.actionPath && router.push(metric.actionPath)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.description && <p className="text-xs text-muted-foreground">{metric.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="revenue-overview">
         <h2 id="revenue-overview" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{animationDelay: '0.3s'}}>Revenue Overview</h2>
         <Card className="shadow-lg bg-card text-card-foreground fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>A look at your revenue over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
         </Card>
      </section>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="text-2xl font-headline font-medium text-foreground mb-4 fade-in" style={{animationDelay: '0.4s'}}>Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Button onClick={() => router.push('/gst-billing')} className="hover-scale py-6 text-base justify-start">
            <FileText className="mr-3 h-6 w-6"/> Generate GST Bill
          </Button>
          <Button onClick={() => router.push('/whatsapp-auto-reply')} className="hover-scale py-6 text-base justify-start">
            <MessageSquareText className="mr-3 h-6 w-6"/> AI WhatsApp Reply
          </Button>
          <Button onClick={() => router.push('/stock-management')} className="hover-scale py-6 text-base justify-start">
            <Package className="mr-3 h-6 w-6"/> Manage Stock
          </Button>
          <Button onClick={() => router.push('/business-analysis')} className="hover-scale py-6 text-base justify-start">
            <BarChartHorizontalBig className="mr-3 h-6 w-6"/> Analyze Business
          </Button>
        </div>
      </section>

    </div>
  );
}
