
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
// import type { Metadata } from "next"; // Metadata cannot be in client components

// export const metadata: Metadata = { // Moved to parent or layout if needed globally
//   title: "Pricing | AutoBiz Finance",
//   description: "Choose the best plan for your SME with AutoBiz Finance. Transparent pricing for financial automation.",
// };

import { useState, useEffect } from 'react';


const pricingPlans = [
  {
    name: "Basic",
    price: "₹X,XXX", 
    priceSuffix: "/ month",
    features: [
      "500 WhatsApp Conversations",
      "Automated GST Invoicing (Basic)",
      "UPI Reconciliation (Basic)",
      "Standard Dashboard",
      "Email Support",
    ],
    cta: "Get Started with Basic",
  },
  {
    name: "Pro",
    price: "₹Y,YYY", 
    priceSuffix: "/ month",
    features: [
      "1500 WhatsApp Conversations",
      "All Basic Features",
      "Advanced GST & UPI Features",
      "Advanced Dashboard Metrics",
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
      "Unlimited WhatsApp Conversations",
      "All Pro Features",
      "Dedicated Account Manager",
      "Custom Integrations (Botpress, ClearTax, Razorpay)",
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
              <Button className="w-full btn-metamask text-lg py-3">
                {plan.cta}
              </Button>
            </div>
          </Card>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-8">
        Target revenue of ₹5 crore/month by July 2025.
      </p>
      {currentDate && (
        <p className="text-center text-xs text-muted-foreground/70">
          Current date: {currentDate}.
        </p>
      )}
    </div>
  );
}
