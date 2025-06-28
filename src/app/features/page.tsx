
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, BarChartHorizontalBig, Users, DatabaseBackup, MessageCircleCode } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | AutoBiz Finance",
  description: "Discover the powerful accounting and management features of AutoBiz Finance, inspired by TallyPrime.",
};

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary mb-4" />,
    title: "GST Billing & Invoicing",
    description: "Create GST-compliant invoices, e-way bills, and manage your billing cycle seamlessly.",
    link: "/gst-billing",
    dataAiHint: "invoice document"
  },
  {
    icon: <Package className="h-10 w-10 text-primary mb-4" />,
    title: "Inventory Management",
    description: "Track stock levels, manage warehouses, and handle product batches and expiry dates.",
    link: "/stock-management",
    dataAiHint: "inventory boxes"
  },
  {
    icon: <BarChartHorizontalBig className="h-10 w-10 text-primary mb-4" />,
    title: "Business Reporting",
    description: "Generate Balance Sheets, P&L statements, and analyze cash flow in real-time.",
    link: "/business-analysis",
    dataAiHint: "data analytics"
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Employee & Payroll",
    description: "Manage employee records, process salaries, and handle payroll compliance.",
    link: "/payroll",
    dataAiHint: "team employee"
  },
  {
    icon: <DatabaseBackup className="h-10 w-10 text-primary mb-4" />,
    title: "Data Backup & Restore",
    description: "Securely back up your company data to the cloud and restore it anytime.",
    link: "/data-backup",
    dataAiHint: "server database"
  },
  {
    icon: <MessageCircleCode className="h-10 w-10 text-primary mb-4" />,
    title: "AI WhatsApp Assistant",
    description: "Use AI to automate customer communication and send payment reminders via WhatsApp.",
    link: "/whatsapp-auto-reply",
    dataAiHint: "ai chat"
  }
];

export default function FeaturesPage() {
  return (
    <div className="space-y-12 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold text-foreground">A TallyPrime Alternative, Reimagined</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AutoBiz Finance provides a suite of intelligent tools designed for Indian SMEs, covering everything from accounting and GST to payroll and inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <Link href={feature.link} key={feature.title} className="block hover-scale">
              <Card className="h-full shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card text-card-foreground flex flex-col" style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="text-2xl font-headline text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-base text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
