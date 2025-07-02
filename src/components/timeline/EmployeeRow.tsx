import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Employee, TimeEntry } from '@/types/timeline';
import { TimeEntryCell } from './TimeEntryCell';
import { getEntryForDate, getWeeklyTotal } from '@/utils/timelineUtils';

interface EmployeeRowProps {
  employee: Employee;
  displayDates: Date[];
  workDays: Date[];
  timeEntries: Record<string, TimeEntry[]>;
  isWeekValidated: boolean;
  canEdit: boolean;
  onEntryClick: (employeeId: string, date: string) => void;
}

export const EmployeeRow = ({
  employee,
  displayDates,
  workDays,
  timeEntries,
  isWeekValidated,
  canEdit,
  onEntryClick
}: EmployeeRowProps) => {
  const weeklyTotal = getWeeklyTotal(timeEntries, employee.id, workDays);

  return (
    <div className="grid grid-cols-8 gap-4 items-center">
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
        const entry = getEntryForDate(timeEntries, employee.id, date);
        
        return (
          <div key={index} className="space-y-2">
            <TimeEntryCell
              entry={entry}
              onEntryClick={() => onEntryClick(employee.id, format(date, 'yyyy-MM-dd'))}
              canEdit={canEdit}
              isWeekValidated={isWeekValidated}
            />
          </div>
        );
      })}

      <div className="text-center">
        <div className="font-bold text-xl text-gray-900">{weeklyTotal}h</div>
        <div className="text-sm text-gray-500">of 40h</div>
        <div className={`text-sm font-medium ${weeklyTotal > 40 ? 'text-orange-600' : 
          weeklyTotal < 40 ? 'text-blue-600' : 'text-green-600'}`}>
          {weeklyTotal > 40 ? `+${weeklyTotal - 40}h` :
           weeklyTotal < 40 ? `${weeklyTotal - 40}h` : 'On Target'}
        </div>
      </div>
    </div>
  );
};