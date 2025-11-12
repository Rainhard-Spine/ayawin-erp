import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import ReportsGenerator from "@/components/reports/ReportsGenerator";
import AuditLogViewer from "@/components/audit/AuditLogViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Reports & Audit</h1>
                <p className="text-muted-foreground">
                  Generate reports and review audit trails
                </p>
              </div>

              <Tabs defaultValue="reports" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="reports">Generate Reports</TabsTrigger>
                  <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                </TabsList>

                <TabsContent value="reports">
                  <ReportsGenerator />
                </TabsContent>

                <TabsContent value="audit">
                  <AuditLogViewer />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
