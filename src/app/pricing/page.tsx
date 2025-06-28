
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import type { Metadata } from "next";

// Note: Metadata can't be dynamic in client components this way. 
// It should be defined in a server component or layout.tsx for static metadata.
// export const metadata: Metadata = { 
//   title: "Pricing | AutoBiz Finance",
//   description: "Choose the best plan for your SME with AutoBiz Finance. Transparent pricing for financial automation.",
// };


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
  },
];

export default function PricingPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="space-y-12 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold text-foreground">Flexible Pricing for Your Business</h1>
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
              <CardTitle className={`text-2xl font-headline ${plan.highlighted ? 'text-primary' : 'text-card-foreground'}`}>{plan.name}</CardTitle>
              <p className="text-3xl font-bold text-card-foreground mt-2">
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
              <Button className="w-full btn-tally-gradient text-lg py-3">
                {plan.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {currentDate && (
        <p className="text-center text-xs text-muted-foreground/70 mt-8">
          Pricing effective as of: {currentDate}.
        </p>
      )}
    </div>
  );
}
