
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageCircleCode, Package, BarChartHorizontalBig, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | AutoBiz Finance",
  description: "Discover the powerful automation and management features of AutoBiz Finance.",
};

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary mb-4" />,
    title: "GST Bill Generation",
    description: "Easily create GST-compliant bills and generate PDF invoices for your customers.",
    link: "/gst-billing",
    dataAiHint: "invoice document"
  },
  {
    icon: <MessageCircleCode className="h-10 w-10 text-primary mb-4" />,
    title: "AI WhatsApp Replies",
    description: "Leverage Gemini AI to automatically generate contextual replies for customer WhatsApp messages.",
    link: "/whatsapp-auto-reply",
    dataAiHint: "ai chat"
  },
  {
    icon: <Package className="h-10 w-10 text-primary mb-4" />,
    title: "Stock Management",
    description: "Keep track of your inventory, manage stock levels, and update item details seamlessly.",
    link: "/stock-management",
    dataAiHint: "inventory boxes"
  },
  {
    icon: <BarChartHorizontalBig className="h-10 w-10 text-primary mb-4" />,
    title: "Business Analysis",
    description: "Connect your service APIs (Razorpay, WhatsApp, Botpress) to gain insights into your business performance.",
    link: "/business-analysis",
    dataAiHint: "data analytics"
  }
];

export default function FeaturesPage() {
  return (
    <div className="space-y-12 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold text-foreground">Empowering Your Business with Smart Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          AutoBiz Finance provides a suite of intelligent tools designed to streamline your operations, from billing to customer communication and inventory management.
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
