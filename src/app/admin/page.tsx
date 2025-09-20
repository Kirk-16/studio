import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockEvents, mockScholars } from '@/lib/data';
import { Users, Calendar, Hourglass, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  const totalScholars = mockScholars.length;
  const totalEvents = mockEvents.length;
  const totalHours = mockScholars.reduce((sum, scholar) => sum + scholar.accumulatedHours, 0);

  const stats = [
    { title: 'Total Scholars', value: totalScholars, icon: Users, color: 'text-blue-500' },
    { title: 'Total Events', value: totalEvents, icon: Calendar, color: 'text-green-500' },
    { title: 'Total Hours Rendered', value: totalHours.toFixed(1), icon: Hourglass, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="clay-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Current records</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockEvents.slice(0, 3).map((event) => (
                <li key={event.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{event.duration}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="clay-card">
          <CardHeader>
            <CardTitle>Top Scholars by Hours</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-4">
              {mockScholars.sort((a,b) => b.accumulatedHours - a.accumulatedHours).slice(0, 3).map((scholar) => (
                <li key={scholar.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{`${scholar.firstName} ${scholar.surname}`}</p>
                    <p className="text-sm text-muted-foreground">{scholar.school}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{scholar.accumulatedHours} <span className="text-sm font-normal text-muted-foreground">hrs</span></p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
