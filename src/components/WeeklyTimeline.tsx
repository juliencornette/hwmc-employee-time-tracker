import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, ChevronLeft, ChevronRight, Calendar, Lock, Check, Shield } from 'lucide-react';
import { TimeEntryDialog } from './TimeEntryDialog';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameMonth } from 'date-fns';

interface TimeEntry {
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

interface Employee {
  id: string;
  name: string;
  role: string;
  accessLevel: 'admin' | 'manager' | 'hr' | 'employee';
  initials: string;
  color: string;
  email?: string;
}

interface WeekValidation {
  weekStart: string;
  isValidated: boolean;
  validatedBy?: string;
  validatedAt?: string;
}

interface MonthLock {
  month: string; // format: 'YYYY-MM'
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

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

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weekendDays = ['Sat', 'Sun'];

interface WeeklyTimelineProps {
  employees?: Employee[];
}

export const WeeklyTimeline = ({ employees: externalEmployees }: WeeklyTimelineProps) => {
  // Always start with current week
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<{ employeeId: string; date: string } | null>(null);
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry[]>>({});
  const [weekValidations, setWeekValidations] = useState<WeekValidation[]>([]);
  const [monthLocks, setMonthLocks] = useState<MonthLock[]>([]);
  const [userRole] = useState<'admin' | 'manager' | 'hr'>('admin'); // Mock user role

  // Filter out HR and Line Manager employees from the timeline
  const employees = (externalEmployees || initialEmployees).filter(emp => 
    emp.accessLevel !== 'hr' && emp.accessLevel !== 'manager'
  );

  console.log('Filtered employees for timeline:', employees);
  console.log('Current time entries:', timeEntries);

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

  const getEntryForDate = (employeeId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return timeEntries[employeeId]?.find(entry => entry.date === dateStr);
  };

  const getWeeklyTotal = (employeeId: string) => {
    const total = workDays.reduce((sum, date) => {
      const entry = getEntryForDate(employeeId, date);
      return sum + (entry?.hours || 0);
    }, 0);
    return total;
  };

  const getDayTypeColor = (dayType: string, hours: number, isActual?: boolean, isValidated?: boolean) => {
    let baseColor = '';
    
    switch (dayType) {
      case 'standard':
        if (hours > 8) baseColor = 'bg-orange-100 border-orange-200 text-orange-800';
        else if (hours < 8) baseColor = 'bg-blue-100 border-blue-200 text-blue-800';
        else baseColor = 'bg-green-100 border-green-200 text-green-800';
        break;
      case 'dayoff':
        baseColor = 'bg-gray-100 border-gray-200 text-gray-600';
        break;
      case 'overtime':
        baseColor = 'bg-orange-100 border-orange-200 text-orange-800';
        break;
      case 'sick':
        baseColor = 'bg-red-100 border-red-200 text-red-800';
        break;
      case 'holiday':
        baseColor = 'bg-purple-100 border-purple-200 text-purple-800';
        break;
      default:
        baseColor = 'bg-gray-50 border-gray-200 text-gray-500';
    }

    // Add visual indicators for validation states
    if (isActual && isValidated) {
      baseColor += ' ring-2 ring-yellow-400'; // Actual entries after validation
    } else if (isValidated) {
      baseColor += ' ring-2 ring-green-400'; // Validated planning
    }

    return baseColor;
  };

  const formatTimeRange = (entry: TimeEntry) => {
    if (entry.dayType === 'dayoff') return 'Day Off';
    if (entry.dayType === 'sick') return 'Sick Leave';
    if (entry.dayType === 'holiday') return 'Holiday';
    return `${entry.startTime} - ${entry.endTime}`;
  };

  const getHoursDifference = (hours: number, dayType: string) => {
    if (dayType !== 'standard') return '';
    const diff = hours - 8;
    if (diff > 0) return `+${diff}h`;
    if (diff < 0) return `${diff}h`;
    return '';
  };

  const canEditEntry = () => {
    return !isMonthLocked;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold">Weekly Timeline</CardTitle>
            {isWeekValidated && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Week Validated
              </Badge>
            )}
            {isMonthLocked && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Month Locked
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={applyStandardWeek}
              className="flex items-center gap-2"
              disabled={isWeekValidated || isMonthLocked}
            >
              <Calendar className="h-4 w-4" />
              Apply Standard Week
            </Button>
            
            {(userRole === 'manager' || userRole === 'admin') && !isWeekValidated && (
              <Button 
                variant="default" 
                onClick={validateWeek}
                className="flex items-center gap-2"
                disabled={isMonthLocked}
              >
                <Check className="h-4 w-4" />
                Validate Week
              </Button>
            )}
            
            {(userRole === 'hr' || userRole === 'admin') && !isMonthLocked && (
              <Button 
                variant="destructive" 
                onClick={lockMonth}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Lock Month for Payroll
              </Button>
            )}

            {(userRole === 'hr' || userRole === 'admin') && isMonthLocked && (
              <Button 
                variant="outline" 
                onClick={unlockMonth}
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                <Lock className="h-4 w-4" />
                Unlock Month
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-4 pb-4 border-b">
            <div className="font-semibold text-gray-700">Employee</div>
            {displayDates.map((date, index) => (
              <div key={index} className="text-center">
                <div className="font-semibold text-gray-700">
                  {index === 0 ? 'Mon' : index === 6 ? 'Sun' : weekDays[index - 1]}
                </div>
                <div className="text-sm text-gray-500">{format(date, 'd')}</div>
              </div>
            ))}
            <div className="text-center font-semibold text-gray-700">Weekly Total</div>
          </div>

          {/* Employee Rows */}
          {employees.map((employee) => (
            <div key={employee.id} className="grid grid-cols-8 gap-4 items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${employee.color} text-white font-semibold`}>
                    {employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{employee.name}</div>
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </div>
              </div>

              {displayDates.map((date, index) => {
                const entry = getEntryForDate(employee.id, date);
                const isWorkDay = index > 0 && index < 6;
                
                return (
                  <div key={index} className="space-y-2">
                    {entry ? (
                      <div
                        className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getDayTypeColor(entry.dayType, entry.hours, entry.isActual, isWeekValidated)}`}
                        onClick={() => canEditEntry() && setSelectedEntry({ employeeId: employee.id, date: format(date, 'yyyy-MM-dd') })}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-lg">{formatTimeRange(entry)}</div>
                          <div className="text-sm font-medium">{entry.hours}h</div>
                          <div className="text-xs">{getHoursDifference(entry.hours, entry.dayType)}</div>
                          {entry.dayType !== 'standard' && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {entry.dayType === 'dayoff' ? 'Personal day' : 
                               entry.dayType === 'sick' ? 'Sick day' :
                               entry.dayType === 'holiday' ? 'Holiday' : 'Standard day'}
                            </Badge>
                          )}
                          {entry.isActual && isWeekValidated && (
                            <Badge variant="outline" className="mt-1 text-xs bg-yellow-50">
                              Actual
                            </Badge>
                          )}
                          {isWeekValidated && !entry.isActual && (
                            <Badge variant="outline" className="mt-1 text-xs bg-green-50">
                              Planning
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed border-2 hover:border-solid"
                        onClick={() => canEditEntry() && setSelectedEntry({ employeeId: employee.id, date: format(date, 'yyyy-MM-dd') })}
                        disabled={!canEditEntry()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Entry
                      </Button>
                    )}
                  </div>
                );
              })}

              <div className="text-center">
                <div className="font-bold text-xl text-gray-900">{getWeeklyTotal(employee.id)}h</div>
                <div className="text-sm text-gray-500">of 40h</div>
                <div className={`text-sm font-medium ${getWeeklyTotal(employee.id) > 40 ? 'text-orange-600' : 
                  getWeeklyTotal(employee.id) < 40 ? 'text-blue-600' : 'text-green-600'}`}>
                  {getWeeklyTotal(employee.id) > 40 ? `+${getWeeklyTotal(employee.id) - 40}h` :
                   getWeeklyTotal(employee.id) < 40 ? `${getWeeklyTotal(employee.id) - 40}h` : 'On Target'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedEntry && (
          <TimeEntryDialog
            employeeId={selectedEntry.employeeId}
            date={selectedEntry.date}
            existingEntry={timeEntries[selectedEntry.employeeId]?.find(e => e.date === selectedEntry.date)}
            isWeekValidated={isWeekValidated}
            onSave={(entry) => {
              console.log('Saving time entry:', entry);
              const updatedEntry = {
                ...entry,
                isActual: isWeekValidated // Mark as actual if week was already validated
              };
              
              setTimeEntries(prev => {
                const newEntries = {
                  ...prev,
                  [selectedEntry.employeeId]: [
                    ...(prev[selectedEntry.employeeId] || []).filter(e => e.date !== selectedEntry.date),
                    updatedEntry
                  ]
                };
                console.log('Updated time entries:', newEntries);
                return newEntries;
              });
              setSelectedEntry(null);
            }}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};
