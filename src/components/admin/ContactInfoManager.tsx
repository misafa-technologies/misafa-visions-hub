import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Save, X } from "lucide-react";

interface ContactInfo {
  id: string;
  key: string;
  value: string;
  label: string;
  category: string;
}

export function ContactInfoManager() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    const { data, error } = await supabase
      .from("contact_information")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load contact information", variant: "destructive" });
    } else {
      setContactInfo(data || []);
    }
  };

  const startEdit = (item: ContactInfo) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("contact_information")
      .update({ value: editValue })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update contact information", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Contact information updated" });
      setEditingId(null);
      fetchContactInfo();
    }
  };

  const groupedByCategory = contactInfo.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ContactInfo[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Manage company contact details displayed across the website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Label className="w-32">{item.label}</Label>
                {editingId === item.id ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => saveEdit(item.id)} size="sm">
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-muted-foreground">{item.value}</span>
                    <Button onClick={() => startEdit(item)} size="sm" variant="ghost">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
