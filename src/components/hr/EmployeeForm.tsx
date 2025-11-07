import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmployeeFormProps {
  companyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DEPARTMENTS = ["Sales", "Operations", "Finance", "HR", "IT", "Marketing", "Other"];
const SALARY_TYPES = ["hourly", "daily", "weekly", "monthly", "yearly"];
const EMPLOYMENT_STATUS = ["active", "on_leave", "terminated"];

export const EmployeeForm = ({ companyId, onSuccess, onCancel }: EmployeeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_number: "",
    full_name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hire_date: new Date().toISOString().split("T")[0],
    employment_status: "active",
    salary: "",
    salary_type: "monthly",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_number || !formData.full_name || !formData.position || !formData.hire_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("employees").insert({
        company_id: companyId,
        employee_number: formData.employee_number,
        full_name: formData.full_name,
        email: formData.email || null,
        phone: formData.phone || null,
        position: formData.position,
        department: formData.department || null,
        hire_date: formData.hire_date,
        employment_status: formData.employment_status,
        salary: formData.salary ? parseFloat(formData.salary) : 0,
        salary_type: formData.salary_type,
        address: formData.address || null,
      });

      if (error) throw error;

      toast.success("Employee added successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast.error(error.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employee_number">Employee Number *</Label>
          <Input
            id="employee_number"
            value={formData.employee_number}
            onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
            placeholder="EMP-001"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Sales Manager"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hire_date">Hire Date *</Label>
          <Input
            id="hire_date"
            type="date"
            value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employment_status">Employment Status</Label>
          <Select
            value={formData.employment_status}
            onValueChange={(value) => setFormData({ ...formData, employment_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_STATUS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            type="number"
            step="0.01"
            min="0"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_type">Salary Type</Label>
          <Select
            value={formData.salary_type}
            onValueChange={(value) => setFormData({ ...formData, salary_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SALARY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="123 Main St, City"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};