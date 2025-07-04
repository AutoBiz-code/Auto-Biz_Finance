
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOutboundIpAction } from '@/actions/autobiz-features';

export default function IpCheckPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckIp = async () => {
    setIsLoading(true);
    setIpAddress(null);
    try {
      const result = await getOutboundIpAction();
      if (result.success && result.ip) {
        setIpAddress(result.ip);
        toast({
          title: "IP Address Retrieved",
          description: `The server's outbound IP is ${result.ip}`,
        });
      } else {
        setIpAddress('Error retrieving IP.');
        toast({
          title: "Error",
          description: result.error || 'Failed to retrieve IP address.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setIpAddress('A critical error occurred.');
      toast({
        title: "Critical Error",
        description: 'Could not connect to the server. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-bold bg-primary-gradient bg-clip-text text-transparent">Server IP Check</h1>
        <p className="mt-2 text-muted-foreground">
          Check the server's outbound IP address for whitelisting with external services like GST portals.
        </p>
      </header>

      <Card className="max-w-md mx-auto shadow-xl bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            Outbound IP Address
          </CardTitle>
          <CardDescription>
            Click the button below to make a request from the server and identify its public IP address.
            This IP is dynamic and can change.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCheckIp} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Server className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Checking...' : 'Check Server IP'}
          </Button>
          {ipAddress && (
            <div className="mt-6 p-4 rounded-md bg-input text-center">
              <p className="text-sm text-muted-foreground">Detected IP Address:</p>
              <p className="text-2xl font-bold font-mono text-primary">{ipAddress}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
