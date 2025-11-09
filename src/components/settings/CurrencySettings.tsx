import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_active: boolean;
}

export const CurrencySettings = () => {
  const queryClient = useQueryClient();

  const { data: currencies = [] } = useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("currencies")
        .select("*")
        .order("code", { ascending: true });
      
      if (error) throw error;
      return data as Currency[];
    },
  });

  const updateExchangeRateMutation = useMutation({
    mutationFn: async ({ code, rate }: { code: string; rate: number }) => {
      const { error } = await supabase
        .from("currencies")
        .update({ exchange_rate: rate })
        .eq("code", code);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
      toast.success("Exchange rate updated");
    },
    onError: () => {
      toast.error("Failed to update exchange rate");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Settings</CardTitle>
        <CardDescription>
          Manage currencies and exchange rates for multi-currency support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate (to USD)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="font-medium">{currency.code}</TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>{currency.symbol}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={currency.exchange_rate}
                        className="w-32"
                        onBlur={(e) => {
                          const newRate = parseFloat(e.target.value);
                          if (newRate !== currency.exchange_rate) {
                            updateExchangeRateMutation.mutate({
                              code: currency.code,
                              rate: newRate,
                            });
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateExchangeRateMutation.mutate({
                          code: currency.code,
                          rate: currency.exchange_rate,
                        })
                      }
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
