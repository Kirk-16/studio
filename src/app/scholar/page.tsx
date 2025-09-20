'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { schools, mockEvents, mockScholars, mockAttendanceLogs } from '@/lib/data';
import type { AttendanceLog } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, BookUser } from 'lucide-react';
import React from 'react';

const attendanceFormSchema = z.object({
  school: z.string({ required_error: 'Please select a school.' }).min(1, 'Please select a school.'),
  scholarId: z.string().min(1, 'Please select your name.'),
  eventId: z.string({ required_error: 'Please select an event.' }).min(1, 'Please select an event.'),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export default function ScholarPage() {
  const { toast } = useToast();
  const [attendanceLogs, setAttendanceLogs] = React.useState<AttendanceLog[]>(mockAttendanceLogs);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      school: '',
      scholarId: '',
      eventId: '',
    },
  });

  const selectedSchool = form.watch('school');

  const filteredScholars = React.useMemo(() => {
    if (!selectedSchool) {
        return [];
    }
    return mockScholars.filter(scholar => scholar.school === selectedSchool);
  }, [selectedSchool]);

  React.useEffect(() => {
    form.resetField('scholarId');
  }, [selectedSchool, form]);


  function onSubmit(data: AttendanceFormValues) {
    const scholar = mockScholars.find(s => s.id === data.scholarId);
    const event = mockEvents.find(e => e.id === data.eventId);
    if (!scholar || !event) return;

    const activeLog = attendanceLogs.find(
      (log) => log.scholarId === data.scholarId && log.eventId === data.eventId && !log.logOutTime
    );

    if (activeLog) {
      // Scholar is logging out
      const logOutTime = new Date();
      const logInTime = new Date(activeLog.logInTime);
      const hours = (logOutTime.getTime() - logInTime.getTime()) / 1000 / 60 / 60;
      
      // Clamp hours between event's min and max
      const hoursEarned = Math.max(event.minHours, Math.min(hours, event.maxHours));

      setAttendanceLogs(prev => 
        prev.map(log => 
          log.id === activeLog.id ? { ...log, logOutTime, hoursEarned: parseFloat(hoursEarned.toFixed(2)) } : log
        )
      );

      // In a real app, you would also update the scholar's total accumulated hours
      
      toast({
        title: 'Successfully Logged Out!',
        description: `${scholar.firstName} earned an estimated ${hoursEarned.toFixed(2)} hours for ${event.name}.`,
      });

    } else {
      // Scholar is logging in
      const newLog: AttendanceLog = {
        id: `log-${Date.now()}`,
        scholarId: data.scholarId,
        eventId: data.eventId,
        logInTime: new Date(),
        hoursEarned: 0,
      };
      setAttendanceLogs(prev => [...prev, newLog]);
      toast({
        title: 'Successfully Logged In!',
        description: `${scholar.firstName} ${scholar.surname} has logged in for ${event.name}.`,
      });
    }

    form.reset();
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-background via-secondary to-background">
       <div className="absolute top-0 left-0 right-0 h-[300px] bg-primary/10"></div>
       <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Button asChild variant="ghost" className="absolute top-6 left-6 text-primary hover:text-primary/80">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
        <Card className="w-full max-w-md clay-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Scholar Attendance</CardTitle>
            <CardDescription className="mt-2 text-lg">Log your attendance to record your service hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>2. Select Your Name</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSchool}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredScholars.map((scholar) => (
                            <SelectItem key={scholar.id} value={scholar.id}>
                              {`${scholar.firstName} ${scholar.surname} (${scholar.scholarCode})`}
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
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. Select the Event</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg">Submit Attendance</Button>
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
