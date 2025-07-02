export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  dayType: 'standard' | 'dayoff' | 'sick' | 'overtime' | 'holiday';
  approved: boolean;
  isActual?: boolean; // true when modified after approval
  approvedBy?: string;
  approvedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  accessLevel: 'admin' | 'manager' | 'hr' | 'employee';
  initials: string;
  color: string;
  email?: string;
}

export interface WeekValidation {
  weekStart: string;
  isValidated: boolean;
  validatedBy?: string;
  validatedAt?: string;
}

export interface MonthLock {
  month: string; // format: 'YYYY-MM'
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

export interface WeeklyTimelineProps {
  employees?: Employee[];
}