import type { Scholar, Event, School, AttendanceLog } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';

export const schools: School[] = ['STI', 'SDC', 'SEC', 'SNSU', 'SPUS', 'SJTIT', 'NEMCO'];

// Scholar Functions
export async function getScholars(): Promise<Scholar[]> {
  const scholarsCol = collection(db, 'scholars');
  const scholarSnapshot = await getDocs(scholarsCol);
  const scholarList = scholarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scholar));
  return scholarList.sort((a, b) => a.surname.localeCompare(b.surname));
}

export async function addScholar(scholar: Omit<Scholar, 'id'>): Promise<string> {
    const scholarsCol = collection(db, 'scholars');
    const docRef = await addDoc(scholarsCol, scholar);
    return docRef.id;
}

export async function updateScholar(id: string, scholar: Partial<Scholar>): Promise<void> {
    const scholarDoc = doc(db, 'scholars', id);
    await updateDoc(scholarDoc, scholar);
}

export async function deleteScholar(id: string): Promise<void> {
    const scholarDoc = doc(db, 'scholars', id);
    await deleteDoc(scholarDoc);
}


// Event Functions
function eventFromDoc(doc: any): Event {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        date: (data.date as Timestamp).toDate(),
    } as Event;
}


export async function getEvents(): Promise<Event[]> {
  const eventsCol = collection(db, 'events');
  const eventSnapshot = await getDocs(eventsCol);
  const eventList = eventSnapshot.docs.map(eventFromDoc);
  return eventList.sort((a,b) => (a.date as Date).getTime() - (b.date as Date).getTime());
}

export async function addEvent(event: Omit<Event, 'id'>): Promise<string> {
    const eventsCol = collection(db, 'events');
    const docRef = await addDoc(eventsCol, {
        ...event,
        date: Timestamp.fromDate(event.date as Date)
    });
    return docRef.id;
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<void> {
    const eventDoc = doc(db, 'events', id);
    const updateData: any = { ...event };
    if (event.date && event.date instanceof Date) {
        updateData.date = Timestamp.fromDate(event.date);
    }
    await updateDoc(eventDoc, updateData);
}

export async function deleteEvent(id: string): Promise<void> {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
}


// AttendanceLog Functions
function logFromDoc(doc: any): AttendanceLog {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        logInTime: (data.logInTime as Timestamp).toDate(),
        logOutTime: data.logOutTime ? (data.logOutTime as Timestamp).toDate() : undefined,
    } as AttendanceLog;
}

export async function getAttendanceLogs(): Promise<AttendanceLog[]> {
    const logsCol = collection(db, 'attendanceLogs');
    const logSnapshot = await getDocs(logsCol);
    return logSnapshot.docs.map(logFromDoc);
}

export async function getActiveLog(scholarId: string, eventId: string): Promise<AttendanceLog | null> {
    const logsCol = collection(db, 'attendanceLogs');
    const q = query(logsCol, where('scholarId', '==', scholarId), where('eventId', '==', eventId), where('logOutTime', '==', null));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    return logFromDoc(snapshot.docs[0]);
}


export async function addAttendanceLog(log: Omit<AttendanceLog, 'id' | 'hoursEarned'>): Promise<string> {
    const logsCol = collection(db, 'attendanceLogs');
    const docRef = await addDoc(logsCol, {
        ...log,
        logInTime: Timestamp.fromDate(log.logInTime as Date),
        hoursEarned: 0,
        logOutTime: null,
    });
    return docRef.id;
}

export async function updateAttendanceLog(id: string, log: Partial<AttendanceLog>): Promise<void> {
    const logDoc = doc(db, 'attendanceLogs', id);
    const updateData: any = { ...log };
    if (log.logInTime && log.logInTime instanceof Date) {
        updateData.logInTime = Timestamp.fromDate(log.logInTime);
    }
    if (log.logOutTime && log.logOutTime instanceof Date) {
        updateData.logOutTime = Timestamp.fromDate(log.logOutTime);
    }
    await updateDoc(logDoc, updateData);
}
