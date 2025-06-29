
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  role: string;
  accessLevel: 'admin' | 'manager' | 'hr' | 'employee';
  initials: string;
  color: string;
  email?: string;
}

interface EmployeeManagementProps {
  employees?: Employee[];
  onEmployeesChange?: (employees: Employee[]) => void;
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

export const EmployeeManagement = ({ employees: externalEmployees, onEmployeesChange }: EmployeeManagementProps) => {
  const [employees, setEmployees] = useState<Employee[]>(externalEmployees || initialEmployees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    accessLevel: 'employee' as Employee['accessLevel']
  });

  // Sync with external employees if provided
  useEffect(() => {
    if (externalEmployees) {
      setEmployees(externalEmployees);
    }
  }, [externalEmployees]);

  // Update external state when employees change
  const updateEmployees = (newEmployees: Employee[]) => {
    console.log('EmployeeManagement - updating employees:', newEmployees);
    setEmployees(newEmployees);
    if (onEmployeesChange) {
      onEmployeesChange(newEmployees);
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'hr': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const generateColor = () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('EmployeeManagement - submitting form:', formData);
    
    if (editingEmployee) {
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData, initials: generateInitials(formData.name) }
          : emp
      );
      updateEmployees(updatedEmployees);
      setEditingEmployee(null);
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        initials: generateInitials(formData.name),
        color: generateColor()
      };
      const updatedEmployees = [...employees, newEmployee];
      updateEmployees(updatedEmployees);
    }
    
    setFormData({ name: '', role: '', email: '', accessLevel: 'employee' });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      email: employee.email || '',
      accessLevel: employee.accessLevel
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (employeeId: string) => {
    console.log('EmployeeManagement - deleting employee:', employeeId);
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    updateEmployees(updatedEmployees);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Employee Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select 
                    value={formData.accessLevel} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, accessLevel: value as Employee['accessLevel'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Line Manager</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin/Controller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingEmployee(null);
                    setFormData({ name: '', role: '', email: '', accessLevel: 'employee' });
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={`${employee.color} text-white font-semibold`}>
                    {employee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.role}</p>
                  {employee.email && (
                    <p className="text-sm text-gray-400">{employee.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge className={getAccessLevelColor(employee.accessLevel)}>
                  {employee.accessLevel.charAt(0).toUpperCase() + employee.accessLevel.slice(1)}
                </Badge>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
