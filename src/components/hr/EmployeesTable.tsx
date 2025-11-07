import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Employee {
  id: string;
  employee_number: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  position: string;
  department: string | null;
  hire_date: string;
  employment_status: string;
  salary: number;
}

interface EmployeesTableProps {
  employees: Employee[];
}

export const EmployeesTable = ({ employees }: EmployeesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "on_leave":
        return "secondary";
      case "terminated":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No employees added yet
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(employee.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.full_name}</div>
                    <div className="text-sm text-muted-foreground">{employee.employee_number}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department || "-"}</TableCell>
              <TableCell>{formatDate(employee.hire_date)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(employee.employment_status)}>
                  {employee.employment_status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(employee.salary)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};