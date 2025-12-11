import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Screenshots from "@/components/Screenshots";
import Pricing from "@/components/Pricing";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Ayawin ERP - Complete Business Management Solution | Demo</title>
        <meta name="description" content="Experience Ayawin's powerful cloud-based ERP system. Inventory management, POS, finance, HR & payroll - all in one platform. Try our live demo or request a custom solution." />
        <meta name="keywords" content="ERP, business software, inventory management, POS, accounting, HR, payroll, Ayawin" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <div id="features">
          <Features />
        </div>
        <Screenshots />
        <div id="pricing">
          <Pricing />
        </div>
        <ContactSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;