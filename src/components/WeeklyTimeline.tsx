import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TimeEntryDialog } from './TimeEntryDialog';
import { format } from 'date-fns';
import { WeeklyTimelineProps } from '@/types/timeline';
import { useTimelineData } from '@/hooks/useTimelineData';
import { TimelineHeader } from './timeline/TimelineHeader';
import { EmployeeRow } from './timeline/EmployeeRow';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const WeeklyTimeline = ({ employees: externalEmployees }: WeeklyTimelineProps) => {
  const {
    currentWeek,
    setCurrentWeek,
    selectedEntry,
    setSelectedEntry,
    timeEntries,
    employees,
    weekStart,
    workDays,
    displayDates,
    isWeekValidated,
    isMonthLocked,
    userRole,
    applyStandardWeek,
    validateWeek,
    lockMonth,
    unlockMonth,
    canEditEntry,
    saveTimeEntry
  } = useTimelineData(externalEmployees);

  console.log('Filtered employees for timeline:', employees);
  console.log('Current time entries:', timeEntries);

  return (
    <Card className="w-full">
      <CardHeader>
        <TimelineHeader
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          weekStart={weekStart}
          isWeekValidated={isWeekValidated}
          isMonthLocked={isMonthLocked}
          userRole={userRole}
          applyStandardWeek={applyStandardWeek}
          validateWeek={validateWeek}
          lockMonth={lockMonth}
          unlockMonth={unlockMonth}
        />
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
            <EmployeeRow
              key={employee.id}
              employee={employee}
              displayDates={displayDates}
              workDays={workDays}
              timeEntries={timeEntries}
              isWeekValidated={isWeekValidated}
              canEdit={canEditEntry()}
              onEntryClick={(employeeId, date) => setSelectedEntry({ employeeId, date })}
            />
          ))}
        </div>

        {selectedEntry && (
          <TimeEntryDialog
            employeeId={selectedEntry.employeeId}
            date={selectedEntry.date}
            existingEntry={timeEntries[selectedEntry.employeeId]?.find(e => e.date === selectedEntry.date)}
            isWeekValidated={isWeekValidated}
            onSave={saveTimeEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};
