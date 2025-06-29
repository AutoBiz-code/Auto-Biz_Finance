import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Package, 
  BarChartHorizontalBig, 
  Users, 
  DatabaseBackup, 
  MessageCircleCode,
  BookOpenCheck,
  Landmark,
  Banknote,
  ShieldCheck,
  Plug,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Features | AutoBiz Finance",
  description: "Automate GST, Invoices & Payments in 60 Seconds – Save 10+ Hours/Week!",
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
    icon: <BookOpenCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Accounting & Ledger",
    description: "Manage your chart of accounts, journal entries, and ledgers with double-entry precision.",
    link: "/accounting",
    dataAiHint: "accounting ledger"
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Employee & Payroll",
    description: "Manage employee records, process salaries, and handle payroll compliance.",
    link: "/payroll",
    dataAiHint: "team employee"
  },
  {
    icon: <Landmark className="h-10 w-10 text-primary mb-4" />,
    title: "Taxation & Compliance",
    description: "Handle GST returns, TDS/TCS, and stay compliant with automated tax calculations.",
    link: "/taxation",
    dataAiHint: "tax government"
  },
  {
    icon: <Banknote className="h-10 w-10 text-primary mb-4" />,
    title: "Banking & Payments",
    description: "Reconcile bank statements, manage cheques, and track digital payments seamlessly.",
    link: "/banking",
    dataAiHint: "bank money"
  },
  {
    icon: <BarChartHorizontalBig className="h-10 w-10 text-primary mb-4" />,
    title: "Business Reporting",
    description: "Generate Balance Sheets, P&L statements, and analyze cash flow in real-time.",
    link: "/business-analysis",
    dataAiHint: "data analytics"
  },
  {
    icon: <DatabaseBackup className="h-10 w-10 text-primary mb-4" />,
    title: "Data Backup & Restore",
    description: "Securely back up your company data to the cloud and restore it anytime.",
    link: "/data-backup",
    dataAiHint: "server database"
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Security & Access",
    description: "Control user roles and permissions, and view audit logs to keep your data secure.",
    link: "/security",
    dataAiHint: "security shield"
  },
  {
    icon: <Plug className="h-10 w-10 text-primary mb-4" />,
    title: "Integrations",
    description: "Connect with third-party apps, export data, and extend your functionality.",
    link: "/integrations",
    dataAiHint: "api integration"
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
      <div className="text-center space-y-6 pt-8">
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground max-w-4xl mx-auto">
          Automate GST, Invoices & Payments in 60 Seconds – Save 10+ Hours/Week!
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg py-7 hover-scale">
                <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-7 hover-scale">
                <Link href="#">
                    <PlayCircle className="mr-2 h-6 w-6" />
                    Watch 30s Demo
                </Link>
            </Button>
        </div>
        <div className="pt-6">
            <p className="text-sm text-muted-foreground font-semibold tracking-wider">TRUSTED BY 500+ SMEs</p>
            <div className="flex justify-center items-center gap-12 mt-4">
                <Image src="https://placehold.co/120x40.png" width={120} height={40} alt="Razorpay Logo" data-ai-hint="logo company" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                <Image src="https://placehold.co/120x40.png" width={120} height={40} alt="WhatsApp Business Logo" data-ai-hint="logo company" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"/>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
        {features.map((feature, idx) => (
          <Link href={feature.link} key={feature.title} className="block hover-scale">
              <Card className="h-full shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card text-card-foreground flex flex-col" style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="text-2xl font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-base text-center text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
