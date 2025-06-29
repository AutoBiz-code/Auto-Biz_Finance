
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DatabaseBackup, Loader2, HardDriveDownload, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createBackupAction, restoreBackupAction } from "@/actions/autobiz-features";
import { format } from 'date-fns';

interface Backup {
  id: string;
  createdAt: Date;
  size: string; // e.g. "15.2 MB"
}

export default function DataBackupPage() {
  const { loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [backups, setBackups] = useState<Backup[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  // Load initial backups (simulation)
  useEffect(() => {
    // In a real app, you'd fetch this list from Firestore
    const mockBackups: Backup[] = [
      { id: crypto.randomUUID(), createdAt: new Date(new Date().setDate(new Date().getDate() - 7)), size: "14.8 MB" },
      { id: crypto.randomUUID(), createdAt: new Date(new Date().setDate(new Date().getDate() - 1)), size: "15.1 MB" },
    ];
    setBackups(mockBackups);
  }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const result = await createBackupAction({ userId: "guest-user" });
      if (result.success && result.backupId) {
        const newBackup: Backup = {
          id: result.backupId,
          createdAt: new Date(result.createdAt),
          size: result.size
        };
        setBackups(prev => [newBackup, ...prev]);
        toast({ title: "Backup Created", description: `Successfully created backup ${newBackup.id}.` });
      } else {
        toast({ title: "Error", description: result.error || "Failed to create backup.", variant: "destructive" });
      }
    } catch (error: any) {
       console.error("Critical error calling createBackupAction:", error);
       toast({ title: "Critical Error", description: "A critical error occurred. Please check the console.", variant: "destructive" });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    setIsRestoring(backupId);
    try {
      const result = await restoreBackupAction({ backupId });
      if (result.success) {
        toast({ title: "Restore Initiated", description: `Restoring data from backup ${backupId}. The application may be temporarily unavailable.` });
      } else {
        toast({ title: "Error", description: result.error || "Failed to restore backup.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Critical error calling restoreBackupAction:", error);
      toast({ title: "Critical Error", description: "A critical error occurred. Please check the console.", variant: "destructive" });
    } finally {
      setIsRestoring(null);
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">Data Backup & Restore</h1>
        <p className="mt-2 text-muted-foreground">Securely back up your company data to the cloud and restore it anytime.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-xl bg-card text-card-foreground border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <DatabaseBackup className="h-6 w-6 text-primary" />
              Create Backup
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create a secure, point-in-time backup of all your company data.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                  This will save a snapshot of all your current invoices, customers, products, and transactions. It's recommended to do this regularly.
              </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateBackup} className="w-full" disabled={isBackingUp}>
                {isBackingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {isBackingUp ? "Backing up..." : "Backup Now"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-xl bg-card text-card-foreground border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <History className="h-6 w-6 text-primary" />
              Backup History
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Restore your data from a previous backup point.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {backups.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No backups found.</p>
            ) : (
              backups.map(backup => (
                <div key={backup.id} className="flex items-center justify-between p-3 rounded-md border bg-input/50">
                  <div>
                    <p className="font-medium text-foreground">{format(backup.createdAt, 'PPP p')}</p>
                    <p className="text-xs text-muted-foreground">Size: {backup.size} | ID: ...{backup.id.slice(-6)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleRestoreBackup(backup.id)} disabled={isRestoring === backup.id}>
                    {isRestoring === backup.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <HardDriveDownload className="mr-2 h-4 w-4"/>}
                    Restore
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
