import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, X } from "lucide-react";

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

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    image_url: "",
    features: [""],
    visible: true,
    display_order: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
      return;
    }

    setProducts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ""),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } else {
      const { error } = await supabase.from("products").insert([productData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });
    }

    resetForm();
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Product deleted successfully",
    });

    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      icon: product.icon || "",
      image_url: product.image_url || "",
      features: product.features.length > 0 ? product.features : [""],
      visible: product.visible,
      display_order: product.display_order,
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
      image_url: "",
      features: [""],
      visible: true,
      display_order: 0,
    });
    setEditingProduct(null);
    setIsAdding(false);
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
          <CardDescription>Manage your software products and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAdding(true)} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>

          {isAdding && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Name (Lucide icon name, e.g., ShoppingCart)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="ShoppingCart"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Features</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label htmlFor="visible">Visible to public</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingProduct ? "Update" : "Create"} Product</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="text-sm space-y-1 mb-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Order: {product.display_order}</span>
                      <span>•</span>
                      <span>{product.visible ? "Visible" : "Hidden"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
