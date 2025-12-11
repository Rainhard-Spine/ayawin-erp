import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ayawinLogo from "@/assets/ayawin-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={ayawinLogo} alt="Ayawin" className="h-10 object-contain" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
              Demo
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/auth"}>
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent" onClick={() => window.location.href = "/auth"}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

          {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <a href="#features" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#demo" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Demo
            </a>
            <a href="#pricing" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#contact" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => window.location.href = "/auth"}>
                Sign In
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent" onClick={() => window.location.href = "/auth"}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;