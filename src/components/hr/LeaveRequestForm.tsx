import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeaveRequestFormProps {
  companyId: string;
  employees: Array<{ id: string; full_name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const LEAVE_TYPES = ["Vacation", "Sick Leave", "Personal", "Emergency", "Unpaid"];

export const LeaveRequestForm = ({ companyId, employees, onSuccess, onCancel }: LeaveRequestFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.leave_type || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("leave_requests").insert({
        company_id: companyId,
        employee_id: formData.employee_id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Leave request submitted successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting leave request:", error);
      toast.error(error.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employee_id">Employee *</Label>
          <Select
            value={formData.employee_id}
            onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="leave_type">Leave Type *</Label>
          <Select
            value={formData.leave_type}
            onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Reason for leave request"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
};