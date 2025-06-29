
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockReportData = [
  {
    employee: 'Federica Beretta',
    totalWorked: 168,
    standardExpected: 176,
    extraHours: -8,
    daysOffTaken: 2,
    daysOffEarned: 2.5,
    remainingBalance: 20.5
  },
  {
    employee: 'Julien Cornette',
    totalWorked: 184,
    standardExpected: 176,
    extraHours: 8,
    daysOffTaken: 1,
    daysOffEarned: 2.5,
    remainingBalance: 19.5
  },
  {
    employee: 'Eva Dmitrenko',
    totalWorked: 160,
    standardExpected: 176,
    extraHours: -16,
    daysOffTaken: 3,
    daysOffEarned: 2.5,
    remainingBalance: 22.5
  }
];

export const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState('december');
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleExportExcel = () => {
    // This would generate and download an Excel file
    console.log('Exporting Excel report for', selectedMonth, selectedYear);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Monthly Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleExportExcel} className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Employee</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Hours Worked</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Expected Hours</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Extra/Missing</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Days Off Taken</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Days Off Earned</th>
                  <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody>
                {mockReportData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">
                      {row.employee}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {row.totalWorked}h
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {row.standardExpected}h
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <Badge variant={row.extraHours >= 0 ? "default" : "secondary"}>
                        {row.extraHours >= 0 ? `+${row.extraHours}h` : `${row.extraHours}h`}
                      </Badge>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {row.daysOffTaken} days
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      {row.daysOffEarned} days
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-center">
                      <Badge variant="outline">
                        {row.remainingBalance} days
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Monthly Cycle</h3>
              <p className="text-sm text-gray-600">
                Reports run from the 21st of one month to the 20th of the next month, 
                matching Monaco's standard payroll cycle.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Excel Export</h3>
              <p className="text-sm text-gray-600">
                Complete breakdown including daily entries, overtime calculations, 
                and leave balance tracking for HR processing.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Public Holidays</h3>
              <p className="text-sm text-gray-600">
                Monaco public holidays are automatically included and excluded 
                from standard hour calculations.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Validation Status</h3>
              <p className="text-sm text-gray-600">
                Only approved time entries are included in final reports, 
                ensuring accuracy for payroll processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
