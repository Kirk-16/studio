import type { Scholar, Event, School, AttendanceLog } from './types';

export const schools: School[] = ['STI', 'SDC', 'SEC', 'SNSU', 'SPUS', 'SJTIT', 'NEMCO'];

export const mockScholars: Scholar[] = [
  { id: '1', scholarCode: 'STI-2023-001', school: 'STI', firstName: 'Juan', middleName: 'Reyes', surname: 'Dela Cruz', accumulatedHours: 120 },
  { id: '2', scholarCode: 'SDC-2023-001', school: 'SDC', firstName: 'Maria', middleName: 'Santos', surname: 'Clara', accumulatedHours: 85.5 },
  { id: '3', scholarCode: 'SEC-2024-001', school: 'SEC', firstName: 'Pedro', middleName: 'Gonzales', surname: 'Santos', accumulatedHours: 42 },
  { id: '4', scholarCode: 'SNSU-2023-002', school: 'SNSU', firstName: 'Ana', middleName: 'Lopez', surname: 'Garcia', accumulatedHours: 150 },
  { id: '5', scholarCode: 'SPUS-2024-002', school: 'SPUS', firstName: 'Jose', middleName: 'Martinez', surname: 'Rodriguez', accumulatedHours: 20 },
  { id: '6', scholarCode: 'SJTIT-2023-003', school: 'SJTIT', firstName: 'Luz', middleName: 'Cruz', surname: 'Hernandez', accumulatedHours: 98 },
  { id: '7', scholarCode: 'NEMCO-2024-003', school: 'NEMCO', firstName: 'Rizal', middleName: 'Bonifacio', surname: 'Mabini', accumulatedHours: 73.5 },
  { id: '8', scholarCode: 'STI-2023-004', school: 'STI', firstName: 'Andres', middleName: 'Luna', surname: 'Aguinaldo', accumulatedHours: 66 },
];

export const mockEvents: Event[] = [
    { id: 'evt1', name: 'Coastal Cleanup 2024', date: new Date('2024-08-15T08:00:00'), duration: '8:00 AM - 12:00 PM', minHours: 2, maxHours: 4 },
    { id: 'evt2', name: 'Community Pantry Volunteering', date: new Date('2024-08-20T09:00:00'), duration: '9:00 AM - 3:00 PM', minHours: 3, maxHours: 6 },
    { id: 'evt3', name: 'Scholarship Program Orientation', date: new Date('2024-09-01T13:00:00'), duration: '1:00 PM - 5:00 PM', minHours: 2, maxHours: 4 },
    { id: 'evt4', name: 'Tree Planting at Mabua', date: new Date('2024-09-10T07:00:00'), duration: '7:00 AM - 11:00 AM', minHours: 2, maxHours: 4 },
];

export const mockAttendanceLogs: AttendanceLog[] = [
    // Pre-existing logs can be added here for testing
];
