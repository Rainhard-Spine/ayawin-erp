import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  created_at: string;
  employees: {
    full_name: string;
    employee_number: string;
  };
}

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  onStatusChanged: () => void;
}

export const LeaveRequestsTable = ({ leaveRequests, onStatusChanged }: LeaveRequestsTableProps) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    setUpdating(requestId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: newStatus,
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      toast.success(`Leave request ${newStatus}`);
      onStatusChanged();
    } catch (error: any) {
      console.error("Error updating leave request:", error);
      toast.error(error.message || "Failed to update leave request");
    } finally {
      setUpdating(null);
    }
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
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (leaveRequests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No leave requests found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{request.employees.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {request.employees.employee_number}
                  </div>
                </div>
              </TableCell>
              <TableCell>{request.leave_type}</TableCell>
              <TableCell>{formatDate(request.start_date)}</TableCell>
              <TableCell>{formatDate(request.end_date)}</TableCell>
              <TableCell>{calculateDays(request.start_date, request.end_date)} days</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(request.status)}>
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, "approved")}
                      disabled={updating === request.id}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(request.id, "rejected")}
                      disabled={updating === request.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};