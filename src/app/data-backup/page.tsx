
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, DatabaseBackup, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DataBackupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <p className="text-lg text-muted-foreground mb-4">Please sign in to manage data backups.</p>
        <Button onClick={() => router.push('/sign-in')} className="btn-tally-gradient">Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Data Backup & Restore</h1>
        <p className="mt-2 text-muted-foreground">Securely back up your company data to the cloud and restore it anytime.</p>
      </header>

      <Card className="max-w-2xl mx-auto shadow-xl bg-card text-card-foreground border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <DatabaseBackup className="h-6 w-6 text-primary" />
            Backup & Restore
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            This section is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-12">
            <Construction className="h-24 w-24 text-primary/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
                Coming Soon!
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                This feature will allow you to perform secure, one-click backups of your critical financial data to the cloud. You'll also be able to restore your data from a previous backup point with ease.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
