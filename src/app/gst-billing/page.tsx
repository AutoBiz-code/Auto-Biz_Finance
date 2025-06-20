
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, PlusCircle, Trash2, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { generateGstPdfAction, type GstPdfItem } from "@/actions/autobiz-features";
import { DatePicker } from "@/components/ui/date-picker";

interface BillItem extends GstPdfItem {
  id: string; // For React key prop
}

export default function GstBillingPage() {
  // Company Details
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGstin, setCompanyGstin] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // Customer Details
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
  const [itemsList, setItemsList] = useState<BillItem[]>([
    { id: crypto.randomUUID(), name: "", quantity: 1, rate: 0, taxRate: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleItemChange = (index: number, field: keyof Omit<BillItem, "id" | "total">, value: string | number) => {
    const newItems = [...itemsList];
    const currentItem = { ...newItems[index] };

    if (field === 'name') {
        currentItem.name = value as string;
    } else {
        // For quantity, rate, taxRate
        const numValue = parseFloat(value as string);
        if (!isNaN(numValue)) {
            if (field === 'quantity') currentItem.quantity = numValue;
            else if (field === 'rate') currentItem.rate = numValue;
            else if (field === 'taxRate') currentItem.taxRate = numValue;
        } else if (value === "") { // If empty string, set to 0
           if (field === 'quantity') currentItem.quantity = 0;
           else if (field === 'rate') currentItem.rate = 0;
           else if (field === 'taxRate') currentItem.taxRate = 0;
        }
        // If value is non-numeric and not empty (e.g. "abc"), the field retains its previous value due to the conditions above.
    }
    
    // Defensively calculate total, ensuring inputs are numbers
    const q = Number(currentItem.quantity);
    const r = Number(currentItem.rate);
    const tr = Number(currentItem.taxRate);

    const finalQ = isNaN(q) ? 0 : q;
    const finalR = isNaN(r) ? 0 : r;
    const finalTR = isNaN(tr) ? 0 : tr;
    
    currentItem.total = finalQ * finalR * (1 + finalTR / 100);
    newItems[index] = currentItem;
    setItemsList(newItems);
  };

  const handleAddItem = () => {
    setItemsList([...itemsList, { id: crypto.randomUUID(), name: "", quantity: 1, rate: 0, taxRate: 0, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = itemsList.filter((_, i) => i !== index);
    setItemsList(newItems);
  };

  const calculateGrandTotal = () => {
    return itemsList.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to generate GST bills.", variant: "destructive" });
      router.push("/sign-in");
      return;
    }
    if (!companyName || !companyAddress || !companyGstin || !companyEmail || !customerName || !customerAddress || !customerPhone || !invoiceDate || itemsList.some(item => !item.name || item.quantity <= 0 || item.rate <= 0 || item.taxRate < 0)) {
      toast({ title: "Missing Information", description: "Please fill out all required company, customer, and item details correctly. Ensure item quantity and rate are positive, and tax rate is non-negative.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const itemsToSubmit: GstPdfItem[] = itemsList.map(item => ({
        name: item.name,
        quantity: Number(item.quantity) || 0,
        rate: Number(item.rate) || 0,
        taxRate: Number(item.taxRate) || 0,
        total: Number(item.total) || 0,
      }));

      const result = await generateGstPdfAction({
        userId: user.uid,
        companyName,
        companyAddress,
        companyGstin,
        companyEmail,
        companyPhone,
        customerName,
        customerAddress,
        customerPhone,
        invoiceDate: invoiceDate.toISOString(),
        items: itemsToSubmit,
        notes,
      });
      
      toast({
        title: "GST Bill PDF Generation Initiated (Simulated)",
        description: `PDF for ${customerName} is being generated. ${result.message}`,
      });
      // Reset form (optional - consider user experience)
      // setCompanyName(""); setCompanyAddress(""); setCompanyGstin(""); setCompanyEmail(""); setCompanyPhone("");
      // setCustomerName(""); setCustomerAddress(""); setCustomerPhone("");
      // setInvoiceDate(new Date());
      // setItemsList([{ id: crypto.randomUUID(), name: "", quantity: 1, rate: 0, taxRate: 0, total: 0 }]);
      // setNotes("");
    } catch (error: any) {
      console.error("GST Bill generation error:", error);
      toast({ title: "Error", description: error.message || "Failed to initiate PDF generation.", variant: "destructive" });
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">GST Bill Generation</h1>
        <p className="mt-2 text-muted-foreground">Create and generate detailed GST-compliant bills as PDFs.</p>
      </header>

      <Card className="max-w-4xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <FileText className="h-6 w-6 text-primary" />
            New GST Bill
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your company details, customer details, and bill items below. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Company Details */}
            <section>
              <h3 className="text-xl font-medium text-card-foreground mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Your Company Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-card-foreground">Company Name *</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your Business Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyGstin" className="text-card-foreground">Company GSTIN *</Label>
                    <Input id="companyGstin" value={companyGstin} onChange={(e) => setCompanyGstin(e.target.value)} placeholder="Your Company GSTIN" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress" className="text-card-foreground">Company Address *</Label>
                  <Textarea id="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Your Company's Full Address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail" className="text-card-foreground">Company Email *</Label>
                    <Input id="companyEmail" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="yourcompany@example.com" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone" className="text-card-foreground">Company Phone</Label>
                    <Input id="companyPhone" type="tel" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="Your Company Phone Number" />
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-border/50" />

            {/* Customer Details */}
            <section>
              <h3 className="text-xl font-medium text-card-foreground mb-4">Customer Details</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-card-foreground">Customer Name *</Label>
                    <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Acme Corp" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-card-foreground">Customer Phone *</Label>
                    <Input id="customerPhone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g., 9876543210" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerAddress" className="text-card-foreground">Customer Address *</Label>
                  <Textarea id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="e.g., 123 Main St, Anytown" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate" className="text-card-foreground">Invoice Date *</Label>
                  <DatePicker date={invoiceDate} setDate={setInvoiceDate} className="bg-input border-border text-foreground focus:ring-primary" />
                </div>
              </div>
            </section>

            <hr className="border-border/50" />
            
            {/* Itemized List */}
            <section>
              <h3 className="text-xl font-medium text-card-foreground mb-4">Items *</h3>
              <div className="space-y-4">
                {itemsList.map((item, index) => (
                  <Card key={item.id} className="p-4 space-y-3 bg-input/50 border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="md:col-span-2 space-y-1">
                        <Label htmlFor={`itemName-${index}`} className="text-xs">Item Name</Label>
                        <Input id={`itemName-${index}`} value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} placeholder="Product/Service Name" required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`quantity-${index}`} className="text-xs">Quantity</Label>
                        <Input id={`quantity-${index}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} placeholder="Qty" required min="0.01" step="any"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`rate-${index}`} className="text-xs">Rate (INR)</Label>
                        <Input id={`rate-${index}`} type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} placeholder="Rate" required min="0.01" step="any"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`taxRate-${index}`} className="text-xs">Tax Rate (%)</Label>
                        <Input id={`taxRate-${index}`} type="number" value={item.taxRate} onChange={(e) => handleItemChange(index, "taxRate", e.target.value)} placeholder="GST %" required min="0" step="any"/>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Item Total: <span className="font-semibold text-foreground">₹{item.total.toFixed(2)}</span>
                      </p>
                      {itemsList.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={handleAddItem} className="text-primary border-primary hover:bg-primary/10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </section>
            
            {/* Grand Total */}
            <div className="text-right mt-6">
              <p className="text-xl font-bold text-foreground">
                Grand Total: ₹{calculateGrandTotal().toFixed(2)}
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-card-foreground">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes or terms and conditions." />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-metamask" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Generate GST PDF
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
