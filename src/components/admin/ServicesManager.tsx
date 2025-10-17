import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  visible: boolean;
  display_order: number;
  pricing?: PricingTier[];
  link_url?: string;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services_offered")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
    } else {
      setServices((data as unknown as Service[]) || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const featuresText = formData.get("features") as string;
    const features = featuresText ? featuresText.split("\n").filter(f => f.trim()) : [];
    
    const pricingText = formData.get("pricing") as string;
    let pricingData = null;
    if (pricingText && pricingText.trim()) {
      try {
        pricingData = JSON.parse(pricingText);
      } catch (e) {
        toast({
          title: "Error",
          description: "Invalid pricing JSON format",
          variant: "destructive",
        });
        return;
      }
    }

    const serviceData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      features,
      pricing: pricingData,
      link_url: (formData.get("link_url") as string) || null,
      visible: formData.get("visible") === "on",
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    if (editingService) {
      const { error } = await supabase
        .from("services_offered")
        .update(serviceData)
        .eq("id", editingService.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Service updated" });
      }
    } else {
      const { error } = await supabase
        .from("services_offered")
        .insert([serviceData]);

      if (error) {
        toast({ title: "Error", description: "Failed to create service", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Service created" });
      }
    }

    setDialogOpen(false);
    setEditingService(null);
    fetchServices();
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase
      .from("services_offered")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Service deleted" });
      fetchServices();
    }
  };

  const toggleVisibility = async (id: string, visible: boolean) => {
    const { error } = await supabase
      .from("services_offered")
      .update({ visible: !visible })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
    } else {
      fetchServices();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Services Management</CardTitle>
            <CardDescription>Manage services offered by your agency</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingService(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                <DialogDescription>
                  {editingService ? "Update service information" : "Create a new service offering"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingService?.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingService?.description} required />
                </div>
                <div>
                  <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                  <Input id="icon" name="icon" defaultValue={editingService?.icon || ""} placeholder="Code" />
                </div>
                <div>
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea 
                    id="features" 
                    name="features" 
                    defaultValue={editingService?.features?.join("\n") || ""} 
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                <div>
                  <Label htmlFor="pricing">Pricing (JSON format - optional)</Label>
                  <Textarea
                    id="pricing"
                    name="pricing"
                    defaultValue={editingService?.pricing ? JSON.stringify(editingService.pricing, null, 2) : ""}
                    placeholder='[{"name": "Basic", "price": "9.99", "period": "month", "features": ["Feature 1", "Feature 2"]}]'
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Add pricing tiers in JSON format with name, price, period, and features
                  </p>
                </div>
                <div>
                  <Label htmlFor="link_url">External Link URL (optional)</Label>
                  <Input 
                    id="link_url" 
                    name="link_url" 
                    type="url"
                    defaultValue={editingService?.link_url || ""} 
                    placeholder="https://yourwebsite.com/service" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Link to external page (e.g., your website for this service)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="visible" name="visible" defaultChecked={editingService?.visible ?? true} />
                  <Label htmlFor="visible">Visible on website</Label>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" name="display_order" type="number" defaultValue={editingService?.display_order || 0} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingService ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="text-sm mt-2 space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={service.visible} onCheckedChange={() => toggleVisibility(service.id, service.visible)} />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingService(service);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteService(service.id)}
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
  );
}
