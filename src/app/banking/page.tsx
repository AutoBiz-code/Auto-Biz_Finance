
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Loader2, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reconcileTransactionsAction } from "@/actions/autobiz-features";

const mockTransactions: any[] = [];

async function reconcileSingleTransaction(id: string) {
  console.log("Simulating reconciliation for transaction:", id);
  await new Promise(resolve => setTimeout(resolve, 750));
  const result = await reconcileTransactionsAction({ transactionIds: [id] });
  if (!result.success) {
    throw new Error(result.error || "Simulated API error during reconciliation.");
  }
  return result;
}

export default function BankingPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedBank, setSelectedBank] = useState("HDFC-XXXX1234");
  const [isReconciling, setIsReconciling] = useState<string | null>(null);
  const [selectedTxns, setSelectedTxns] = useState(new Set<string>());
  const [isBulkReconciling, setIsBulkReconciling] = useState(false);
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
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allUnreconciledIds = new Set(
        transactions.filter(t => !t.reconciled).map(t => t.id)
      );
      setSelectedTxns(allUnreconciledIds);
    } else {
      setSelectedTxns(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedTxns(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };
  
  const handleReconcileSelected = async () => {
    setIsBulkReconciling(true);
    try {
      const result = await reconcileTransactionsAction({ transactionIds: Array.from(selectedTxns) });
      if (result.success) {
        setTransactions(prev =>
          prev.map(t => (selectedTxns.has(t.id) ? { ...t, reconciled: true } : t))
        );
        setSelectedTxns(new Set());
        toast({
          title: "Bulk Reconcile Successful",
          description: result.message,
        });
      } else {
        toast({ title: "Error", description: result.error || "Failed to reconcile transactions.", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Critical Error", description: "A critical error occurred while reconciling.", variant: "destructive" });
    } finally {
      setIsBulkReconciling(false);
    }
  };


  const unreconciledCount = transactions.filter(t => !t.reconciled).length;
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const reconciledBalance = transactions.filter(t => t.reconciled).reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Banking & Payments</h1>
        <p className="mt-2 text-muted-foreground">Reconcile bank statements, manage payments, and streamline your cash flow.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Bank Reconciliation
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Match your book entries with your bank statement for {selectedBank}.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleReconcileSelected} disabled={isBulkReconciling || selectedTxns.size === 0}>
                {isBulkReconciling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reconcile Selected ({selectedTxns.size})
              </Button>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Select Bank Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDFC-XXXX1234">HDFC Bank - ****1234</SelectItem>
                  <SelectItem value="ICICI-XXXX5678">ICICI Bank - ****5678</SelectItem>
                  <SelectItem value="SBI-XXXX9012">State Bank of India - ****9012</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={unreconciledCount > 0 && selectedTxns.size === unreconciledCount}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all unreconciled"
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Amount (Rupees)</TableHead>
                  <TableHead className="text-center w-[150px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No transactions to display.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map(t => (
                    <TableRow key={t.id} className={t.reconciled ? "bg-accent/10" : ""}>
                      <TableCell>
                        {!t.reconciled && (
                          <Checkbox
                            checked={selectedTxns.has(t.id)}
                            onCheckedChange={(checked) => handleSelect(t.id, checked as boolean)}
                            aria-label={`Select transaction ${t.id}`}
                          />
                        )}
                      </TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell className="font-medium">{t.particulars}</TableCell>
                      <TableCell className={`text-right font-mono ${t.amount >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                        {t.amount.toLocaleString('en-IN')}
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
                            disabled={!!isReconciling || isBulkReconciling}
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
                  ))
                )}
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
            <p>Reconciled Balance: <span className="font-semibold text-foreground">{reconciledBalance.toLocaleString('en-IN')}</span></p>
            <p>Total Balance in Books: <span className="font-semibold text-foreground">{balance.toLocaleString('en-IN')}</span></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
