
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Basic",
    price: "₹999", 
    priceSuffix: "/ month",
    features: [
      "500 AI Reply Generations (WhatsApp/Botpress)",
      "GST Bill Generation (PDF)",
      "Basic Stock Management",
      "Standard Dashboard",
      "Email Support",
    ],
    cta: "Get Started with Basic",
    link: "/signup",
  },
  {
    name: "Pro",
    price: "₹2499", 
    priceSuffix: "/ month",
    features: [
      "1500 AI Reply Generations",
      "All Basic Features",
      "Advanced GST Features",
      "Business Analysis Module",
      "Priority Email Support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    link: "/signup",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSuffix: "",
    features: [
      "Unlimited AI Reply Generations",
      "All Pro Features",
      "Dedicated Account Manager",
      "Custom API Integrations",
      "SLA & Premium Support",
    ],
    cta: "Contact Sales",
    link: "mailto:sales@autobiz.finance",
  },
];

export default function PricingPage() {

  return (
    <div className="space-y-12 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Flexible Pricing for Your Business</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your SME's needs in Gurugram and scale as you grow with AutoBiz Finance.
        </p>
         <p className="mt-2 text-sm text-muted-foreground/80">
          Targeting ₹5 crore/month revenue by July 2025.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, idx) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card text-card-foreground hover-scale ${plan.highlighted ? 'border-2 border-primary ring-2 ring-primary/50' : 'border-border'}`}
            style={{animationDelay: `${0.2 + idx * 0.1}s`}}
          >
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-headline ${plan.highlighted ? 'text-primary' : ''}`}>{plan.name}</CardTitle>
              <p className="text-3xl font-bold mt-2">
                {plan.price}
                {plan.priceSuffix && <span className="text-sm font-normal text-muted-foreground">{plan.priceSuffix}</span>}
              </p>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 mt-auto">
               <Button asChild className="w-full text-lg py-3">
                 <Link href={plan.link}>
                  {plan.cta}
                 </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <p className="text-lg font-medium text-foreground">
          Trusted by SMEs, built for success – AutoBiz Finance, your business partner.
        </p>
      </div>
    </div>
  );
}
