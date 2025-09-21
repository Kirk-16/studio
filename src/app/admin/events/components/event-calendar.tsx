'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import type { Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { addEvent, updateEvent, deleteEvent } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

const eventFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Event name is required"),
  date: z.date({ required_error: "A date is required."}),
  duration: z.string().min(1, "Duration is required"),
  minHours: z.coerce.number().min(0, "Min hours must be non-negative"),
  maxHours: z.coerce.number().min(0, "Max hours must be non-negative"),
}).refine(data => data.maxHours >= data.minHours, {
    message: "Max hours must be greater than or equal to min hours",
    path: ["maxHours"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventCalendar({ initialEvents }: { initialEvents: Event[] }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [events, setEvents] = React.useState<Event[]>(initialEvents);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EventFormValues>({ resolver: zodResolver(eventFormSchema), defaultValues: { minHours: 0, maxHours: 0 } });

  React.useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startingDayIndex = getDay(start);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const handleAdd = () => {
    setSelectedEvent(null);
    form.reset({ name: '', date: new Date(), duration: '', minHours: 0, maxHours: 0 });
    setIsFormOpen(true);
  };
  
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    form.reset({
      ...event,
      date: (event.date as Timestamp | Date) instanceof Timestamp ? (event.date as Timestamp).toDate() : (event.date as Date)
    });
    setIsFormOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteAlertOpen(true);
  }

  const confirmDelete = async () => {
    if(!selectedEvent) return;
    try {
        await deleteEvent(selectedEvent.id);
        toast({ title: 'Success', description: 'Event deleted.' });
        router.refresh();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
    }
    setIsDeleteAlertOpen(false);
    setSelectedEvent(null);
  }

  const onSubmit = async (values: EventFormValues) => {
    try {
        if (selectedEvent) { // Editing
            await updateEvent(selectedEvent.id, values);
            toast({ title: 'Success', description: 'Event details updated.' });
        } else { // Adding
            await addEvent(values);
            toast({ title: 'Success', description: 'New event created.' });
        }
        setIsFormOpen(false);
        router.refresh();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save event.' });
    }
  };

  return (
    <Card className="clay-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={goToToday}>Today</Button>
            <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" />Add Event</Button>
      </div>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center font-semibold text-muted-foreground border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startingDayIndex }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b h-32"></div>)}
          {days.map(day => {
            const dayEvents = events.filter(event => isSameDay(event.date as Date, day));
            return (
              <div key={day.toString()} className={cn("border-r border-b p-2 h-32 flex flex-col", { 'bg-blue-50 dark:bg-blue-900/20': isToday(day) })}>
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={cn("font-semibold", {
                    "text-white bg-primary rounded-full w-8 h-8 flex items-center justify-center": isToday(day),
                    "text-primary": dayEvents.length > 0 && !isToday(day)
                  })}
                >
                  {format(day, 'd')}
                </time>
                <div className="flex-grow overflow-y-auto mt-1 space-y-1">
                    {dayEvents.map(event => (
                        <div key={event.id} onClick={() => handleEdit(event)} className="bg-primary/10 text-primary p-1 rounded-md text-xs cursor-pointer hover:bg-primary/20 truncate">
                            {event.name}
                        </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
                <DialogDescription>{selectedEvent ? 'Update the details for this event.' : 'Create a new event.'}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField name="name" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField name="date" control={form.control} render={({ field }) => ( 
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}</Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                            </Popover>
                        <FormMessage /></FormItem> 
                    )}/>
                    <FormField name="duration" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g. 9:00 AM - 5:00 PM" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="minHours" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Min Hours</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                        <FormField name="maxHours" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Max Hours</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    </div>
                    <DialogFooter className="pt-4">
                        {selectedEvent && <Button type="button" variant="destructive" onClick={() => { setIsFormOpen(false); handleDelete(selectedEvent)}}>Delete</Button>}
                        <Button type="submit">Save Event</Button>
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
                This action cannot be undone. This will permanently delete the event: <span className="font-semibold">{selectedEvent?.name}</span>.
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

    </Card>
  );
}
