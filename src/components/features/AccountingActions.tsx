
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportReportAction } from "@/actions/autobiz-features";
import { Filter, Download, Loader2 } from "lucide-react";

export default function AccountingActions() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportReportAction({ reportType: 'General Ledger', format: 'PDF' });
      if (result.success) {
        toast({
          title: "Export Successful",
          description: "Your General Ledger report is ready for download.",
          action: (
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">Download</Button>
            </a>
          ),
        });
      } else {
        toast({ title: "Export Failed", description: result.error || "Could not export the report.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling exportReportAction:", error);
      toast({ title: "Export Failed", description: "A critical error occurred. Please check the console.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter by Date
      </Button>
      <Button onClick={handleExport} disabled={isExporting}>
        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </Button>
    </div>
  );
}
