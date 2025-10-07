import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ChatRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  project_type: string;
  description: string;
  target_audience: string | null;
  status: string;
  assigned_worker_id: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface Worker {
  id: string;
  full_name: string;
}

export function ChatFellowManager() {
  const [requests, setRequests] = useState<ChatRequest[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ChatRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    fetchWorkers();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("chat_fellow_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load requests", variant: "destructive" });
    } else {
      setRequests(data || []);
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

  const assignWorker = async (requestId: string, workerId: string) => {
    const { error } = await supabase
      .from("chat_fellow_requests")
      .update({ assigned_worker_id: workerId, status: "assigned" })
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to assign worker", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Worker assigned successfully" });
      fetchRequests();
    }
  };

  const updateStatus = async (requestId: string, status: string) => {
    const { error } = await supabase
      .from("chat_fellow_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Status updated" });
      fetchRequests();
    }
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
        <CardTitle>Chat Fellow Requests</CardTitle>
        <CardDescription>Manage client chat service requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.client_name}</h3>
                  <p className="text-sm text-muted-foreground">{request.client_email}</p>
                  {request.client_phone && <p className="text-sm text-muted-foreground">{request.client_phone}</p>}
                </div>
                <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium">Project Type: {request.project_type}</p>
                <p className="text-sm mt-1">{request.description}</p>
                {request.target_audience && (
                  <p className="text-sm mt-1 text-muted-foreground">Target Audience: {request.target_audience}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Assign Worker</Label>
                  <Select onValueChange={(value) => assignWorker(request.id, value)}>
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
                  <Select onValueChange={(value) => updateStatus(request.id, value)} defaultValue={request.status}>
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
