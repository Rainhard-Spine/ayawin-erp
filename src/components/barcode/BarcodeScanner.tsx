import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Search, X } from "lucide-react";
import { toast } from "sonner";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  const startCameraScan = async () => {
    toast.info("Camera scanning feature coming soon! Please use manual entry for now.");
    // TODO: Implement camera-based barcode scanning
    // Will require installing @zxing/browser or similar library
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barcode Scanner</CardTitle>
        <CardDescription>
          Scan product barcodes or enter manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={startCameraScan}
            disabled={scanning}
            variant="outline"
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Scan with Camera
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or enter manually
            </span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            placeholder="Enter barcode number..."
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!manualBarcode.trim()}>
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <p className="text-sm text-muted-foreground">
          Note: Camera scanning requires HTTPS and browser permissions.
        </p>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
