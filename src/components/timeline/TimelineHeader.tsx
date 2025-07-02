import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Check, Lock, Shield } from 'lucide-react';
import { format, addWeeks, subWeeks, addDays } from 'date-fns';

interface TimelineHeaderProps {
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  weekStart: Date;
  isWeekValidated: boolean;
  isMonthLocked: boolean;
  userRole: 'admin' | 'manager' | 'hr';
  applyStandardWeek: () => void;
  validateWeek: () => void;
  lockMonth: () => void;
  unlockMonth: () => void;
}

export const TimelineHeader = ({
  currentWeek,
  setCurrentWeek,
  weekStart,
  isWeekValidated,
  isMonthLocked,
  userRole,
  applyStandardWeek,
  validateWeek,
  lockMonth,
  unlockMonth
}: TimelineHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Weekly Timeline</h2>
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
  );
};