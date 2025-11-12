import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileDown, FileSpreadsheet, FileText, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { value: "sales", label: "Sales Report", icon: TrendingUp, description: "Analyze sales performance by period" },
    { value: "inventory", label: "Inventory Report", icon: Package, description: "Stock levels, turnover, and reorder points" },
    { value: "finance", label: "Financial Report", icon: DollarSign, description: "P&L, expenses, and revenue analysis" },
    { value: "hr", label: "HR Report", icon: Users, description: "Employee attendance, payroll, and leave summary" },
  ];

  const generateReport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportType || !dateFrom || !dateTo) {
      toast.error("Please select report type and date range");
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.company_id) {
        throw new Error("Company not found");
      }

      // Fetch data based on report type
      let reportData;
      switch (reportType) {
        case 'sales':
          const { data: salesData } = await supabase
            .from('sales')
            .select('*, sale_items(*)')
            .eq('company_id', profile.company_id)
            .gte('created_at', dateFrom)
            .lte('created_at', dateTo);
          reportData = salesData;
          break;
        case 'inventory':
          const { data: inventoryData } = await supabase
            .from('products')
            .select('*')
            .eq('company_id', profile.company_id);
          reportData = inventoryData;
          break;
        case 'finance':
          const { data: expensesData } = await supabase
            .from('expenses')
            .select('*')
            .eq('company_id', profile.company_id)
            .gte('expense_date', dateFrom)
            .lte('expense_date', dateTo);
          reportData = expensesData;
          break;
        case 'hr':
          const { data: attendanceData } = await supabase
            .from('attendance')
            .select('*, employees(*)')
            .eq('company_id', profile.company_id)
            .gte('date', dateFrom)
            .lte('date', dateTo);
          reportData = attendanceData;
          break;
      }

      // Convert to desired format
      if (format === 'csv') {
        downloadCSV(reportData, `${reportType}-report-${dateFrom}-to-${dateTo}`);
      } else if (format === 'excel') {
        toast.info("Excel export coming soon!");
      } else {
        toast.info("PDF export coming soon!");
      }

      toast.success(`${reportType} report generated successfully`);
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error("No data available for the selected period");
      return;
    }

    const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Create detailed reports for analysis and export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all hover:border-primary ${
                  reportType === type.value ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setReportType(type.value)}
              >
                <CardHeader>
                  <type.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">{type.label}</CardTitle>
                  <CardDescription className="text-xs">{type.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => generateReport('csv')}
              disabled={loading || !reportType}
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => generateReport('excel')}
              disabled={loading || !reportType}
              variant="outline"
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              onClick={() => generateReport('pdf')}
              disabled={loading || !reportType}
              variant="outline"
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsGenerator;
