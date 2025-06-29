
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Loader2, CalendarClock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { updateStockAction } from "@/actions/autobiz-features";
import { DatePicker } from "@/components/ui/date-picker";

export default function StockManagementPage() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!itemName || !quantity || !price) {
      toast({ title: "Missing Information", description: "Please fill out at least Item Name, Quantity, and Price.", variant: "destructive" });
      return;
    }
    const numQuantity = parseInt(quantity, 10);
    const numPrice = parseFloat(price);

    if (isNaN(numQuantity) || numQuantity < 0) {
      toast({ title: "Invalid Quantity", description: "Quantity must be a non-negative number.", variant: "destructive" });
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      toast({ title: "Invalid Price", description: "Price must be a non-negative number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateStockAction({ 
        userId: user?.uid || "guest-user", 
        itemName, 
        quantity: numQuantity, 
        price: numPrice,
        batchNumber,
        expiryDate: expiryDate?.toISOString(),
        location,
      });
      
      if (result.success) {
        toast({
          title: "Stock Updated",
          description: result.message,
        });
        // Clear form on success
        setItemName("");
        setQuantity("");
        setPrice("");
        setBatchNumber("");
        setExpiryDate(undefined);
        setLocation("");
      } else {
        toast({ title: "Error", description: result.error || "Failed to update stock.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling updateStockAction:", error);
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">Inventory Management</h1>
        <p className="mt-2 text-muted-foreground">Add or update items in your inventory with batch and expiry tracking.</p>
      </header>

      <Card className="max-w-xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-6 w-6 text-primary" />
            Update Stock Item
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter item details to add to or update your stock records. Fields with * are required.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-card-foreground">Item Name *</Label>
              <Input
                id="itemName"
                type="text"
                placeholder="e.g., Premium Coffee Beans"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-card-foreground">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-card-foreground">Price per Item (INR) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 250.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber" className="text-card-foreground flex items-center gap-1">
                  Batch Number
                </Label>
                <Input
                  id="batchNumber"
                  type="text"
                  placeholder="e.g., B-103-C"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-card-foreground flex items-center gap-1">
                   <CalendarClock className="h-4 w-4"/> Expiry Date
                </Label>
                 <DatePicker date={expiryDate} setDate={setExpiryDate} placeholder="Select expiry date" />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="location" className="text-card-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4"/> Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Warehouse A, Shelf 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full btn-tally-gradient" disabled={isLoading || authLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
              Update Stock
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
