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
import { ArrowLeft, BookUser, LogIn } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import React from 'react';

const attendanceFormSchema = z.object({
  school: z.string({ required_error: 'Please select a school.' }).min(1, 'Please select a school.'),
  scholarId: z.string().min(1, 'Please enter your name or scholar code.'),
  eventId: z.string({ required_error: 'Please select an event.' }).min(1, 'Please select an event.'),
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
      eventId: '',
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
    const scholar = mockScholars.find(s => s.id === data.scholarId);
    const event = mockEvents.find(e => e.id === data.eventId);

    toast({
      title: 'Attendance Logged!',
      description: `${scholar?.firstName} ${scholar?.surname} has successfully logged in for ${event?.name}.`,
    });
    form.reset();
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-primary/10"></div>
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Button asChild variant="ghost" className="absolute top-6 left-6 text-primary-foreground hover:text-primary-foreground/80">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
        <Card className="w-full max-w-2xl clay-card">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
                <LogIn className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-bold">Attendance Portal</CardTitle>
              <CardDescription className="mt-2 text-lg">Log your attendance to record your service hours.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>1. Select Your School</FormLabel>
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
                      <FormLabel>2. Find Your Name</FormLabel>
                       <Combobox
                          options={filteredScholarOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Search for your name..."
                          emptyMessage="No scholar found. Select a school first."
                          disabled={!selectedSchool}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>3. Select the Event</FormLabel>
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

                <Button type="submit" className="w-full md:col-span-2" size="lg">Submit Attendance</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="w-full text-center text-sm text-muted-foreground flex items-center justify-center gap-2 pt-4"><BookUser className="h-4 w-4"/>Your total hours will be updated upon successful log out.</p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
