import ayawinLogo from "@/assets/ayawin-logo.jpg";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={ayawinLogo} alt="Ayawin" className="h-12 object-contain brightness-0 invert" />
            <p className="text-sm text-accent-foreground/80">
              Custom ERP solutions tailored to your business needs. Contact us for a personalized demo and consultation.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-accent-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-accent-foreground/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-accent-foreground/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-accent-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">ERP Modules</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              <li><a href="#demo" className="hover:text-accent-foreground transition-colors">Inventory Management</a></li>
              <li><a href="#demo" className="hover:text-accent-foreground transition-colors">Point of Sale</a></li>
              <li><a href="#demo" className="hover:text-accent-foreground transition-colors">Finance & Accounting</a></li>
              <li><a href="#demo" className="hover:text-accent-foreground transition-colors">HR & Payroll</a></li>
              <li><a href="#demo" className="hover:text-accent-foreground transition-colors">CRM & Sales</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              <li><a href="#" className="hover:text-accent-foreground transition-colors">About Ayawin</a></li>
              <li><a href="#contact" className="hover:text-accent-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Ayawin</h4>
            <ul className="space-y-3 text-sm text-accent-foreground/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+254 791 259 510 / +254 745 617 108</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>ayawin.ke@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-accent-foreground/10 rounded-lg">
              <p className="text-xs text-accent-foreground/80">
                <strong>Demo Notice:</strong> This is a demonstration system. Contact us for your custom ERP solution.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-accent-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-accent-foreground/60">
            &copy; {new Date().getFullYear()} Ayawin Stock Solutions. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-accent-foreground/60">
            <a href="#" className="hover:text-accent-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent-foreground transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;