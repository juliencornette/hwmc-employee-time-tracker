import { format } from 'date-fns';
import { TimeEntry } from '@/types/timeline';

export const getDayTypeColor = (dayType: string, hours: number, isActual?: boolean, isValidated?: boolean) => {
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

export const formatTimeRange = (entry: TimeEntry) => {
  if (entry.dayType === 'dayoff') return 'Day Off';
  if (entry.dayType === 'sick') return 'Sick Leave';
  if (entry.dayType === 'holiday') return 'Holiday';
  return `${entry.startTime} - ${entry.endTime}`;
};

export const getHoursDifference = (hours: number, dayType: string) => {
  if (dayType !== 'standard') return '';
  const diff = hours - 8;
  if (diff > 0) return `+${diff}h`;
  if (diff < 0) return `${diff}h`;
  return '';
};

export const getEntryForDate = (timeEntries: Record<string, TimeEntry[]>, employeeId: string, date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return timeEntries[employeeId]?.find(entry => entry.date === dateStr);
};

export const getWeeklyTotal = (timeEntries: Record<string, TimeEntry[]>, employeeId: string, workDays: Date[]) => {
  const total = workDays.reduce((sum, date) => {
    const entry = getEntryForDate(timeEntries, employeeId, date);
    return sum + (entry?.hours || 0);
  }, 0);
  return total;
};