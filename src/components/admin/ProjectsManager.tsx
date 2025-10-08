import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Project {
  id: string;
  title: string;
  description: string;
  features: string[] | null;
  image_url: string | null;
  vercel_link: string | null;
  visible: boolean | null;
  category_id: string | null;
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    image_url: "",
    vercel_link: "",
    visible: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load projects", variant: "destructive" });
    } else {
      setProjects(data || []);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      features: "",
      image_url: "",
      vercel_link: "",
      visible: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const featuresArray = formData.features
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const projectData = {
      title: formData.title,
      description: formData.description,
      features: featuresArray.length > 0 ? featuresArray : null,
      image_url: formData.image_url || null,
      vercel_link: formData.vercel_link || null,
      visible: formData.visible,
    };

    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error", description: "Failed to update project", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project updated" });
        resetForm();
        fetchProjects();
      }
    } else {
      const { error } = await supabase
        .from("projects")
        .insert([projectData]);

      if (error) {
        toast({ title: "Error", description: "Failed to add project", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Project added" });
        resetForm();
        fetchProjects();
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      features: project.features?.join("\n") || "",
      image_url: project.image_url || "",
      vercel_link: project.vercel_link || "",
      visible: project.visible ?? true,
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Project deleted" });
      fetchProjects();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projects Portfolio</CardTitle>
            <CardDescription>Manage your showcase projects</CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vercel_link">Vercel/Live Link</Label>
              <Input
                id="vercel_link"
                type="url"
                value={formData.vercel_link}
                onChange={(e) => setFormData({ ...formData, vercel_link: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label htmlFor="visible">Visible to public</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Add"} Project
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    {!project.visible && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  {project.features && project.features.length > 0 && (
                    <ul className="text-xs text-muted-foreground mt-2 list-disc list-inside">
                      {project.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {project.vercel_link && (
                    <a 
                      href={project.vercel_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                    >
                      View Live <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(project)} size="sm" variant="ghost">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(project.id)} size="sm" variant="ghost">
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
