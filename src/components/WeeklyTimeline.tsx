import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { TimeEntryDialog } from './TimeEntryDialog';
import { format, addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  dayType: 'standard' | 'dayoff' | 'sick' | 'overtime' | 'holiday';
  approved: boolean;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

const employees: Employee[] = [
  { id: '1', name: 'Federica Beretta', role: 'Director', initials: 'FB', color: 'bg-blue-500' },
  { id: '2', name: 'Julien Cornette', role: 'Sales Assistant', initials: 'JC', color: 'bg-green-500' },
  { id: '3', name: 'Eva Dmitrenko', role: 'Gallery Assistant', initials: 'ED', color: 'bg-purple-500' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const weekendDays = ['Sat', 'Sun'];

export const WeeklyTimeline = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<{ employeeId: string; date: string } | null>(null);
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry[]>>({});

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const workDays = weekDates.slice(1, 6); // Tue-Sat
  const displayDates = [weekDates[0], ...workDays, weekDates[6]]; // Mon, Tue-Sat, Sun

  const applyStandardWeek = () => {
    const newEntries = { ...timeEntries };
    
    employees.forEach(employee => {
      if (!newEntries[employee.id]) {
        newEntries[employee.id] = [];
      }
      
      // Apply standard schedule for Tuesday-Saturday (workDays)
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
    
    setTimeEntries(newEntries);
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

  const getDayTypeColor = (dayType: string, hours: number) => {
    switch (dayType) {
      case 'standard':
        if (hours > 8) return 'bg-orange-100 border-orange-200 text-orange-800';
        if (hours < 8) return 'bg-blue-100 border-blue-200 text-blue-800';
        return 'bg-green-100 border-green-200 text-green-800';
      case 'dayoff':
        return 'bg-gray-100 border-gray-200 text-gray-600';
      case 'overtime':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'sick':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'holiday':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-500';
    }
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Weekly Timeline</CardTitle>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={applyStandardWeek}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Apply Standard Week
            </Button>
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
                        className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getDayTypeColor(entry.dayType, entry.hours)}`}
                        onClick={() => setSelectedEntry({ employeeId: employee.id, date: format(date, 'yyyy-MM-dd') })}
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
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed border-2 hover:border-solid"
                        onClick={() => setSelectedEntry({ employeeId: employee.id, date: format(date, 'yyyy-MM-dd') })}
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
            onSave={(entry) => {
              setTimeEntries(prev => ({
                ...prev,
                [selectedEntry.employeeId]: [
                  ...(prev[selectedEntry.employeeId] || []).filter(e => e.date !== selectedEntry.date),
                  entry
                ]
              }));
              setSelectedEntry(null);
            }}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};
