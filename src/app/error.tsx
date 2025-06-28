
"use client"; 

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-foreground p-4">
      <div className="bg-card p-8 rounded-lg shadow-xl text-center max-w-md w-full border border-border">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h2 className="text-3xl font-headline font-semibold text-card-foreground mb-4">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected issue. Please try again.
        </p>
        {error.message && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-6">
                Error details: {error.message}
            </p>
        )}
        <Button
          onClick={() => reset()}
          className="btn-tally-gradient hover-scale"
          aria-label="Try again"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
