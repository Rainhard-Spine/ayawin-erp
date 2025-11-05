import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Wallet, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      change: "+20.1%",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Inventory Value",
      value: "$128,940",
      change: "+5.4%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Revenue",
      value: "$89,420",
      change: "+12.3%",
      icon: Wallet,
      color: "text-purple-600",
    },
    {
      title: "Active Customers",
      value: "2,345",
      change: "+8.7%",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your Ayawin ERP dashboard</p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                      <Package className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-semibold">Add Product</h3>
                      <p className="text-sm text-muted-foreground">Add new items to inventory</p>
                    </button>
                    <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                      <ShoppingCart className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-semibold">New Sale</h3>
                      <p className="text-sm text-muted-foreground">Process a new transaction</p>
                    </button>
                    <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                      <Users className="h-6 w-6 text-primary mb-2" />
                      <h3 className="font-semibold">Add Customer</h3>
                      <p className="text-sm text-muted-foreground">Register new customer</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New sale recorded</p>
                        <p className="text-xs text-muted-foreground">Invoice #INV-001 - $1,234.00</p>
                      </div>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Stock updated</p>
                        <p className="text-xs text-muted-foreground">45 items added to warehouse A</p>
                      </div>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New customer registered</p>
                        <p className="text-xs text-muted-foreground">Acme Corporation</p>
                      </div>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
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

export default Dashboard;