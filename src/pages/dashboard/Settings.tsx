import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/settings/UserManagement";
import { PermissionsManagement } from "@/components/settings/PermissionsManagement";
import { CurrencySettings } from "@/components/settings/CurrencySettings";
import { DataExport } from "@/components/settings/DataExport";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="export">Data Export</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="permissions">
              <PermissionsManagement />
            </TabsContent>

            <TabsContent value="currency">
              <CurrencySettings />
            </TabsContent>

            <TabsContent value="export">
              <DataExport />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
