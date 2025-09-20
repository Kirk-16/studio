'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, PlusCircle, Search, Sparkles } from 'lucide-react';
import type { Scholar, School } from '@/lib/types';
import { schools } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const scholarFormSchema = z.object({
    id: z.string().optional(),
    surname: z.string().min(1, "Surname is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().min(1, "Middle name is required"),
    school: z.string({ required_error: 'Please select a school.' }),
    scholarCode: z.string().min(1, "Scholar code is required"),
    accumulatedHours: z.number().min(0, "Hours must be non-negative"),
});

type ScholarFormValues = z.infer<typeof scholarFormSchema>;

export function ScholarDataTable({ data }: { data: Scholar[] }) {
  const [scholars, setScholars] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [selectedScholar, setSelectedScholar] = React.useState<Scholar | null>(null);
  const { toast } = useToast();

  const form = useForm<ScholarFormValues>({
    resolver: zodResolver(scholarFormSchema),
    defaultValues: {
        accumulatedHours: 0
    }
  });

  const handleAdd = () => {
    setSelectedScholar(null);
    form.reset({ 
        surname: '',
        firstName: '',
        middleName: '',
        school: undefined,
        scholarCode: '',
        accumulatedHours: 0
     });
    setIsFormOpen(true);
  };

  const handleEdit = (scholar: Scholar) => {
    setSelectedScholar(scholar);
    form.reset({
        ...scholar,
        school: scholar.school as string,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (scholar: Scholar) => {
    setSelectedScholar(scholar);
    setIsDeleteAlertOpen(true);
  }

  const confirmDelete = () => {
    if(!selectedScholar) return;
    // Mock deletion
    setScholars(prev => prev.filter(s => s.id !== selectedScholar.id));
    toast({ title: 'Success', description: 'Scholar profile deleted.' });
    setIsDeleteAlertOpen(false);
    setSelectedScholar(null);
  }

  const onSubmit = (values: ScholarFormValues) => {
    if (selectedScholar) { // Editing
        setScholars(prev => prev.map(s => s.id === selectedScholar.id ? { ...selectedScholar, ...values, school: values.school as School } : s));
        toast({ title: 'Success', description: 'Scholar profile updated.' });
    } else { // Adding
        const newScholar: Scholar = { ...values, id: `sch-${Date.now()}`, school: values.school as School };
        setScholars(prev => [...prev, newScholar].sort((a,b) => a.surname.localeCompare(b.surname)));
        toast({ title: 'Success', description: 'New scholar added.' });
    }
    setIsFormOpen(false);
  };

  const generateScholarCode = () => {
    const school = form.getValues("school") as School;
    if (!school) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a school first.' });
        return;
    }
    const year = new Date().getFullYear();
    const schoolScholars = scholars.filter(s => s.school === school);
    const newId = (schoolScholars.length + 1).toString().padStart(3, '0');
    const code = `${school}-${year}-${newId}`;
    form.setValue('scholarCode', code);
  }

  const filteredScholars = scholars.filter((scholar) =>
    `${scholar.firstName} ${scholar.surname} ${scholar.scholarCode} ${scholar.school}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clay-card p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input
            placeholder="Search scholars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            />
        </div>
        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add Scholar</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Surname</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Scholar Code</TableHead>
              <TableHead className="text-right">Accumulated Hours</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScholars.map((scholar) => (
              <TableRow key={scholar.id}>
                <TableCell className="font-medium">{scholar.surname}</TableCell>
                <TableCell>{scholar.firstName}</TableCell>
                <TableCell>{scholar.school}</TableCell>
                <TableCell>{scholar.scholarCode}</TableCell>
                <TableCell className="text-right font-semibold">{scholar.accumulatedHours}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(scholar)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(scholar)} className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedScholar ? 'Edit Scholar' : 'Add Scholar'}</DialogTitle>
            <DialogDescription>{selectedScholar ? 'Update the details of the scholar.' : 'Add a new scholar to the system.'}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField name="surname" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Surname</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="firstName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <FormField name="middleName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="school" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger></FormControl>
                            <SelectContent>{schools.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="scholarCode" control={form.control} render={({ field }) => (
                     <FormItem>
                        <FormLabel>Scholar Code</FormLabel>
                        <div className="flex gap-2">
                           <FormControl><Input {...field} /></FormControl>
                           <Button type="button" variant="outline" onClick={generateScholarCode}><Sparkles className="h-4 w-4"/></Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="accumulatedHours" control={form.control} render={({ field }) => (
                     <FormItem>
                        <FormLabel>Accumulated Hours</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the scholar profile for <span className="font-semibold">{selectedScholar?.firstName} {selectedScholar?.surname}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </div>
  );
}
