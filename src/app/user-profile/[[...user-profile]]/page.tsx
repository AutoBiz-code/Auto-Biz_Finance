import { UserProfile } from "@clerk/nextjs";
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = {
  title: "User Profile | AutoBiz Finance",
};

export default async function UserProfilePage() {
  const user = await currentUser();
  const plan = user?.publicMetadata?.plan as string || 'Basic';
  const conversationCount = user?.publicMetadata?.conversationCount as number || 0;
  
  let conversationLimit = 500; // Basic
  if (plan === 'Pro') conversationLimit = 1500;
  if (plan === 'Enterprise') conversationLimit = Infinity; // Or a very high number for display

  const usagePercentage = conversationLimit === Infinity ? 0 : (conversationCount / conversationLimit) * 100;

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-headline font-semibold text-foreground">User Profile & Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
         <UserProfile path="/user-profile" routing="path">
            <UserProfile.Page label="Account" />
            <UserProfile.Page label="Security" />
            {/* Add other pages as needed, e.g., for plan management if Clerk supports it or via custom pages */}
          </UserProfile>
        </div>
        <Card className="bg-card text-card-foreground shadow-lg">
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Your current subscription and usage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Email:</p>
              <p className="text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Plan:</p>
              <p className="text-primary font-semibold text-lg">{plan}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Conversation Usage:</p>
              <p className="text-muted-foreground">{conversationCount} / {conversationLimit === Infinity ? "Unlimited" : conversationLimit}</p>
              {conversationLimit !== Infinity && (
                <Progress value={usagePercentage} className="mt-2 h-3 [&>div]:bg-gradient-to-r [&>div]:from-secondary [&>div]:to-primary" aria-label={`Conversation usage ${usagePercentage.toFixed(0)}%`} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
