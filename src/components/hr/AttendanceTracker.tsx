import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceTrackerProps {
  companyId: string;
  employees: Array<{ id: string; full_name: string; employee_number: string }>;
  onAttendanceRecorded: () => void;
}

export const AttendanceTracker = ({ companyId, employees, onAttendanceRecorded }: AttendanceTrackerProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      checkTodayAttendance();
    }
  }, [selectedEmployee]);

  const checkTodayAttendance = async () => {
    if (!selectedEmployee) return;

    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", selectedEmployee)
      .eq("date", today)
      .maybeSingle();

    setTodayAttendance(data);
  };

  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const { error } = await supabase.from("attendance").insert({
        company_id: companyId,
        employee_id: selectedEmployee,
        check_in: now.toISOString(),
        date: today,
        status: "present",
      });

      if (error) throw error;

      toast.success("Checked in successfully");
      checkTodayAttendance();
      onAttendanceRecorded();
    } catch (error: any) {
      console.error("Error checking in:", error);
      toast.error(error.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("attendance")
        .update({ check_out: new Date().toISOString() })
        .eq("id", todayAttendance.id);

      if (error) throw error;

      toast.success("Checked out successfully");
      checkTodayAttendance();
      onAttendanceRecorded();
    } catch (error: any) {
      console.error("Error checking out:", error);
      toast.error(error.message || "Failed to check out");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Attendance Tracker
        </CardTitle>
        <CardDescription>Check in and check out employees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-muted/30 rounded-lg">
          <div className="text-4xl font-bold">{formatTime(currentTime)}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name} ({employee.employee_number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {todayAttendance && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Check In:</span>
              <span className="font-medium">
                {new Date(todayAttendance.check_in).toLocaleTimeString()}
              </span>
            </div>
            {todayAttendance.check_out && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Check Out:</span>
                <span className="font-medium">
                  {new Date(todayAttendance.check_out).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleCheckIn}
            disabled={loading || !selectedEmployee || !!todayAttendance}
            className="w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Check In
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={loading || !todayAttendance || !!todayAttendance?.check_out}
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Check Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};