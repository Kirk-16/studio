import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          Batang Surigaonon Scholars Club Attendance Monitoring System
        </h1>
        <p className="text-muted-foreground text-lg">
          Log attendance, track hours, and manage scholar activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="clay-card hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <User className="w-10 h-10 text-accent" />
            <div className="space-y-1">
              <CardTitle className="text-2xl">Scholar Portal</CardTitle>
              <CardDescription>Log your attendance for events.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Access the portal to log in or out of events and view your accumulated service hours.
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href="/scholar">
                Go to Scholar Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="clay-card hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex-row items-center gap-4">
            <Shield className="w-10 h-10 text-primary" />
            <div className="space-y-1">
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>Manage scholars and events.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Full access to manage scholar profiles, create and oversee events, and monitor attendance records.
            </p>
            <Button asChild className="w-full" variant="secondary" size="lg">
              <Link href="/admin">
                Go to Admin Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
