
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, IndianRupee, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | AutoBiz Finance",
  description: "Discover the powerful automation features of AutoBiz Finance for SMEs in Gurugram.",
};

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary mb-4" />,
    title: "Automated WhatsApp Replies",
    description: "Integrate with Botpress to handle customer queries, send alerts, and engage 24/7 via WhatsApp.",
    link: "/whatsapp-automation",
    dataAiHint: "messaging bot"
  },
  {
    icon: <FileText className="h-10 w-10 text-primary mb-4" />,
    title: "Automated GST Invoicing",
    description: "Connect with ClearTax to generate GST-compliant invoices automatically, saving time and reducing errors.",
    link: "/gst-invoicing",
    dataAiHint: "invoice document"
  },
  {
    icon: <IndianRupee className="h-10 w-10 text-primary mb-4" />,
    title: "Smart UPI Reconciliation",
    description: "Seamlessly reconcile UPI transactions using Razorpay integration for accurate financial tracking.",
    link: "/upi-reconciliation",
    dataAiHint: "payment process"
  },
  {
    icon: <Zap className="h-10 w-10 text-primary mb-4" />,
    title: "Real-time Dashboard & Analytics",
    description: "Monitor key financial metrics and process statuses in real-time to make informed decisions.",
    link: "/", 
    dataAiHint: "data analytics"
  }
];

export default function FeaturesPage() {
  return (
    <div className="space-y-12 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold text-foreground">Power Up Your Finances with Automation</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AutoBiz Finance offers a suite of tools designed to streamline your financial operations, giving you more time to focus on growing your business in Gurugram and beyond.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
