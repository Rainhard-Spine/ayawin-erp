import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ModulePermission {
  id: string;
  role: string;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

const modules = [
  "inventory",
  "sales",
  "finance",
  "hr",
  "crm",
  "suppliers",
  "analytics",
  "settings",
];

const roles = ["company_admin", "manager", "user"] as const;

export const PermissionsManagement = () => {
  const queryClient = useQueryClient();

  const { data: permissions = [] } = useQuery({
    queryKey: ["module_permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_permissions")
        .select("*")
        .order("role", { ascending: true })
        .order("module", { ascending: true });
      
      if (error) throw error;
      return data as ModulePermission[];
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async ({
      role,
      module,
      permission,
      value,
    }: {
      role: string;
      module: string;
      permission: string;
      value: boolean;
    }) => {
      const existing = permissions.find(
        (p) => p.role === role && p.module === module
      );

      if (existing) {
        const { error } = await supabase
          .from("module_permissions")
          .update({ [permission]: value })
          .eq("id", existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("module_permissions")
          .insert([{ role: role as any, module, [permission]: value }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module_permissions"] });
      toast.success("Permission updated");
    },
    onError: () => {
      toast.error("Failed to update permission");
    },
  });

  const getPermission = (role: string, module: string, permission: string) => {
    const perm = permissions.find((p) => p.role === role && p.module === module);
    return perm?.[permission as keyof ModulePermission] || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Permissions</CardTitle>
        <CardDescription>
          Configure role-based access control for each module
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roles.map((role) => (
          <div key={role} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">{role}</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Edit</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module}>
                      <TableCell className="font-medium capitalize">
                        {module}
                      </TableCell>
                      {["can_view", "can_create", "can_edit", "can_delete"].map(
                        (permission) => (
                          <TableCell key={permission} className="text-center">
                            <Checkbox
                              checked={getPermission(role, module, permission) as boolean}
                              onCheckedChange={(checked) =>
                                updatePermissionMutation.mutate({
                                  role,
                                  module,
                                  permission,
                                  value: checked as boolean,
                                })
                              }
                            />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
