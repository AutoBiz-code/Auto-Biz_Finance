
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTransactions = [
  { id: 'txn1', date: '2023-10-28', particulars: 'Cheque Deposit #123', type: 'Credit', amount: 5000, reconciled: true },
  { id: 'txn2', date: '2023-10-29', particulars: 'Vendor Payment - Acme Ltd', type: 'Debit', amount: -2500, reconciled: true },
  { id: 'txn3', date: '2023-10-30', particulars: 'Bank Interest', type: 'Credit', amount: 150, reconciled: false },
  { id: 'txn4', date: '2023-10-30', particulars: 'Cash Deposit', type: 'Credit', amount: 10000, reconciled: true },
  { id: 'txn5', date: '2023-10-31', particulars: 'Online Purchase - Cloud Svc', type: 'Debit', amount: -1200, reconciled: false },
  { id: 'txn6', date: '2023-10-31', particulars: 'Cheque Issued #502', type: 'Debit', amount: -3500, reconciled: false },
  { id: 'txn7', date: '2023-11-01', particulars: 'UPI In - Customer A', type: 'Credit', amount: 800, reconciled: true },
];

async function reconcileSingleTransaction(id: string) {
  console.log("Simulating reconciliation for transaction:", id);
  await new Promise(resolve => setTimeout(resolve, 750));
  if (Math.random() < 0.1) throw new Error("Simulated API error during reconciliation.");
  return { success: true };
}

export default function BankingPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedBank, setSelectedBank] = useState("HDFC-XXXX1234");
  const [isReconciling, setIsReconciling] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReconcile = async (id: string) => {
    setIsReconciling(id);
    try {
      await reconcileSingleTransaction(id);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, reconciled: true } : t));
      toast({ title: "Transaction Reconciled", description: `Transaction ${id} has been marked as reconciled.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reconcile transaction.", variant: "destructive" });
    } finally {
      setIsReconciling(null);
    }
  };

  const unreconciledCount = transactions.filter(t => !t.reconciled).length;
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const reconciledBalance = transactions.filter(t => t.reconciled).reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Banking & Payments</h1>
        <p className="mt-2 text-muted-foreground">Reconcile bank statements, manage payments, and streamline your cash flow.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Bank Reconciliation
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Match your book entries with your bank statement for {selectedBank}.
              </CardDescription>
            </div>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select Bank Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HDFC-XXXX1234">HDFC Bank - ****1234</SelectItem>
                <SelectItem value="ICICI-XXXX5678">ICICI Bank - ****5678</SelectItem>
                <SelectItem value="SBI-XXXX9012">State Bank of India - ****9012</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Amount (INR)</TableHead>
                  <TableHead className="text-center w-[150px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.id} className={t.reconciled ? "bg-accent/50" : ""}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell className="font-medium">{t.particulars}</TableCell>
                    <TableCell className={`text-right font-mono ${t.amount >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                      {t.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </TableCell>
                    <TableCell className="text-center">
                      {t.reconciled ? (
                        <div className="flex items-center justify-center gap-2 text-primary font-medium">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Reconciled</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReconcile(t.id)}
                          disabled={!!isReconciling}
                          className="w-[110px]"
                        >
                          {isReconciling === t.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Reconcile
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center bg-muted/50 p-4 rounded-b-lg border-t">
          <div className="text-sm text-muted-foreground">
             <p className="font-semibold text-foreground">
              Unreconciled Entries: <span className="text-destructive font-bold">{unreconciledCount}</span>
            </p>
          </div>
          <div className="text-sm font-medium text-right space-y-1">
            <p>Reconciled Balance: <span className="font-semibold text-foreground">{reconciledBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></p>
            <p>Total Balance in Books: <span className="font-semibold text-foreground">{balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
