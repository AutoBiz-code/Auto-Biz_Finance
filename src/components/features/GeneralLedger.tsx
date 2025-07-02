
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the General Ledger - reset for a new user
const ledgerEntries = [
  { id: 1, date: "2024-01-01", particulars: "Opening Balance", debit: 0.00, credit: 0.00, balance: 0.00 },
];

export default function GeneralLedger() {
  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <Card className="shadow-lg bg-card text-card-foreground col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-bold bg-primary-gradient bg-clip-text text-transparent">General Ledger</CardTitle>
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
              <TableHead className="text-right">Debit (Rupees)</TableHead>
              <TableHead className="text-right">Credit (Rupees)</TableHead>
              <TableHead className="text-right">Balance (Rupees)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgerEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell className="font-medium">{entry.particulars}</TableCell>
                <TableCell className="text-right">
                    {entry.debit > 0 ? formatNumber(entry.debit) : '-'}
                </TableCell>
                <TableCell className="text-right">
                    {entry.credit > 0 ? formatNumber(entry.credit) : '-'}
                </TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(entry.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
