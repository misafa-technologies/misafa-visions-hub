import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface WorkApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  skills: string[] | null;
  experience: string | null;
  portfolio_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export function WorkApplicationsManager() {
  const [applications, setApplications] = useState<WorkApplication[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("work_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } else {
      setApplications(data || []);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("work_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Application ${status}` });
      fetchApplications();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "approved": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Applications</CardTitle>
        <CardDescription>Review applications from people wanting to become contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{app.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                  {app.phone && <p className="text-sm text-muted-foreground">{app.phone}</p>}
                </div>
                <Badge variant={getStatusColor(app.status)}>{app.status}</Badge>
              </div>
              
              {app.skills && app.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {app.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {app.experience && (
                <div>
                  <p className="text-sm font-medium">Experience:</p>
                  <p className="text-sm mt-1 text-muted-foreground">{app.experience}</p>
                </div>
              )}

              {app.portfolio_url && (
                <div>
                  <p className="text-sm font-medium">Portfolio:</p>
                  <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {app.portfolio_url}
                  </a>
                </div>
              )}

              {app.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(app.id, "approved")}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(app.id, "rejected")}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
