import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { TimeEntry } from '@/types/timeline';
import { getDayTypeColor, formatTimeRange, getHoursDifference } from '@/utils/timelineUtils';

interface TimeEntryCellProps {
  entry?: TimeEntry;
  onEntryClick: () => void;
  canEdit: boolean;
  isWeekValidated: boolean;
}

export const TimeEntryCell = ({ entry, onEntryClick, canEdit, isWeekValidated }: TimeEntryCellProps) => {
  if (!entry) {
    return (
      <Button
        variant="outline"
        className="w-full h-24 border-dashed border-2 hover:border-solid"
        onClick={onEntryClick}
        disabled={!canEdit}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Entry
      </Button>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getDayTypeColor(entry.dayType, entry.hours, entry.isActual, isWeekValidated)}`}
      onClick={canEdit ? onEntryClick : undefined}
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
  );
};