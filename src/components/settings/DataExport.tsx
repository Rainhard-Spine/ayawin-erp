import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Database } from "lucide-react";
import { toast } from "sonner";

const exportableModules = [
  { value: "products", label: "Inventory" },
  { value: "sales", label: "Sales" },
  { value: "expenses", label: "Expenses" },
  { value: "employees", label: "Employees" },
  { value: "customers", label: "Customers" },
  { value: "suppliers", label: "Suppliers" },
];

export const DataExport = () => {
  const [selectedModule, setSelectedModule] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (tableName: string) => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("company_id", profile?.company_id);
      
      if (error) throw error;
      return data as any[];
    },
    onSuccess: (data, tableName) => {
      // Convert to CSV
      if (data.length === 0) {
        toast.info("No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((header) => JSON.stringify(row[header] || "")).join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableName}-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Data exported successfully");
    },
    onError: () => {
      toast.error("Failed to export data");
    },
  });

  const handleExport = () => {
    if (!selectedModule) {
      toast.error("Please select a module to export");
      return;
    }
    exportMutation.mutate(selectedModule);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
        <CardDescription>
          Export your data to CSV files for backup or analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select module to export" />
            </SelectTrigger>
            <SelectContent>
              {exportableModules.map((module) => (
                <SelectItem key={module.value} value={module.value}>
                  {module.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} disabled={exportMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
            {exportMutation.isPending ? "Exporting..." : "Export to CSV"}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Backup
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            For complete database backups, use your backend dashboard to create full snapshots.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
