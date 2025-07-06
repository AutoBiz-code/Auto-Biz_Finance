
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Landmark, FileText, Loader2, FileDigit, Scissors } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { fileGstReturnAction, liveGenerateEInvoiceAction, liveGenerateEWayBillAction } from "@/actions/autobiz-features";
import Image from "next/image";

// Mock data for sales summary
const salesSummary = [
  { type: "B2B Invoices", taxableValue: 450000, taxAmount: 81000, totalValue: 531000 },
  { type: "B2C (Large) Invoices", taxableValue: 120000, taxAmount: 21600, totalValue: 141600 },
  { type: "Credit/Debit Notes (Registered)", taxableValue: -15000, taxAmount: -2700, totalValue: -17700 },
  { type: "Exports Invoices", taxableValue: 75000, taxAmount: 0, totalValue: 75000 },
];

export default function TaxationPage() {
  const { toast } = useToast();
  // State for GST Returns Tab
  const [isFiling, setIsFiling] = useState(false);
  const [gstin, setGstin] = useState("29ABCDE1234F1Z5"); // Mock GSTIN
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  
  // State for E-Invoice Tab
  const [isGeneratingEInvoice, setIsGeneratingEInvoice] = useState(false);
  const [isGeneratingEWayBill, setIsGeneratingEWayBill] = useState(false);
  const [irn, setIrn] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [ewbNo, setEwbNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '', buyerGstin: '33GSPTN1882G3Z5', buyerName: 'Test Buyer', buyerAddr: 'Test Address, Chennai',
    items: [{ description: 'Test Item', hsn: '998314', quantity: 1, unitPrice: 100, gstRate: 18, taxable: 100, total: 118, cgst: 9, sgst: 9, igst: 0 }]
  });
  const ourGstin = "29ABCDE1234F1Z5"; // Seller's GSTIN (Test)


  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear().toString());
    setMonth((now.getMonth() + 1).toString().padStart(2, '0'));
  }, []);

  const handleFileReturn = async (e: FormEvent) => {
    e.preventDefault();
    setIsFiling(true);
    try {
      const result = await fileGstReturnAction({ 
        gstin, 
        period: `${month}-${year}` 
      });
      if (result.success) {
        toast({ title: "Filing Initiated", description: result.message });
      } else {
        toast({ title: "Error", description: result.error || "Failed to initiate GST filing.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Critical Error", description: "A critical error occurred.", variant: "destructive" });
    } finally {
      setIsFiling(false);
    }
  };

  const handleItemChange = (field: string, value: string) => {
    const newItems = [...invoiceData.items];
    const item = { ...newItems[0] };
    (item as any)[field] = value;
    
    // Recalculate
    const unitPrice = Number(item.unitPrice) || 0;
    const quantity = Number(item.quantity) || 1;
    const gstRate = Number(item.gstRate) || 0;
    
    item.taxable = unitPrice * quantity;
    const tax = (item.taxable * gstRate) / 100;
    item.total = item.taxable + tax;
    // Assuming intra-state for this example
    item.cgst = tax / 2;
    item.sgst = tax / 2;
    item.igst = 0;

    setInvoiceData(prev => ({...prev, items: [item]}));
  };

  const handleGenerateEInvoice = async () => {
    setIsGeneratingEInvoice(true);
    setIrn('');
    setQrCode('');
    setEwbNo('');
    try {
      const result = await liveGenerateEInvoiceAction({ gstin: ourGstin, ...invoiceData });
      if (result.success && result.irn && result.qrCode) {
        setIrn(result.irn);
        setQrCode(result.qrCode);
        toast({ title: "e-Invoice Generated!", description: `IRN: ${result.irn}` });
      } else {
        toast({ title: "Error", description: result.error || "Failed to generate e-invoice.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Critical Error", description: "A critical error occurred.", variant: "destructive" });
    } finally {
      setIsGeneratingEInvoice(false);
    }
  };
  
  const handleGenerateEWayBill = async () => {
    setIsGeneratingEWayBill(true);
    try {
      const result = await liveGenerateEWayBillAction({ irn, vehicleNo });
      if (result.success && result.ewbNo) {
        setEwbNo(result.ewbNo);
        toast({ title: "e-Way Bill Generated!", description: `EWB No: ${result.ewbNo}` });
      } else {
        toast({ title: "Error", description: result.error || "Failed to generate e-way bill.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Critical Error", description: "A critical error occurred.", variant: "destructive" });
    } finally {
      setIsGeneratingEWayBill(false);
    }
  };

  const calculateTotal = (field: 'taxableValue' | 'taxAmount' | 'totalValue') => {
     return salesSummary.reduce((acc, item) => acc + (Number(item[field]) || 0), 0);
  }

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Taxation & Compliance</h1>
        <p className="mt-2 text-muted-foreground">Manage your GST returns, TDS, and other compliance tasks.</p>
      </header>

      <Tabs defaultValue="gst-returns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gst-returns"><FileDigit className="mr-2 h-4 w-4"/> GST Returns</TabsTrigger>
          <TabsTrigger value="e-invoicing"><FileText className="mr-2 h-4 w-4"/> E-Invoicing</TabsTrigger>
          <TabsTrigger value="tds-tcs" disabled><Scissors className="mr-2 h-4 w-4"/> TDS/TCS</TabsTrigger>
        </TabsList>
        <TabsContent value="gst-returns">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent flex items-center gap-2">
                <Landmark className="h-6 w-6 text-primary" />
                File GSTR-1 Return
              </CardTitle>
              <CardDescription>
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
                    <h3 className="text-lg font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">Sales Summary for {month}-{year}</h3>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction Type</TableHead>
                                    <TableHead className="text-right">Taxable Value (INR)</TableHead>
                                    <TableHead className="text-right">Tax Amount (INR)</TableHead>
                                    <TableHead className="text-right">Total Invoice Value (INR)</TableHead>
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
                             <TableFooter>
                                <TableRow className="font-bold bg-muted/50">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-right">{calculateTotal('taxableValue').toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right">{calculateTotal('taxAmount').toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right">{calculateTotal('totalValue').toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                             </TableFooter>
                        </Table>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" className="w-full" disabled={isFiling}>
                    {isFiling ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDigit className="mr-2 h-4 w-4"/>}
                    {isFiling ? "Filing..." : "File GSTR-1 Return (Simulated)"}
                  </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="e-invoicing">
           <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Live E-Invoice & E-Way Bill Generation
              </CardTitle>
              <CardDescription>
                Use this form to generate a live e-invoice and e-way bill using the official sandbox APIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-bold text-lg text-foreground">Step 1: E-Invoice Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="invNo">Invoice Number</Label>
                            <Input id="invNo" placeholder="Invoice Number" value={invoiceData.invoiceNumber} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="buyerGstin">Buyer GSTIN</Label>
                            <Input id="buyerGstin" placeholder="Buyer GSTIN" value={invoiceData.buyerGstin} onChange={(e) => setInvoiceData({ ...invoiceData, buyerGstin: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="buyerName">Buyer Name</Label>
                            <Input id="buyerName" placeholder="Buyer Name" value={invoiceData.buyerName} onChange={(e) => setInvoiceData({ ...invoiceData, buyerName: e.target.value })} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="buyerAddr">Buyer Address</Label>
                            <Input id="buyerAddr" placeholder="Buyer Address" value={invoiceData.buyerAddr} onChange={(e) => setInvoiceData({ ...invoiceData, buyerAddr: e.target.value })} />
                        </div>
                    </div>
                    <h4 className="font-medium pt-2">Item Details (1 item for demo)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="itemDesc">Item Description</Label>
                            <Input id="itemDesc" placeholder="Item Description" value={invoiceData.items[0].description} onChange={(e) => handleItemChange('description', e.target.value)} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="itemHsn">HSN Code</Label>
                            <Input id="itemHsn" placeholder="HSN Code" value={invoiceData.items[0].hsn} onChange={(e) => handleItemChange('hsn', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="itemQty">Quantity</Label>
                            <Input id="itemQty" type="number" placeholder="Quantity" value={invoiceData.items[0].quantity} onChange={(e) => handleItemChange('quantity', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="itemPrice">Unit Price (INR)</Label>
                            <Input id="itemPrice" type="number" placeholder="Unit Price" value={invoiceData.items[0].unitPrice} onChange={(e) => handleItemChange('unitPrice', e.target.value)} />
                        </div>
                     </div>
                     <Button onClick={handleGenerateEInvoice} disabled={isGeneratingEInvoice}>
                        {isGeneratingEInvoice && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Generate e-Invoice
                      </Button>
                </div>

                {irn && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-bold text-lg text-foreground">Step 2: E-Way Bill Details</h3>
                    <div className="bg-green-50 p-3 rounded-md border border-green-200 dark:bg-green-900/20 dark:border-green-700">
                        <p className="font-semibold text-green-800 dark:text-green-300">e-Invoice Generated Successfully!</p>
                        <p className="text-sm text-green-700 dark:text-green-400">IRN: <span className="font-mono bg-green-100 dark:bg-green-800/50 p-1 rounded">{irn}</span></p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Label className="mb-2">QR Code</Label>
                      <Image src={`data:image/png;base64,${qrCode}`} alt="E-Invoice QR Code" width={120} height={120} className="border p-1 bg-white"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="vehicleNo">Vehicle Number</Label>
                        <Input id="vehicleNo" placeholder="e.g., HR26AB1234" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
                    </div>
                    <Button onClick={handleGenerateEWayBill} disabled={!irn || isGeneratingEWayBill}>
                        {isGeneratingEWayBill && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Generate e-Way Bill
                    </Button>
                  </div>
                )}
                
                {ewbNo && (
                   <div className="bg-green-50 p-3 rounded-md border border-green-200 dark:bg-green-900/20 dark:border-green-700">
                        <p className="font-semibold text-green-800 dark:text-green-300">e-Way Bill Generated Successfully!</p>
                        <p className="text-sm text-green-700 dark:text-green-400">EWB No: <span className="font-mono bg-green-100 dark:bg-green-800/50 p-1 rounded">{ewbNo}</span></p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tds-tcs">
          <Card>
            <CardHeader><CardTitle>TDS/TCS Management</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">This feature is under development.</p></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
