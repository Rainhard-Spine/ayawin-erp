import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Package, Users, Wallet } from "lucide-react";
import ayawinLogo from "@/assets/ayawin-logo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <img 
              src={ayawinLogo} 
              alt="Ayawin Stock Solutions" 
              className="h-24 md:h-32 object-contain drop-shadow-lg"
            />
          </div>

          {/* Hero Text */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Complete ERP Solution
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2">
                For Modern Businesses
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage inventory, sales, finance, and operations in one powerful cloud-based platform. 
              Built for businesses that want to scale efficiently.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
            <Button 
              size="lg" 
              className="group text-base px-8 h-12 bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_rgba(79,209,197,0.4)] transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 h-12 border-2 hover:bg-secondary/50"
            >
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center items-center pt-8 animate-fade-in-up delay-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Inventory</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Analytics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Finance</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border shadow-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Multi-tenant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;