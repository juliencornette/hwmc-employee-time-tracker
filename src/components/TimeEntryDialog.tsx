
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  dayType: 'standard' | 'dayoff' | 'sick' | 'overtime' | 'holiday';
  approved: boolean;
}

interface TimeEntryDialogProps {
  employeeId: string;
  date: string;
  existingEntry?: TimeEntry;
  onSave: (entry: TimeEntry) => void;
  onClose: () => void;
}

export const TimeEntryDialog = ({ employeeId, date, existingEntry, onSave, onClose }: TimeEntryDialogProps) => {
  const [startTime, setStartTime] = useState(existingEntry?.startTime || '10:00');
  const [endTime, setEndTime] = useState(existingEntry?.endTime || '18:00');
  const [dayType, setDayType] = useState(existingEntry?.dayType || 'standard');

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const hours = dayType === 'dayoff' || dayType === 'sick' || dayType === 'holiday' ? 0 : calculateHours(startTime, endTime);

  const handleSave = () => {
    const entry: TimeEntry = {
      id: existingEntry?.id || `${employeeId}-${date}`,
      date,
      startTime: dayType === 'dayoff' || dayType === 'sick' || dayType === 'holiday' ? '' : startTime,
      endTime: dayType === 'dayoff' || dayType === 'sick' || dayType === 'holiday' ? '' : endTime,
      hours,
      dayType,
      approved: false,
    };
    onSave(entry);
  };

  const handleDayTypeChange = (value: string) => {
    setDayType(value as 'standard' | 'dayoff' | 'sick' | 'overtime' | 'holiday');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Time Entry - {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dayType">Day Type</Label>
            <Select value={dayType} onValueChange={handleDayTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Workday</SelectItem>
                <SelectItem value="dayoff">Day Off (Personal Leave)</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="overtime">Overtime Day</SelectItem>
                <SelectItem value="holiday">Public Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dayType !== 'dayoff' && dayType !== 'sick' && dayType !== 'holiday' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Hours: {hours.toFixed(1)}h</div>
                {dayType === 'standard' && (
                  <div className={`text-sm font-medium ${hours > 8 ? 'text-orange-600' : hours < 8 ? 'text-blue-600' : 'text-green-600'}`}>
                    {hours > 8 ? `+${(hours - 8).toFixed(1)}h extra` :
                     hours < 8 ? `${(hours - 8).toFixed(1)}h short` : 'Standard 8h day'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
