
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
  Plug
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Welcome to AutoBiz Finance | Automate Your Business",
  description: "Automate GST, Invoices & Payments in 60 Seconds – Save 10+ Hours/Week!",
};

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary mb-4" />,
    title: "GST Billing & Invoicing",
    description: "Create GST-compliant invoices, e-way bills, and manage your billing cycle seamlessly.",
    link: "/sign-in",
    dataAiHint: "invoice document"
  },
  {
    icon: <Package className="h-10 w-10 text-primary mb-4" />,
    title: "Inventory Management",
    description: "Track stock levels, manage warehouses, and handle product batches and expiry dates.",
    link: "/sign-in",
    dataAiHint: "inventory boxes"
  },
   {
    icon: <BookOpenCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Accounting & Ledger",
    description: "Manage your chart of accounts, journal entries, and ledgers with double-entry precision.",
    link: "/sign-in",
    dataAiHint: "accounting ledger"
  },
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Employee & Payroll",
    description: "Manage employee records, process salaries, and handle payroll compliance.",
    link: "/sign-in",
    dataAiHint: "team employee"
  },
  {
    icon: <Landmark className="h-10 w-10 text-primary mb-4" />,
    title: "Taxation & Compliance",
    description: "Handle GST returns, TDS/TCS, and stay compliant with automated tax calculations.",
    link: "/sign-in",
    dataAiHint: "tax government"
  },
  {
    icon: <Banknote className="h-10 w-10 text-primary mb-4" />,
    title: "Banking & Payments",
    description: "Reconcile bank statements, manage cheques, and track digital payments seamlessly.",
    link: "/sign-in",
    dataAiHint: "bank money"
  },
  {
    icon: <BarChartHorizontalBig className="h-10 w-10 text-primary mb-4" />,
    title: "Business Reporting",
    description: "Generate Balance Sheets, P&L statements, and analyze cash flow in real-time.",
    link: "/sign-in",
    dataAiHint: "data analytics"
  },
  {
    icon: <DatabaseBackup className="h-10 w-10 text-primary mb-4" />,
    title: "Data Backup & Restore",
    description: "Securely back up your company data to the cloud and restore it anytime.",
    link: "/sign-in",
    dataAiHint: "server database"
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Security & Access",
    description: "Control user roles and permissions, and view audit logs to keep your data secure.",
    link: "/sign-in",
    dataAiHint: "security shield"
  },
  {
    icon: <Plug className="h-10 w-10 text-primary mb-4" />,
    title: "Integrations",
    description: "Connect with third-party apps, export data, and extend your functionality.",
    link: "/sign-in",
    dataAiHint: "api integration"
  },
  {
    icon: <MessageCircleCode className="h-10 w-10 text-primary mb-4" />,
    title: "AI WhatsApp Assistant",
    description: "Use AI to automate customer communication and send payment reminders via WhatsApp.",
    link: "/sign-in",
    dataAiHint: "ai chat"
  }
];

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-12 fade-in">
        <div className="text-center space-y-6 pt-8">
          <h1 className="text-4xl lg:text-5xl font-headline font-bold max-w-4xl mx-auto bg-primary-gradient bg-clip-text text-transparent">
            Empower Your Business, Simplify Your Finances.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From invoicing to payroll, AutoBiz Finance is very efficient, putting everything you need at your fingertips.
          </p>
          <div className="flex justify-center">
            <Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold bg-transparent transition-colors hover-scale">
                <span className="bg-primary-gradient bg-clip-text text-transparent">Get Started</span>
            </Link>
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
    </div>
  );
}
