import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Wallet, 
  Users, 
  FileText,
  Settings,
  ClipboardList
} from "lucide-react";

const screenshots = [
  {
    id: "dashboard",
    title: "Analytics Dashboard",
    description: "Real-time KPIs, sales metrics, and business insights at a glance",
    icon: BarChart3,
    color: "from-primary to-accent",
    features: ["Live sales tracking", "Revenue analytics", "Inventory alerts", "Performance metrics"]
  },
  {
    id: "inventory",
    title: "Inventory Management",
    description: "Complete stock control with multi-warehouse support",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
    features: ["Product catalog", "Stock tracking", "Barcode scanning", "Low stock alerts"]
  },
  {
    id: "pos",
    title: "Point of Sale",
    description: "Fast, intuitive POS system for seamless transactions",
    icon: ShoppingCart,
    color: "from-green-500 to-emerald-500",
    features: ["Quick checkout", "Multiple payments", "Receipt printing", "Customer lookup"]
  },
  {
    id: "finance",
    title: "Finance & Accounting",
    description: "Track expenses, revenue, and generate financial reports",
    icon: Wallet,
    color: "from-purple-500 to-violet-500",
    features: ["Expense tracking", "Profit/Loss", "Financial reports", "Multi-currency"]
  },
  {
    id: "crm",
    title: "Customer Management",
    description: "Build lasting relationships with complete CRM tools",
    icon: Users,
    color: "from-orange-500 to-amber-500",
    features: ["Customer profiles", "Deal tracking", "Communication logs", "Sales pipeline"]
  },
  {
    id: "hr",
    title: "HR & Payroll",
    description: "Manage employees, attendance, and payroll processing",
    icon: ClipboardList,
    color: "from-pink-500 to-rose-500",
    features: ["Employee records", "Attendance tracking", "Leave management", "Payroll processing"]
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    description: "Generate comprehensive business reports and audit trails",
    icon: FileText,
    color: "from-indigo-500 to-blue-500",
    features: ["Sales reports", "Inventory reports", "Audit logs", "Export to PDF"]
  },
  {
    id: "settings",
    title: "Settings & Admin",
    description: "Configure your system with powerful admin tools",
    icon: Settings,
    color: "from-slate-500 to-gray-500",
    features: ["User management", "Role permissions", "Company profile", "Data export"]
  }
];

const Screenshots = () => {
  const [activeModule, setActiveModule] = useState(screenshots[0]);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30" id="demo">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
            Live Demo Preview
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            See The System
            <span className="block text-primary mt-2">In Action</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive ERP modules designed for modern businesses. 
            This is a fully functional demo - try it yourself!
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Module Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {screenshots.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeModule.id === module.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <module.icon className="h-4 w-4" />
                {module.title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Feature Display */}
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Module Info */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeModule.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <activeModule.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {activeModule.title}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    {activeModule.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {activeModule.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshot Preview */}
                <div className={`bg-gradient-to-br ${activeModule.color} p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
                  </div>
                  
                  {/* Mock Dashboard UI */}
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="h-4 bg-white/30 rounded w-3/4" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 bg-white/20 rounded-lg" />
                        <div className="h-20 bg-white/20 rounded-lg" />
                      </div>
                      <div className="h-32 bg-white/20 rounded-lg" />
                      <div className="flex gap-2">
                        <div className="h-8 bg-white/30 rounded flex-1" />
                        <div className="h-8 bg-white/30 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Ready to explore? Try our live demo with full functionality
            </p>
            <a 
              href="/auth" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Live Demo
              <span className="text-xs opacity-75">(No credit card required)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
