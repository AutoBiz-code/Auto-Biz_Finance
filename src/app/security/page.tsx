"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'Admin' | 'Manager' | 'Accountant' | 'Clerk';

interface TeamMember {
  id: string;
  email: string;
  role: UserRole;
}

const initialTeamMembers: TeamMember[] = [
  { id: 'usr_1', email: 'rohan.sharma@autobiz.co', role: 'Admin' },
  { id: 'usr_2', email: 'priya.patel@autobiz.co', role: 'Manager' },
  { id: 'usr_3', email: 'amit.singh@autobiz.co', role: 'Accountant' },
  { id: 'usr_4', email: 'sunita.verma@autobiz.co', role: 'Clerk' },
];

export default function SecurityPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const { toast } = useToast();

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // In a real app, this would be a server action call
    console.log(`Updating role for ${userId} to ${newRole}`);
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === userId ? { ...member, role: newRole } : member
      )
    );
    toast({
      title: "Role Updated",
      description: `The role for the user has been successfully updated to ${newRole}.`,
    });
  };

  return (
    <div className="space-y-8 fade-in">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Security & Access Control</h1>
        <p className="mt-2 text-muted-foreground">Manage user roles and permissions to protect your financial data.</p>
      </header>
      
      <Card className="shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Roles & Permissions
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Assign roles to your team members to control their access to different features of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Email</TableHead>
                            <TableHead className="w-full md:w-[250px]">Assigned Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.email}</TableCell>
                                <TableCell>
                                    <Select
                                        value={member.role}
                                        onValueChange={(newRole: UserRole) => handleRoleChange(member.id, newRole)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Manager">Manager</SelectItem>
                                            <SelectItem value="Accountant">Accountant</SelectItem>
                                            <SelectItem value="Clerk">Clerk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-card-foreground">Other Security Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-input/50">
                        <ShieldCheck className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Data Encryption</h4>
                            <p className="text-xs text-muted-foreground">Your data is encrypted at rest and in transit.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-4 rounded-lg border bg-input/50">
                        <ShieldCheck className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Audit Logs</h4>
                            <p className="text-xs text-muted-foreground">Full functionality coming soon.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3 p-4 rounded-lg border bg-input/50">
                        <ShieldCheck className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-card-foreground">Secure Remote Access</h4>
                            <p className="text-xs text-muted-foreground">Enabled via secure authentication.</p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
