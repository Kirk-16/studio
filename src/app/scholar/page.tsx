'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { schools, mockEvents } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, BookUser } from 'lucide-react';
import { Logo } from '@/components/logo';

const attendanceFormSchema = z.object({
  school: z.string({ required_error: 'Please select a school.' }),
  scholarId: z.string().min(1, 'Please enter your name or scholar code.'),
  event: z.string({ required_error: 'Please select an event.' }),
  logType: z.enum(['login', 'logout'], { required_error: 'Please select log in or log out.' }),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export default function ScholarPage() {
  const { toast } = useToast();
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
  });

  function onSubmit(data: AttendanceFormValues) {
    console.log(data);
    toast({
      title: 'Success!',
      description: `You have successfully logged ${data.logType === 'login' ? 'in' : 'out'}.`,
    });
    form.reset({
      school: '',
      scholarId: '',
      event: '',
      logType: undefined,
    });
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4 relative">
        <Button asChild variant="ghost" className="absolute top-4 left-4">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
        </Button>
      <Card className="w-full max-w-lg clay-card">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo className="w-16 h-16" />
            </div>
          <CardTitle className="text-2xl font-bold">Scholar Attendance</CardTitle>
          <CardDescription>Log in or out for an event to record your service hours.</CardDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Name or Scholar Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Juan Dela Cruz or STI-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the event you are joining" />
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

              <FormField
                control={form.control}
                name="logType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="login" />
                          </FormControl>
                          <FormLabel className="font-normal">Log In</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="logout" />
                          </FormControl>
                          <FormLabel className="font-normal">Log Out</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
