
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Calendar, TrendingUp, Users } from 'lucide-react';

const employees = [
  { 
    id: '1', 
    name: 'Federica Beretta', 
    role: 'Director', 
    initials: 'FB', 
    color: 'bg-blue-500',
    weeklyHours: 38,
    monthlyExtra: -2,
    extraToRecuperate: 5,
    daysOffRemaining: 22
  },
  { 
    id: '2', 
    name: 'Julien Cornette', 
    role: 'Sales Assistant', 
    initials: 'JC', 
    color: 'bg-green-500',
    weeklyHours: 42,
    monthlyExtra: 2,
    extraToRecuperate: 0,
    daysOffRemaining: 18
  },
  { 
    id: '3', 
    name: 'Eva Dmitrenko', 
    role: 'Gallery Assistant', 
    initials: 'ED', 
    color: 'bg-purple-500',
    weeklyHours: 35,
    monthlyExtra: -4,
    extraToRecuperate: 12,
    daysOffRemaining: 25
  },
];

export const Dashboard = () => {
  const totalEmployees = employees.length;
  const avgWeeklyHours = employees.reduce((sum, emp) => sum + emp.weeklyHours, 0) / totalEmployees;
  const totalExtraHours = employees.reduce((sum, emp) => sum + Math.max(0, emp.monthlyExtra), 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgWeeklyHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Target: 40h</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extra Hours This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExtraHours}h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Time entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${employee.color} text-white font-semibold`}>
                    {employee.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Weekly Hours</div>
                      <div className="text-xl font-bold">{employee.weeklyHours}h</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Weekly Progress</span>
                        <span className="text-sm font-medium">{employee.weeklyHours}/40h</span>
                      </div>
                      <Progress value={(employee.weeklyHours / 40) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Extra</span>
                      <Badge variant={employee.monthlyExtra >= 0 ? "default" : "secondary"}>
                        {employee.monthlyExtra >= 0 ? `+${employee.monthlyExtra}h` : `${employee.monthlyExtra}h`}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Days Off Remaining</span>
                      <Badge variant="outline">
                        {employee.daysOffRemaining} days
                      </Badge>
                    </div>
                  </div>
                  
                  {employee.extraToRecuperate > 0 && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Hours to Recuperate</span>
                      <Badge variant="secondary">
                        {employee.extraToRecuperate}h available
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
