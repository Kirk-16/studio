import type { Timestamp } from 'firebase/firestore';

export type School = 'STI' | 'SDC' | 'SEC' | 'SNSU' | 'SPUS' | 'SJTIT' | 'NEMCO';

export interface Scholar {
  id: string;
  scholarCode: string;
  school: School;
  firstName: string;
  middleName: string;
  surname: string;
  accumulatedHours: number;
}

export interface Event {
  id: string;
  name: string;
  date: Date | Timestamp;
  duration: string;
  minHours: number;
  maxHours: number;
}

export interface AttendanceLog {
  id: string;
  scholarId: string;
  eventId: string;
  logInTime: Date | Timestamp;
  logOutTime?: Date | Timestamp;
  hoursEarned: number;
}
