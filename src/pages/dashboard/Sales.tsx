import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Receipt, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductSelector } from "@/components/pos/ProductSelector";
import { CartPanel } from "@/components/pos/CartPanel";
import { CheckoutDialog } from "@/components/pos/CheckoutDialog";
import { format } from "date-fns";

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  availableQuantity: number;
}

const Sales = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [stats, setStats] = useState({ total: 0, today: 0, count: 0 });
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyAndSales();
  }, []);

  const fetchCompanyAndSales = async () => {
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
        await fetchSales();
        await calculateStats();
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const fetchSales = async () => {
    const { data } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) setSales(data);
  };

  const calculateStats = async () => {
    const today = new Date().toISOString().split("T")[0];
    
    const { data: allSales } = await supabase
      .from("sales")
      .select("total, created_at");

    if (allSales) {
      const total = allSales.reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);
      const todaySales = allSales.filter(sale => 
        sale.created_at.startsWith(today)
      ).reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);

      setStats({
        total,
        today: todaySales,
        count: allSales.length,
      });
    }
  };

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        toast({ title: "Not enough stock", variant: "destructive" });
      }
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          availableQuantity: product.quantity,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = async (checkoutData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const { data: saleNumberData } = await supabase.rpc("generate_sale_number", {
        company_uuid: companyId,
      });

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          company_id: companyId,
          sale_number: saleNumberData,
          customer_name: checkoutData.customer_name || null,
          customer_phone: checkoutData.customer_phone || null,
          customer_email: checkoutData.customer_email || null,
          subtotal,
          tax,
          discount: 0,
          total,
          payment_method: checkoutData.payment_method,
          notes: checkoutData.notes || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = cartItems.map((item) => ({
        sale_id: sale.id,
        product_id: item.id,
        product_name: item.name,
        product_sku: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase.from("sale_items").insert(saleItems);

      if (itemsError) throw itemsError;

      toast({ title: "Sale completed successfully!" });
      setCartItems([]);
      fetchSales();
      calculateStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

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
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    Sales & POS
                  </h1>
                  <p className="text-muted-foreground">Manage sales and point of sale</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.total.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.today.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.count}</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="pos" className="w-full">
                <TabsList>
                  <TabsTrigger value="pos">Point of Sale</TabsTrigger>
                  <TabsTrigger value="history">Transaction History</TabsTrigger>
                </TabsList>

                <TabsContent value="pos" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ProductSelector onAddToCart={addToCart} />
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <CartPanel
                        items={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={() => setShowCheckout(true)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sale #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell className="font-mono text-sm">
                                {sale.sale_number}
                              </TableCell>
                              <TableCell>
                                {format(new Date(sale.created_at), "MMM dd, yyyy HH:mm")}
                              </TableCell>
                              <TableCell>{sale.customer_name || "Walk-in"}</TableCell>
                              <TableCell className="capitalize">{sale.payment_method}</TableCell>
                              <TableCell className="text-right font-medium">
                                ${parseFloat(sale.total).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge>{sale.payment_status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        onComplete={handleCheckout}
        total={total}
      />
    </SidebarProvider>
  );
};

export default Sales;
