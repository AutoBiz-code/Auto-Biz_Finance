
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle2, AlertTriangle, MessageSquare, FileTextIcon, IndianRupee, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const metrics = [
    { title: "Total Transactions", value: "1,250", change: "+5.2%", icon: <IndianRupee className="h-6 w-6 text-primary" />, dataAiHint: "finance chart" },
    { title: "Reconciled Items", value: "1,180", change: "94.4%", icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, dataAiHint: "checkmark data" },
    { title: "Pending Reconciliation", value: "70", change: "5.6%", icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />, dataAiHint: "alert pending" },
    { title: "Open Alerts", value: "3", change: "Critical", icon: <AlertTriangle className="h-6 w-6 text-destructive" />, dataAiHint: "warning notification" },
  ];

  const processStatuses = [
    { name: "UPI Sync", status: "Active", icon: <IndianRupee className="h-5 w-5 text-green-500" /> },
    { name: "WhatsApp Bot", status: "Connected", icon: <MessageSquare className="h-5 w-5 text-green-500" /> },
    { name: "GST Portal Link", status: "Pending", icon: <FileTextIcon className="h-5 w-5 text-yellow-500" /> },
    { name: "Reporting Service", status: "Idle", icon: <BarChart3 className="h-5 w-5 text-blue-500" /> },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-semibold text-foreground">Dashboard</h1>
      
      <section aria-labelledby="financial-metrics">
        <h2 id="financial-metrics" className="text-2xl font-headline font-medium text-foreground mb-4">Financial Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section aria-labelledby="process-status">
          <h2 id="process-status" className="text-2xl font-headline font-medium text-foreground mb-4">Process Status</h2>
          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-4">
              {processStatuses.map((process) => (
                <div key={process.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {process.icon}
                    <span className="text-card-foreground">{process.name}</span>
                  </div>
                  <Badge variant={process.status === "Active" || process.status === "Connected" ? "default" : process.status === "Pending" ? "secondary" : "outline"} 
                         className={cn(
                            process.status === "Active" || process.status === "Connected" ? "bg-green-500 hover:bg-green-600" : 
                            process.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600" : "" , "text-white"
                         )}>
                    {process.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="reconciliation-overview">
          <h2 id="reconciliation-overview" className="text-2xl font-headline font-medium text-foreground mb-4">Reconciliation Overview</h2>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-card-foreground">Monthly Reconciliation Progress</CardTitle>
              <CardDescription className="text-muted-foreground">Target: 99% completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={78} aria-label="Reconciliation progress 78%" />
                <p className="text-sm text-muted-foreground">Current: 78% (975 / 1250 transactions)</p>
                 <div className="mt-4 h-48 bg-muted rounded-md flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-primary opacity-50" />
                    <p className="text-muted-foreground ml-2">Chart placeholder</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
