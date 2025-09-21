import { getEvents } from '@/lib/data';
import type { Event } from '@/lib/types';
import { EventCalendar } from './components/event-calendar';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-muted-foreground">Add, edit, and manage events using the calendar.</p>
      </div>
      <EventCalendar initialEvents={events} />
    </div>
  );
}
