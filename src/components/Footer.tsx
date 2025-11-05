import ayawinLogo from "@/assets/ayawin-logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={ayawinLogo} alt="Ayawin" className="h-12 object-contain brightness-0 invert" />
            <p className="text-sm text-accent-foreground/80">
              Modern cloud-based ERP solution for businesses that want to scale efficiently.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              <li><a href="#" className="hover:text-accent-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-accent-foreground/80">
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent-foreground transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-foreground/20 pt-8 text-center text-sm text-accent-foreground/60">
          <p>&copy; {new Date().getFullYear()} Ayawin Stock Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;