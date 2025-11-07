import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmployeeForm } from "@/components/hr/EmployeeForm";
import { EmployeesTable } from "@/components/hr/EmployeesTable";
import { AttendanceTracker } from "@/components/hr/AttendanceTracker";
import { LeaveRequestForm } from "@/components/hr/LeaveRequestForm";
import { LeaveRequestsTable } from "@/components/hr/LeaveRequestsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HR = () => {
  const [companyId, setCompanyId] = useState<string>("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile.company_id) throw new Error("No company associated");

      setCompanyId(profile.company_id);

      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false });

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

      // Fetch leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from("leave_requests")
        .select(`
          *,
          employees (
            full_name,
            employee_number
          )
        `)
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false });

      if (leaveError) throw leaveError;
      setLeaveRequests(leaveData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSuccess = () => {
    setShowEmployeeForm(false);
    fetchData();
  };

  const handleLeaveSuccess = () => {
    setShowLeaveForm(false);
    fetchData();
  };

  const calculateStats = () => {
    const activeEmployees = employees.filter(e => e.employment_status === "active").length;
    const pendingLeaves = leaveRequests.filter(r => r.status === "pending").length;
    const totalSalary = employees
      .filter(e => e.employment_status === "active")
      .reduce((sum, e) => sum + parseFloat(e.salary.toString()), 0);

    return { activeEmployees, pendingLeaves, totalSalary };
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const stats = calculateStats();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">HR & Attendance</h1>
                  <p className="text-muted-foreground">
                    Manage employees, track attendance, and handle payroll
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeEmployees}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Monthly Salary</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.totalSalary.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="employees" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="employees" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Employee Management</CardTitle>
                          <CardDescription>Manage your workforce</CardDescription>
                        </div>
                        <Button onClick={() => setShowEmployeeForm(!showEmployeeForm)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Employee
                        </Button>
                      </div>
                    </CardHeader>
                    {showEmployeeForm && (
                      <CardContent className="border-t pt-6">
                        <EmployeeForm
                          companyId={companyId}
                          onSuccess={handleEmployeeSuccess}
                          onCancel={() => setShowEmployeeForm(false)}
                        />
                      </CardContent>
                    )}
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Employees</CardTitle>
                      <CardDescription>
                        {employees.length} employee{employees.length !== 1 ? "s" : ""} registered
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EmployeesTable employees={employees} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <AttendanceTracker
                      companyId={companyId}
                      employees={employees}
                      onAttendanceRecorded={fetchData}
                    />
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Attendance</CardTitle>
                        <CardDescription>Overview of today's attendance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                          Attendance summary will appear here
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="leaves" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Leave Management</CardTitle>
                          <CardDescription>Manage employee leave requests</CardDescription>
                        </div>
                        <Button onClick={() => setShowLeaveForm(!showLeaveForm)}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Request
                        </Button>
                      </div>
                    </CardHeader>
                    {showLeaveForm && (
                      <CardContent className="border-t pt-6">
                        <LeaveRequestForm
                          companyId={companyId}
                          employees={employees}
                          onSuccess={handleLeaveSuccess}
                          onCancel={() => setShowLeaveForm(false)}
                        />
                      </CardContent>
                    )}
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Requests</CardTitle>
                      <CardDescription>
                        {leaveRequests.length} request{leaveRequests.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LeaveRequestsTable
                        leaveRequests={leaveRequests}
                        onStatusChanged={fetchData}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HR;