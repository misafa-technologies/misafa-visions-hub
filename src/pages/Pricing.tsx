import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$149",
    features: [
      "1–3 pages (Home, About, Contact)",
      "Mobile-friendly design",
      "Basic SEO setup",
      "Contact form integration",
      "Free SSL + Hosting support setup",
      "Delivery in 3–5 days"
    ]
  },
  {
    name: "Professional",
    price: "$299",
    popular: true,
    features: [
      "Up to 7 pages (includes Services or Products section)",
      "Custom responsive design",
      "Basic animations & icons",
      "Google Maps & social links",
      "SEO optimization",
      "Blog setup or gallery",
      "Delivery in 5–7 days"
    ]
  },
  {
    name: "Business",
    price: "$499",
    features: [
      "Up to 12 pages",
      "Premium modern UI/UX",
      "E-commerce (Shop + Cart + Payment integration)",
      "Admin dashboard (optional)",
      "Live chat integration",
      "Speed optimization & analytics",
      "Delivery in 7–10 days"
    ]
  },
  {
    name: "Enterprise",
    price: "$899+",
    features: [
      "Unlimited pages",
      "Full custom system (Portal / SaaS / Marketplace)",
      "Database & API integration",
      "Advanced security setup",
      "Maintenance & updates (1 month free)",
      "Priority support"
    ]
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Web Creation Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparent pricing for professional web development. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ${
                plan.popular ? 'border-primary border-2 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-primary">{plan.price.replace('+', '')}</span>
                  {plan.price.includes('+') && <span className="text-2xl text-muted-foreground">+</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="block pt-4">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Not Sure Which Plan to Choose?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your project requirements and find the perfect solution for you.
            </p>
            <Link to="/contact">
              <Button size="lg" className="text-lg px-8">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
