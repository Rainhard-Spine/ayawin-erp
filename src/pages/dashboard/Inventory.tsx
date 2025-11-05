import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";

const Inventory = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Package className="h-8 w-8 text-primary" />
                    Inventory Management
                  </h1>
                  <p className="text-muted-foreground">Manage your products and stock levels</p>
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No products yet. Start by adding your first product!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Inventory;