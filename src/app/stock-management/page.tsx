
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { updateStockAction } from "@/actions/autobiz-features"; // Placeholder

export default function StockManagementPage() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to manage stock.", variant: "destructive" });
      router.push("/sign-in");
      return;
    }
    if (!itemName || !quantity || !price) {
      toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
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
      // In a real app, this would call a server action that saves/updates data in Firestore
      const result = await updateStockAction({ userId: user.uid, itemName, quantity: numQuantity, price: numPrice });
      
      toast({
        title: "Stock Updated (Simulated)",
        description: `${itemName} stock details saved. Message: ${result.message}`,
      });
      setItemName("");
      setQuantity("");
      setPrice("");
    } catch (error: any) {
      console.error("Stock update error:", error);
      toast({ title: "Error", description: error.message || "Failed to update stock.", variant: "destructive" });
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">Stock Management</h1>
        <p className="mt-2 text-muted-foreground">Add or update items in your inventory.</p>
      </header>

      <Card className="max-w-lg mx-auto shadow-xl bg-card text-card-foreground border-primary/20 hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-6 w-6 text-primary" />
            Update Stock Item
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter item details to add to or update your stock records in Firestore.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="itemName" className="text-card-foreground">Item Name</Label>
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
                <Label htmlFor="quantity" className="text-card-foreground">Quantity</Label>
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
                <Label htmlFor="price" className="text-card-foreground">Price per Item (INR)</Label>
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
