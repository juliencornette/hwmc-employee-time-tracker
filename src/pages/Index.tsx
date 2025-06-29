
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeklyTimeline } from '@/components/WeeklyTimeline';
import { EmployeeManagement } from '@/components/EmployeeManagement';
import { Dashboard } from '@/components/Dashboard';
import { Reports } from '@/components/Reports';
import { Calendar, Users, BarChart3, FileText } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  accessLevel: 'admin' | 'manager' | 'hr' | 'employee';
  initials: string;
  color: string;
  email?: string;
}

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

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  console.log('Index component - current employees:', employees);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Monaco Team Tracker</h1>
          <p className="text-lg text-gray-600">Employee time tracking and leave management system</p>
        </div>
        
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekly Timeline
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <WeeklyTimeline employees={employees} />
          </TabsContent>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeeManagement 
              employees={employees}
              onEmployeesChange={setEmployees}
            />
          </TabsContent>
          
          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
