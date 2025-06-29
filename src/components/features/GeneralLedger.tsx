
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the General Ledger
const ledgerEntries = [
  { id: 1, date: "2023-10-01", particulars: "Opening Balance", debit: 50000.00, credit: 0.00, balance: 50000.00 },
  { id: 2, date: "2023-10-03", particulars: "Sales to Acme Corp (Invoice #101)", debit: 0.00, credit: 15000.00, balance: 65000.00 },
  { id: 3, date: "2023-10-05", particulars: "Purchase of Raw Materials", debit: 7500.00, credit: 0.00, balance: 57500.00 },
  { id: 4, date: "2023-10-10", particulars: "Payment from Acme Corp", debit: 0.00, credit: 15000.00, balance: 72500.00 },
  { id: 5, date: "2023-10-15", particulars: "Rent Paid", debit: 10000.00, credit: 0.00, balance: 62500.00 },
  { id: 6, date: "2023-10-25", particulars: "Salaries Paid", debit: 25000.00, credit: 0.00, balance: 37500.00 },
];

export default function GeneralLedger() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <Card className="shadow-lg bg-card text-card-foreground col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-card-foreground">General Ledger</CardTitle>
        <CardDescription className="text-muted-foreground">
          A complete record of all financial transactions for the period.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Particulars</TableHead>
              <TableHead className="text-right">Debit</TableHead>
              <TableHead className="text-right">Credit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgerEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell className="font-medium">{entry.particulars}</TableCell>
                <TableCell className="text-right">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                </TableCell>
                <TableCell className="text-right">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                </TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(entry.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
