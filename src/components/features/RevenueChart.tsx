
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: 'Jan', revenue: 0, expenses: 0 },
  { month: 'Feb', revenue: 0, expenses: 0 },
  { month: 'Mar', revenue: 0, expenses: 0 },
  { month: 'Apr', revenue: 0, expenses: 0 },
  { month: 'May', revenue: 0, expenses: 0 },
  { month: 'Jun', revenue: 0, expenses: 0 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-3))", 
  },
};

export default function RevenueChart() {
  return (
    <Card className="shadow-lg bg-card text-card-foreground fade-in" style={{ animationDelay: '0.4s' }}>
      <CardHeader>
        <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">Revenue vs. Expenses</CardTitle>
        <CardDescription>A look at your revenue and expenses over the past 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent 
                    indicator="dot" 
                    formatter={(value) => `${new Intl.NumberFormat('en-IN').format(value as number)} Rupees`}
                />}
              />
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
              <Line
                dataKey="expenses"
                type="monotone"
                stroke="var(--color-expenses)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-expenses)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
