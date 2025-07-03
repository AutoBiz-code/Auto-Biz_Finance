
"use client";

import { useState, type FormEvent, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, PlusCircle, Trash2, Building, Landmark, User, Truck, IndianRupee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { generateGstPdfAction, type GstInvoiceItem } from "@/actions/autobiz-features";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface BillItem extends GstInvoiceItem {
  id: string; // For React key prop
}

const initialItem: BillItem = { 
  id: crypto.randomUUID(), 
  description: "", 
  hsnSac: "", 
  quantity: 1, 
  unit: "PCS", 
  rate: 0, 
  discount: 0, 
  taxRate: 18 
};

export default function GstBillingPage() {
  // Invoice Header
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date;
  });

  // Company Details
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGstin, setCompanyGstin] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  
  // Customer Details
  const [customerName, setCustomerName] = useState("");
  const [customerGstin, setCustomerGstin] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(true);
  
  // Items
  const [itemsList, setItemsList] = useState<BillItem[]>([initialItem]);
  
  // Charges & Totals
  const [shippingCharges, setShippingCharges] = useState(0);
  
  // Payment Details
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");

  // Optional Fields
  const [notes, setNotes] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.");
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isShippingSameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, isShippingSameAsBilling]);

  const handleItemChange = (index: number, field: keyof Omit<BillItem, "id">, value: string | number) => {
    const newItems = [...itemsList];
    const currentItem = { ...newItems[index] };
    (currentItem as any)[field] = value;
    newItems[index] = currentItem;
    setItemsList(newItems);
  };

  const handleAddItem = () => {
    setItemsList([...itemsList, { ...initialItem, id: crypto.randomUUID() }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = itemsList.filter((_, i) => i !== index);
    setItemsList(newItems);
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    
    itemsList.forEach(item => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discountPercent = Number(item.discount) || 0;
      const taxRatePercent = Number(item.taxRate) || 0;

      const amount = quantity * rate;
      const discountAmount = amount * (discountPercent / 100);
      const taxableValue = amount - discountAmount;
      const taxAmount = taxableValue * (taxRatePercent / 100);
      
      subtotal += taxableValue;
      totalTax += taxAmount;
      totalDiscount += discountAmount;
    });

    const grandTotal = subtotal + totalTax + (Number(shippingCharges) || 0);

    return { subtotal, totalTax, totalDiscount, grandTotal };
  }, [itemsList, shippingCharges]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!invoiceNumber || !invoiceDate || !dueDate || !companyName || !companyAddress || !companyGstin || !customerName || !billingAddress || itemsList.some(item => !item.description || !item.hsnSac)) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields marked with *. This includes invoice details, company/customer info, and item descriptions with HSN/SAC codes.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const itemsToSubmit: GstInvoiceItem[] = itemsList.map(item => ({
        description: item.description,
        hsnSac: item.hsnSac,
        quantity: Number(item.quantity) || 0,
        unit: item.unit,
        rate: Number(item.rate) || 0,
        discount: Number(item.discount) || 0,
        taxRate: Number(item.taxRate) || 0,
      }));

      const result = await generateGstPdfAction({
        userId: user?.uid || "guest-user",
        invoiceNumber,
        invoiceDate: invoiceDate.toISOString(),
        dueDate: dueDate.toISOString(),
        companyName,
        companyAddress,
        companyGstin,
        companyEmail,
        companyPhone,
        customerName,
        customerGstin,
        customerPhone,
        customerEmail,
        billingAddress,
        shippingAddress: isShippingSameAsBilling ? billingAddress : shippingAddress,
        items: itemsToSubmit,
        shippingCharges: Number(shippingCharges) || 0,
        bankName,
        accountNumber,
        ifscCode,
        branch,
        notes,
        termsAndConditions,
      });

      if (result.success && result.htmlContent) {
        toast({ title: "Generating PDF...", description: "Please wait while we prepare your download." });
        
        const { default: jsPDF } = await import('jspdf');
        const { default: html2canvas } = await import('html2canvas');

        const invoiceElement = document.createElement('div');
        invoiceElement.style.width = '210mm'; 
        invoiceElement.style.padding = '10px';
        invoiceElement.style.backgroundColor = 'white';
        invoiceElement.innerHTML = result.htmlContent;
        invoiceElement.style.position = 'absolute';
        invoiceElement.style.left = '-9999px';
        document.body.appendChild(invoiceElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        html2canvas(invoiceElement, { scale: 3, useCORS: true }) 
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice-${invoiceNumber}.pdf`);

            document.body.removeChild(invoiceElement);
            
            toast({ title: "PDF Downloaded", description: "Your invoice has been downloaded successfully." });
          });
      } else {
        toast({ title: "Error", description: result.error || "Failed to generate PDF content.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling generateGstPdfAction:", error);
      toast({ title: "Critical Error", description: "A critical error occurred. Please check the console.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">GST Invoice Generation</h1>
        <p className="mt-2 text-muted-foreground">Create and generate detailed GST-compliant invoices in the TallyPrime format.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-xl bg-card text-card-foreground border-primary/20">
          <CardHeader>
            <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g., INV-001" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <DatePicker date={invoiceDate} setDate={setInvoiceDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <DatePicker date={dueDate} setDate={setDueDate} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold bg-primary-gradient bg-clip-text text-transparent"><Building className="h-5 w-5 text-primary"/> Seller Details *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required/>
              <Textarea placeholder="Company Address" value={companyAddress} onChange={e => setCompanyAddress(e.target.value)} required/>
              <Input placeholder="Company GSTIN" value={companyGstin} onChange={e => setCompanyGstin(e.target.value)} required/>
              <Input type="email" placeholder="Company Email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)}/>
              <Input type="tel" placeholder="Company Phone" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)}/>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold bg-primary-gradient bg-clip-text text-transparent"><User className="h-5 w-5 text-primary"/> Buyer Details *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Input placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required/>
               <Textarea placeholder="Billing Address" value={billingAddress} onChange={e => setBillingAddress(e.target.value)} required/>
               <Input placeholder="Customer GSTIN (if applicable)" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)}/>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="sameAsBilling" checked={isShippingSameAsBilling} onCheckedChange={(checked) => setIsShippingSameAsBilling(checked as boolean)} />
                    <Label htmlFor="sameAsBilling" className="cursor-pointer">Shipping address is the same as billing address</Label>
                </div>
                {!isShippingSameAsBilling && (
                    <Textarea placeholder="Shipping Address" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required={!isShippingSameAsBilling}/>
                )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">Items *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsList.map((item, index) => (
              <Card key={item.id} className="p-4 bg-input/30">
                <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 md:col-span-4 space-y-1">
                        <Label htmlFor={`desc-${index}`} className="text-xs">Description</Label>
                        <Input id={`desc-${index}`} value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} placeholder="Item Name" required />
                    </div>
                    <div className="col-span-6 md:col-span-2 space-y-1">
                        <Label htmlFor={`hsn-${index}`} className="text-xs">HSN/SAC</Label>
                        <Input id={`hsn-${index}`} value={item.hsnSac} onChange={(e) => handleItemChange(index, "hsnSac", e.target.value)} placeholder="HSN" required />
                    </div>
                     <div className="col-span-6 md:col-span-1 space-y-1">
                        <Label htmlFor={`qty-${index}`} className="text-xs">Qty</Label>
                        <Input id={`qty-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} placeholder="1" min="0"/>
                    </div>
                     <div className="col-span-6 md:col-span-1 space-y-1">
                        <Label htmlFor={`unit-${index}`} className="text-xs">Unit</Label>
                        <Input id={`unit-${index}`} value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} placeholder="PCS"/>
                    </div>
                    <div className="col-span-6 md:col-span-1 space-y-1">
                        <Label htmlFor={`rate-${index}`} className="text-xs">Rate</Label>
                        <Input id={`rate-${index}`} type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} placeholder="0" min="0"/>
                    </div>
                     <div className="col-span-6 md:col-span-1 space-y-1">
                        <Label htmlFor={`tax-${index}`} className="text-xs">Tax %</Label>
                        <Input id={`tax-${index}`} type="number" value={item.taxRate} onChange={(e) => handleItemChange(index, "taxRate", e.target.value)} placeholder="18" min="0"/>
                    </div>
                    <div className="col-span-6 md:col-span-1 space-y-1 text-right">
                       {itemsList.length > 1 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-xl bg-card text-card-foreground">
                <CardHeader><CardTitle className="flex items-center gap-2 font-bold bg-primary-gradient bg-clip-text text-transparent"><Landmark className="h-5 w-5 text-primary"/> Payment Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Bank Name (e.g. HDFC BANK LTD)" value={bankName} onChange={e => setBankName(e.target.value)}/>
                    <Input placeholder="Bank Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}/>
                    <Input placeholder="IFSC Code" value={ifscCode} onChange={e => setIfscCode(e.target.value)}/>
                    <Input placeholder="Branch" value={branch} onChange={e => setBranch(e.target.value)}/>
                    <div className="space-y-2">
                        <Label htmlFor="shippingCharges">Freight/Shipping Charges</Label>
                        <Input id="shippingCharges" type="number" value={shippingCharges} onChange={e => setShippingCharges(Number(e.target.value))} placeholder="0"/>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-xl bg-card text-card-foreground">
                <CardHeader><CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">Notes & Terms</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Textarea placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)}/>
                    <Textarea placeholder="Terms & Conditions..." value={termsAndConditions} onChange={e => setTermsAndConditions(e.target.value)} rows={5}/>
                </CardContent>
            </Card>
        </div>

        <Card className="shadow-xl bg-card text-card-foreground">
          <CardHeader><CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">Invoice Totals</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-right text-lg">
            <p>Subtotal: <span className="font-mono">{totals.subtotal.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span></p>
            <p>Total Tax: <span className="font-mono">{totals.totalTax.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span></p>
            <p>Shipping: <span className="font-mono">{(Number(shippingCharges) || 0).toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span></p>
            <p className="font-bold text-xl">Grand Total: <span className="font-mono">{totals.grandTotal.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span></p>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate & Download Invoice
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

    