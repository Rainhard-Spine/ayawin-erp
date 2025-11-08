import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function Analytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user.id)
        .single();

      if (!profile?.company_id) return;

      // Fetch sales data for last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: sales } = await supabase
        .from("sales")
        .select("*")
        .eq("company_id", profile.company_id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      // Fetch expenses data
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("company_id", profile.company_id)
        .gte("expense_date", format(thirtyDaysAgo, "yyyy-MM-dd"))
        .order("expense_date", { ascending: true });

      // Fetch product performance
      const { data: products } = await supabase
        .from("products")
        .select("name, quantity, price")
        .eq("company_id", profile.company_id)
        .eq("is_active", true)
        .order("quantity", { ascending: false })
        .limit(10);

      // Fetch employee stats
      const { data: employees } = await supabase
        .from("employees")
        .select("department, employment_status")
        .eq("company_id", profile.company_id);

      // Process sales data by day
      const salesByDay = sales?.reduce((acc: any, sale: any) => {
        const day = format(new Date(sale.created_at), "MMM dd");
        if (!acc[day]) {
          acc[day] = { date: day, revenue: 0, count: 0 };
        }
        acc[day].revenue += Number(sale.total);
        acc[day].count += 1;
        return acc;
      }, {});

      setSalesData(Object.values(salesByDay || {}));

      // Process expenses by category
      const expensesByCategory = expenses?.reduce((acc: any, expense: any) => {
        const category = expense.category || "Other";
        if (!acc[category]) {
          acc[category] = { name: category, value: 0 };
        }
        acc[category].value += Number(expense.amount);
        return acc;
      }, {});

      setExpenseData(Object.values(expensesByCategory || {}));

      // Process product inventory
      setProductData(
        products?.map((p: any) => ({
          name: p.name,
          stock: p.quantity,
          value: Number(p.price) * p.quantity,
        })) || []
      );

      // Process employee stats by department
      const employeeByDept = employees?.reduce((acc: any, emp: any) => {
        const dept = emp.department || "Unassigned";
        if (!acc[dept]) {
          acc[dept] = { name: dept, active: 0, total: 0 };
        }
        acc[dept].total += 1;
        if (emp.employment_status === "active") {
          acc[dept].active += 1;
        }
        return acc;
      }, {});

      setEmployeeStats(Object.values(employeeByDept || {}));
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

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    count: {
      label: "Sales Count",
      color: "hsl(var(--chart-2))",
    },
    stock: {
      label: "Stock Level",
      color: "hsl(var(--chart-3))",
    },
    value: {
      label: "Value",
      color: "hsl(var(--chart-4))",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-1))",
    },
    total: {
      label: "Total",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Visual insights into your business performance</p>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="hr">HR</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend (Last 30 Days)
                </CardTitle>
                <CardDescription>Daily revenue and transaction count</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" name="Revenue ($)" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="count" stroke="hsl(var(--chart-2))" name="Sales Count" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sales Volume
                </CardTitle>
                <CardDescription>Revenue by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of expenses across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="hsl(var(--chart-1))"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Levels
                </CardTitle>
                <CardDescription>Top 10 products by quantity</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="stock" fill="hsl(var(--chart-3))" name="Stock" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Value</CardTitle>
                <CardDescription>Stock value by product</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(var(--chart-4))" name="Value ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employees by Department
              </CardTitle>
              <CardDescription>Active vs total employees per department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="active" fill="hsl(var(--chart-1))" name="Active" />
                    <Bar dataKey="total" fill="hsl(var(--chart-2))" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
