import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, EyeOff } from "lucide-react";

interface StudentAssignment {
  id: string;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  assignment_title: string;
  assignment_description: string;
  login_credentials: string | null;
  deadline: string | null;
  status: string;
  assigned_worker_id: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface Worker {
  id: string;
  full_name: string;
}

export function StudentAssignmentsManager() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
    fetchWorkers();
  }, []);

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("student_assignments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" });
    } else {
      setAssignments(data || []);
    }
  };

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("id, full_name")
      .eq("status", "active");

    if (error) {
      toast({ title: "Error", description: "Failed to load workers", variant: "destructive" });
    } else {
      setWorkers(data || []);
    }
  };

  const assignWorker = async (assignmentId: string, workerId: string) => {
    const { error } = await supabase
      .from("student_assignments")
      .update({ assigned_worker_id: workerId, status: "assigned" })
      .eq("id", assignmentId);

    if (error) {
      toast({ title: "Error", description: "Failed to assign worker", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Worker assigned successfully" });
      fetchAssignments();
    }
  };

  const updateStatus = async (assignmentId: string, status: string) => {
    const { error } = await supabase
      .from("student_assignments")
      .update({ status })
      .eq("id", assignmentId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Status updated" });
      fetchAssignments();
    }
  };

  const toggleCredentials = (id: string) => {
    setShowCredentials(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "assigned": return "default";
      case "in_progress": return "default";
      case "completed": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Assignments</CardTitle>
        <CardDescription>Manage student assignment requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{assignment.student_name}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.student_email}</p>
                  {assignment.student_phone && <p className="text-sm text-muted-foreground">{assignment.student_phone}</p>}
                </div>
                <Badge variant={getStatusColor(assignment.status)}>{assignment.status}</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">{assignment.assignment_title}</p>
                <p className="text-sm mt-1">{assignment.assignment_description}</p>
                {assignment.deadline && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    Deadline: {format(new Date(assignment.deadline), "PPP")}
                  </p>
                )}
              </div>

              {assignment.login_credentials && (
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Login Credentials</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCredentials(assignment.id)}
                    >
                      {showCredentials[assignment.id] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm font-mono">
                    {showCredentials[assignment.id] ? assignment.login_credentials : "••••••••"}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Assign Worker</Label>
                  <Select onValueChange={(value) => assignWorker(assignment.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Update Status</Label>
                  <Select onValueChange={(value) => updateStatus(assignment.id, value)} defaultValue={assignment.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
