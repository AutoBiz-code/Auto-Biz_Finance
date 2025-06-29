
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2, PlusCircle, Trash2, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addEmployeeAction, processPayrollAction } from "@/actions/autobiz-features";

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  salary: number;
}

export default function PayrollPage() {
  const { loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !department || !salary || !phoneNumber) {
      toast({ title: "Missing Information", description: "Please fill out all employee details.", variant: "destructive" });
      return;
    }
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      toast({ title: "Invalid Salary", description: "Please enter a valid positive salary.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const newEmployee = {
        id: crypto.randomUUID(), // Temp ID for client-side
        name,
        email,
        phoneNumber,
        department,
        salary: salaryNum
      };
      
      await addEmployeeAction({ ...newEmployee });
      
      setEmployees(prev => [...prev, newEmployee]);
      toast({ title: "Employee Added", description: `${name} has been added successfully.` });
      
      // Reset form
      setName("");
      setEmail("");
      setPhoneNumber("");
      setDepartment("");
      setSalary("");

    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add employee.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleProcessPayroll = async (employeeId: string, employeeName: string) => {
    setIsProcessing(employeeId);
    try {
      // Simulate standard deductions
      const standardDeductions = { PF: 1800, ESI: 750 };
      await processPayrollAction({ employeeId, deductions: standardDeductions });
      toast({ title: "Payroll Processed", description: `Payroll for ${employeeName} has been processed with standard deductions.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process payroll.", variant: "destructive" });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    // In a real app, this would also call a server action to delete the employee
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    toast({ title: "Employee Removed", description: "The employee has been removed from the list." });
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
        <h1 className="text-3xl font-headline font-semibold text-foreground">Employee & Payroll Management</h1>
        <p className="mt-2 text-muted-foreground">Manage your employees, process salaries, and handle compliance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <Card className="shadow-xl bg-card text-card-foreground border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <PlusCircle className="h-6 w-6 text-primary" />
                Add New Employee
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleAddEmployee}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Full Name</Label>
                    <Input id="employeeName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Rohan Sharma" required/>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employeeEmail">Email</Label>
                            <Input id="employeeEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g., rohan@example.com" required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employeePhone">Phone Number</Label>
                            <Input id="employeePhone" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g., 9876543210" required/>
                        </div>
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeDept">Department</Label>
                    <Input id="employeeDept" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g., Sales" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeSalary">Salary (Monthly, INR)</Label>
                    <Input id="employeeSalary" type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g., 50000" required/>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                      {isSaving ? "Saving..." : "Add Employee"}
                  </Button>
                </CardFooter>
            </form>
           </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="shadow-xl bg-card text-card-foreground border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Users className="h-6 w-6 text-primary" />
                Employee List
              </CardTitle>
              <CardDescription>
                View and manage payroll for all your employees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                 <p className="text-muted-foreground text-center py-8">No employees added yet. Use the form to add your first employee.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Salary (INR)</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}<br/><span className="text-xs text-muted-foreground">{emp.email} | {emp.phoneNumber}</span></TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell className="text-right">{emp.salary.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                            <Button size="sm" onClick={() => handleProcessPayroll(emp.id, emp.name)} disabled={isProcessing === emp.id}>
                                {isProcessing === emp.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <DollarSign className="h-4 w-4"/>}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveEmployee(emp.id)} disabled={!!isProcessing}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
