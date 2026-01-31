import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";
import { PageLoader } from "@/components/PageLoader";

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
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Our Products</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Explore our comprehensive suite of software solutions designed to streamline your business operations and drive growth.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 animate-fade-in border-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-4 sm:p-6">
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

                <Button
                  onClick={() => handleInquiry(product.title)}
                  className="w-full"
                  disabled={!whatsappNumber}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Inquire Now
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
