import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  features: string[];
  visible: boolean;
  display_order: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("visible", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return <LucideIcons.Package className="w-6 h-6" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : <LucideIcons.Package className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <p className="text-center text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive software solutions to streamline your business operations and drive growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {getIcon(product.icon)}
                </div>
                <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  onClick={() => navigate("/contact")} 
                  className="w-full"
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Inquire Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-6">
            We specialize in building tailored software solutions that perfectly fit your unique business requirements
          </p>
          <Button onClick={() => navigate("/contact")} size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
