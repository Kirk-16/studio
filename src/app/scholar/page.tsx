'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { schools, mockEvents, mockScholars } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, BookUser } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import React from 'react';

const attendanceFormSchema = z.object({
  school: z.string({ required_error: 'Please select a school.' }).min(1, 'Please select a school.'),
  scholarId: z.string().min(1, 'Please enter your name or scholar code.'),
  event: z.string({ required_error: 'Please select an event.' }).min(1, 'Please select an event.'),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

const eventOptions = mockEvents.map(event => ({
    value: event.id,
    label: event.name,
}));

const scholarOptions = mockScholars.map(scholar => ({
    value: scholar.id,
    label: `${scholar.firstName} ${scholar.surname} (${scholar.scholarCode})`,
    school: scholar.school,
}));

export default function ScholarPage() {
  const { toast } = useToast();
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      school: '',
      scholarId: '',
      event: '',
    },
  });

  const selectedSchool = form.watch('school');

  const filteredScholarOptions = React.useMemo(() => {
    if (!selectedSchool) {
        return [];
    }
    return scholarOptions.filter(scholar => scholar.school === selectedSchool);
  }, [selectedSchool]);

  React.useEffect(() => {
    form.resetField('scholarId');
  }, [selectedSchool, form]);


  function onSubmit(data: AttendanceFormValues) {
    console.log(data);
    // In a real app, you would check if the scholar is already logged in for this event.
    const isLoggingIn = true; // Placeholder
    toast({
      title: 'Success!',
      description: `You have successfully logged ${isLoggingIn ? 'in' : 'out'}.`,
    });
    form.reset();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4 relative">
        <Button asChild variant="ghost" className="absolute top-4 left-4">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
      <Card className="w-full max-w-lg clay-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Scholar Attendance</CardTitle>
          <CardDescription>Log your attendance to record your service hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your school" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scholarId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name or Scholar Code</FormLabel>
                     <Combobox
                        options={filteredScholarOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search for your name..."
                        emptyMessage="No scholar found."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event</FormLabel>
                    <Combobox
                        options={eventOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search for an event..."
                        emptyMessage="No event found."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">Submit Attendance</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2"><BookUser className="h-4 w-4"/>Your total accumulated hours will be updated upon successful log out.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
