import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shield, Search, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  table_name: string;
  action: string;
  user_id: string | null;
  created_at: string;
  changed_fields: string[];
}

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTable, setFilterTable] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.company_id) return;

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      INSERT: "default",
      UPDATE: "secondary",
      DELETE: "destructive"
    };
    return <Badge variant={variants[action] || "default"}>{action}</Badge>;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTable = filterTable === "all" || log.table_name === filterTable;
    const matchesAction = filterAction === "all" || log.action === filterAction;
    return matchesSearch && matchesTable && matchesAction;
  });

  const uniqueTables = [...new Set(logs.map(log => log.table_name))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Audit Trail</CardTitle>
        </div>
        <CardDescription>
          Track all changes made to your data for compliance and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterTable} onValueChange={setFilterTable}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tables</SelectItem>
              {uniqueTables.map(table => (
                <SelectItem key={table} value={table}>{table}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="INSERT">INSERT</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Changed Fields</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading audit logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell>System</TableCell>
                    <TableCell className="font-medium">{log.table_name}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      {log.changed_fields && log.changed_fields.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {log.changed_fields.slice(0, 3).map((field, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {log.changed_fields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{log.changed_fields.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
