import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 3 users",
      "Single warehouse",
      "Basic inventory management",
      "Point of Sale",
      "Sales & purchase tracking",
      "Mobile responsive",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing businesses with multiple locations",
    features: [
      "Up to 15 users",
      "Multiple warehouses",
      "Advanced inventory & analytics",
      "Multi-branch support",
      "Full accounting suite",
      "HR & Attendance",
      "Priority support",
      "API access"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited users",
      "Unlimited warehouses",
      "Custom modules",
      "Dedicated support",
      "Advanced security",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option"
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? "border-2 border-primary shadow-xl scale-105 bg-gradient-to-b from-card to-primary/5" 
                  : "hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-3 px-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-8 px-6 pb-6">
                <Button 
                  className={`w-full h-11 text-base ${
                    plan.popular 
                      ? "bg-gradient-to-r from-primary to-accent hover:shadow-lg" 
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => {
                    if (plan.price === "Custom") {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = "/auth";
                    }
                  }}
                >
                  {plan.price === "Custom" ? "Contact Ayawin" : "Try Demo"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;