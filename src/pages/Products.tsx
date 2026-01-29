import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  features: string[];
  visible: boolean;
  display_order: number;
  pricing?: PricingTier[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { contactInfo } = useContactInfo();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-12 h-12 text-primary" /> : null;
  };

  const whatsappNumber = contactInfo.find((info) => info.key === "whatsapp")?.value || "";

  const handleInquiry = (productTitle: string) => {
    if (!whatsappNumber) return;
    const message = encodeURIComponent(`Hi, I'm interested in learning more about ${productTitle}. Can you provide more information?`);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-muted animate-pulse rounded mx-auto mb-4" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive suite of software solutions designed to streamline your business operations and drive growth.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="mb-4">{getIcon(product.icon)}</div>
                <CardTitle className="text-2xl">{product.title}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {product.features && product.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Pricing Plans */}
                {product.pricing && product.pricing.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Pricing Plans</h3>
                    <div className="space-y-3">
                      {product.pricing.map((tier, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold">{tier.name}</div>
                              <div className="text-2xl font-bold text-primary">
                                ${tier.price}
                                <span className="text-sm text-muted-foreground ml-1">/{tier.period}</span>
                              </div>
                            </div>
                          </div>
                          {tier.features && tier.features.length > 0 && (
                            <ul className="space-y-1 mt-3">
                              {tier.features.map((feature, fIdx) => (
                                <li key={fIdx} className="flex items-start text-sm">
                                  <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleInquiry(product.title)}
                  className="w-full"
                  disabled={!whatsappNumber}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Need a Custom Solution?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? We specialize in building custom software tailored to your specific needs.
            </p>
            <Link to="/contact">
              <Button size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Get in Touch
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
