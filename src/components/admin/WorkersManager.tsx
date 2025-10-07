import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, UserX, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Worker {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  skills: string[] | null;
  status: string;
  user_id: string | null;
}

export function WorkersManager() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load workers", variant: "destructive" });
    } else {
      setWorkers(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const skillsText = formData.get("skills") as string;
    const skills = skillsText ? skillsText.split(",").map(s => s.trim()).filter(Boolean) : [];

    const workerData = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || null,
      skills,
      status: "active",
    };

    const { error } = await supabase
      .from("workers")
      .insert([workerData]);

    if (error) {
      toast({ title: "Error", description: "Failed to create worker", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Worker account created" });
      setDialogOpen(false);
      fetchWorkers();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("workers")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Worker ${newStatus === "active" ? "activated" : "deactivated"}` });
      fetchWorkers();
    }
  };

  const deleteWorker = async (id: string) => {
    const { error } = await supabase
      .from("workers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete worker", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Worker deleted" });
      fetchWorkers();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Worker Management</CardTitle>
            <CardDescription>Manage contributor accounts</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Worker Account</DialogTitle>
                <DialogDescription>Add a new contributor to your team</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input id="skills" name="skills" placeholder="Chat management, Content creation" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Worker</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workers.map((worker) => (
            <div key={worker.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{worker.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{worker.email}</p>
                  {worker.phone && <p className="text-sm text-muted-foreground">{worker.phone}</p>}
                  {worker.skills && worker.skills.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {worker.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={worker.status === "active" ? "default" : "secondary"}>
                    {worker.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStatus(worker.id, worker.status)}
                  >
                    {worker.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteWorker(worker.id)}
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
