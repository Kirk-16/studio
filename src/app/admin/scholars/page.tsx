import { mockScholars } from '@/lib/data';
import type { Scholar } from '@/lib/types';
import { ScholarDataTable } from './components/scholar-data-table';

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
        <p className="text-muted-foreground">Add, edit, and manage scholar profiles.</p>
      </div>
      <ScholarDataTable data={scholars} />
    </div>
  );
}
