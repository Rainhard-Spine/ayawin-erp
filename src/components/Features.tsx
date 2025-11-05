import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Wallet, 
  Users, 
  Building2,
  FileText,
  Clock,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive dashboards with live KPIs, sales reports, and business insights at your fingertips."
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Multi-warehouse support with batch tracking, expiry alerts, barcode scanning, and stock transfers."
  },
  {
    icon: ShoppingCart,
    title: "Point of Sale",
    description: "Fast and intuitive POS system with invoice generation, receipt printing, and payment processing."
  },
  {
    icon: Wallet,
    title: "Finance & Accounting",
    description: "Complete accounting ledger, expense tracking, profit & loss reports, and financial analytics."
  },
  {
    icon: Users,
    title: "Customer & Supplier CRM",
    description: "Manage relationships with full purchase and sales history tracking for better business decisions."
  },
  {
    icon: Building2,
    title: "Multi-tenant Architecture",
    description: "Secure data isolation for each company with support for multiple branches and locations."
  },
  {
    icon: FileText,
    title: "Purchase Management",
    description: "Streamline procurement with supplier orders, goods received notes, and purchase approvals."
  },
  {
    icon: Clock,
    title: "HR & Attendance",
    description: "Employee records, clock-in/out tracking, attendance monitoring, and integrated payroll system."
  },
  {
    icon: Shield,
    title: "Role-based Security",
    description: "Granular permissions system with admin, manager, and cashier roles for secure access control."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything Your Business Needs
            <span className="block text-primary mt-2">In One Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful ERP modules designed to streamline operations and accelerate growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-card"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;