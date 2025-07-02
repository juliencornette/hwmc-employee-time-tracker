import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { TimeEntry, Employee, WeekValidation, MonthLock } from '@/types/timeline';

export const useTimelineData = (externalEmployees?: Employee[]) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<{ employeeId: string; date: string } | null>(null);
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry[]>>({});
  const [weekValidations, setWeekValidations] = useState<WeekValidation[]>([]);
  const [monthLocks, setMonthLocks] = useState<MonthLock[]>([]);
  const [userRole] = useState<'admin' | 'manager' | 'hr'>('admin'); // Mock user role

  // Initial employees - filtered to exclude HR and Line Manager roles
  const initialEmployees: Employee[] = [
    { 
      id: '1', 
      name: 'Federica Beretta', 
      role: 'Director', 
      accessLevel: 'manager',
      initials: 'FB', 
      color: 'bg-blue-500',
      email: 'federica@company.com'
    },
    { 
      id: '2', 
      name: 'Julien Cornette', 
      role: 'Sales Assistant', 
      accessLevel: 'employee',
      initials: 'JC', 
      color: 'bg-green-500',
      email: 'julien@company.com'
    },
    { 
      id: '3', 
      name: 'Eva Dmitrenko', 
      role: 'Gallery Assistant', 
      accessLevel: 'employee',
      initials: 'ED', 
      color: 'bg-purple-500',
      email: 'eva@company.com'
    },
  ];

  // Filter out HR and Line Manager employees from the timeline
  const employees = (externalEmployees || initialEmployees).filter(emp => 
    emp.accessLevel !== 'hr' && emp.accessLevel !== 'manager'
  );

  useEffect(() => {
    // Ensure we always start with the current week
    const now = new Date();
    setCurrentWeek(now);
    console.log('WeeklyTimeline initialized with current week:', format(now, 'yyyy-MM-dd'));
  }, []);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const workDays = weekDates.slice(1, 6); // Tue-Sat
  const displayDates = [weekDates[0], ...workDays, weekDates[6]]; // Mon, Tue-Sat, Sun

  const currentWeekKey = format(weekStart, 'yyyy-MM-dd');
  const currentMonth = format(weekStart, 'yyyy-MM');

  const isWeekValidated = weekValidations.find(w => w.weekStart === currentWeekKey)?.isValidated || false;
  const isMonthLocked = monthLocks.find(m => m.month === currentMonth)?.isLocked || false;

  const applyStandardWeek = () => {
    if (isWeekValidated || isMonthLocked) return;
    
    console.log('Applying standard week for employees:', employees.map(e => e.name));
    const newEntries = { ...timeEntries };
    
    employees.forEach(employee => {
      if (!newEntries[employee.id]) {
        newEntries[employee.id] = [];
      }
      
      workDays.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingEntry = newEntries[employee.id].find(entry => entry.date === dateStr);
        
        if (!existingEntry) {
          const standardEntry: TimeEntry = {
            id: `${employee.id}-${dateStr}`,
            date: dateStr,
            startTime: '10:00',
            endTime: '18:00',
            hours: 8,
            dayType: 'standard',
            approved: false,
          };
          newEntries[employee.id].push(standardEntry);
        }
      });
    });
    
    console.log('New time entries after applying standard week:', newEntries);
    setTimeEntries(newEntries);
  };

  const validateWeek = () => {
    if (userRole !== 'manager' && userRole !== 'admin') return;
    
    const newValidation: WeekValidation = {
      weekStart: currentWeekKey,
      isValidated: true,
      validatedBy: 'Line Manager',
      validatedAt: new Date().toISOString(),
    };
    
    setWeekValidations(prev => [
      ...prev.filter(w => w.weekStart !== currentWeekKey),
      newValidation
    ]);
  };

  const lockMonth = () => {
    if (userRole !== 'hr' && userRole !== 'admin') return;
    
    const newLock: MonthLock = {
      month: currentMonth,
      isLocked: true,
      lockedBy: 'HR',
      lockedAt: new Date().toISOString(),
    };
    
    setMonthLocks(prev => [
      ...prev.filter(m => m.month !== currentMonth),
      newLock
    ]);
  };

  const unlockMonth = () => {
    if (userRole !== 'hr' && userRole !== 'admin') return;
    
    setMonthLocks(prev => prev.filter(m => m.month !== currentMonth));
  };

  const canEditEntry = () => {
    return !isMonthLocked;
  };

  const saveTimeEntry = (entry: TimeEntry) => {
    console.log('Saving time entry:', entry);
    const updatedEntry = {
      ...entry,
      isActual: isWeekValidated // Mark as actual if week was already validated
    };
    
    setTimeEntries(prev => {
      const newEntries = {
        ...prev,
        [selectedEntry!.employeeId]: [
          ...(prev[selectedEntry!.employeeId] || []).filter(e => e.date !== selectedEntry!.date),
          updatedEntry
        ]
      };
      console.log('Updated time entries:', newEntries);
      return newEntries;
    });
    setSelectedEntry(null);
  };

  return {
    currentWeek,
    setCurrentWeek,
    selectedEntry,
    setSelectedEntry,
    timeEntries,
    setTimeEntries,
    weekValidations,
    monthLocks,
    userRole,
    employees,
    weekStart,
    workDays,
    displayDates,
    currentWeekKey,
    currentMonth,
    isWeekValidated,
    isMonthLocked,
    applyStandardWeek,
    validateWeek,
    lockMonth,
    unlockMonth,
    canEditEntry,
    saveTimeEntry
  };
};