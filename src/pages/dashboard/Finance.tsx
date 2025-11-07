import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ExpenseForm } from "@/components/finance/ExpenseForm";
import { ExpensesTable } from "@/components/finance/ExpensesTable";
import { FinancialStats } from "@/components/finance/FinancialStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  expense_date: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
}

interface Sale {
  total: number;
}

const Finance = () => {
  const [companyId, setCompanyId] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("expense_date", { ascending: false });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

      // Fetch sales for revenue calculation
      const { data: salesData, error: salesError } = await supabase
        .from("sales")
        .select("total")
        .eq("company_id", profile.company_id);

      if (salesError) throw salesError;
      setSales(salesData || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinancials = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return { totalRevenue, totalExpenses, profit, profitMargin };
  };

  const handleExpenseSuccess = () => {
    setShowExpenseForm(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const financials = calculateFinancials();

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
                  <h1 className="text-3xl font-bold">Finance</h1>
                  <p className="text-muted-foreground">Track expenses and monitor financial performance</p>
                </div>
              </div>

              <FinancialStats
                totalRevenue={financials.totalRevenue}
                totalExpenses={financials.totalExpenses}
                profit={financials.profit}
                profitMargin={financials.profitMargin}
              />

              <Tabs defaultValue="expenses" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Expense Management</CardTitle>
                          <CardDescription>Track and manage business expenses</CardDescription>
                        </div>
                        <Button onClick={() => setShowExpenseForm(!showExpenseForm)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Expense
                        </Button>
                      </div>
                    </CardHeader>
                    {showExpenseForm && (
                      <CardContent className="border-t pt-6">
                        <ExpenseForm
                          companyId={companyId}
                          onSuccess={handleExpenseSuccess}
                          onCancel={() => setShowExpenseForm(false)}
                        />
                      </CardContent>
                    )}
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Expenses</CardTitle>
                      <CardDescription>
                        {expenses.length} expense{expenses.length !== 1 ? "s" : ""} recorded
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ExpensesTable expenses={expenses} onExpenseDeleted={fetchData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Reports</CardTitle>
                      <CardDescription>Revenue and expense analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Revenue Breakdown</h3>
                            <p className="text-2xl font-bold text-green-600">
                              ${financials.totalRevenue.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">Total from {sales.length} sales</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Expense Breakdown</h3>
                            <p className="text-2xl font-bold text-red-600">
                              ${financials.totalExpenses.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total from {expenses.length} expenses
                            </p>
                          </div>
                        </div>
                      </div>
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

export default Finance;