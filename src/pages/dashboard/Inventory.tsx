import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/inventory/ProductForm";
import { ProductsTable } from "@/components/inventory/ProductsTable";

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyAndProducts();
  }, []);

  const fetchCompanyAndProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (profile?.company_id) {
        setCompanyId(profile.company_id);
        await fetchProducts();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const lowStockCount = products.filter(
    (p) => p.quantity <= (p.min_stock_level || 0) && p.quantity > 0
  ).length;

  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

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
                <Button
                  className="bg-gradient-to-r from-primary to-accent"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{lowStockCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{outOfStockCount}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product List</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading products...</p>
                    </div>
                  ) : (
                    <ProductsTable
                      products={products}
                      companyId={companyId}
                      onRefresh={fetchProducts}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <ProductForm
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchProducts}
        companyId={companyId}
      />
    </SidebarProvider>
  );
};

export default Inventory;