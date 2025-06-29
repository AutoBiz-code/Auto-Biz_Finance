
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Landmark, FileText, Loader2, FileDigit, Scissors } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fileGstReturnAction } from "@/actions/autobiz-features";

// Mock data for sales summary
const salesSummary = [
  { type: "B2B Invoices", taxableValue: 450000, taxAmount: 81000, totalValue: 531000 },
  { type: "B2C (Large) Invoices", taxableValue: 120000, taxAmount: 21600, totalValue: 141600 },
  { type: "Credit/Debit Notes (Registered)", taxableValue: -15000, taxAmount: -2700, totalValue: -17700 },
  { type: "Exports Invoices", taxableValue: 75000, taxAmount: 0, totalValue: 75000 },
];

export default function TaxationPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5"); // Mock GSTIN
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  const handleFileReturn = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await fileGstReturnAction({ 
        gstin, 
        period: `${month}-${year}` 
      });
      toast({ title: "Filing Initiated", description: result.message });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to initiate GST filing.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (field: 'taxableValue' | 'taxAmount' | 'totalValue') => {
     return salesSummary.reduce((acc, item) => acc + (Number(item[field]) || 0), 0);
  }

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Taxation & Compliance</h1>
        <p className="mt-2 text-muted-foreground">Manage your GST returns, TDS, and other compliance tasks.</p>
      </header>

      <Tabs defaultValue="gst-returns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gst-returns"><FileDigit className="mr-2 h-4 w-4"/> GST Returns</TabsTrigger>
          <TabsTrigger value="tds-tcs" disabled><Scissors className="mr-2 h-4 w-4"/> TDS/TCS</TabsTrigger>
          <TabsTrigger value="e-invoicing" disabled><FileText className="mr-2 h-4 w-4"/> E-Invoicing</TabsTrigger>
        </TabsList>
        <TabsContent value="gst-returns">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Landmark className="h-6 w-6 text-primary" />
                File GSTR-1 Return
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Review your sales summary and file your GSTR-1 return for the selected period.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleFileReturn}>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input id="gstin" value={gstin} onChange={e => setGstin(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="month">Filing Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger id="month"><SelectValue placeholder="Select month" /></SelectTrigger>
                            <SelectContent>
                                {Array.from({length: 12}, (_, i) => (
                                    <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="year">Filing Year</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger id="year"><SelectValue placeholder="Select year" /></SelectTrigger>
                            <SelectContent>
                                {[...Array(5)].map((_, i) => {
                                    const y = new Date().getFullYear() - i;
                                    return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-card-foreground mb-2">Sales Summary for {month}-{year}</h3>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction Type</TableHead>
                                    <TableHead className="text-right">Taxable Value</TableHead>
                                    <TableHead className="text-right">Tax Amount</TableHead>
                                    <TableHead className="text-right">Total Invoice Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesSummary.map(row => (
                                    <TableRow key={row.type}>
                                        <TableCell className="font-medium">{row.type}</TableCell>
                                        <TableCell className="text-right">{row.taxableValue.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">{row.taxAmount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">{row.totalValue.toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                             <TableRow className="font-bold bg-muted/50">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right">{calculateTotal('taxableValue').toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-right">{calculateTotal('taxAmount').toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-right">{calculateTotal('totalValue').toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        </Table>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full btn-tally-gradient" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDigit className="mr-2 h-4 w-4"/>}
                    {isLoading ? "Filing..." : "File GSTR-1 Return (Simulated)"}
                  </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="tds-tcs">
          <Card>
            <CardHeader><CardTitle>TDS/TCS Management</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">This feature is under development.</p></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="e-invoicing">
          <Card>
            <CardHeader><CardTitle>E-Invoicing & E-Way Bill</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">This feature is under development.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
