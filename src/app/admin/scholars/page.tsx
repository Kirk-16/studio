import { mockScholars, schools } from '@/lib/data';
import type { Scholar } from '@/lib/types';
import { ScholarDataTable } from './components/scholar-data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

async function getScholars(): Promise<Scholar[]> {
  // In a real app, you'd fetch this from a database
  return new Promise((resolve) =>
    setTimeout(() => {
      const sortedScholars = [...mockScholars].sort((a, b) =>
        a.surname.localeCompare(b.surname)
      );
      resolve(sortedScholars);
    }, 500)
  );
}

export default async function ScholarsPage() {
  const scholars = await getScholars();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Scholar Management</h1>
        <p className="text-muted-foreground">Add, edit, and manage scholar profiles by school.</p>
      </div>
      <Tabs defaultValue={schools[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7">
            {schools.map(school => (
                <TabsTrigger key={school} value={school}>{school}</TabsTrigger>
            ))}
        </TabsList>
        {schools.map(school => {
            const schoolScholars = scholars.filter(s => s.school === school);
            return (
                <TabsContent key={school} value={school}>
                    <ScholarDataTable data={schoolScholars} />
                </TabsContent>
            )
        })}
      </Tabs>
    </div>
  );
}
