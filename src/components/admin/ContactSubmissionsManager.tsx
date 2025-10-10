import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Trash2, Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service: string | null;
  created_at: string;
  read: boolean;
  admin_notes: string | null;
}

export function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load contact submissions", variant: "destructive" });
    } else {
      setSubmissions(data || []);
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      fetchSubmissions();
    }
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ admin_notes: notes })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to save notes", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Notes saved" });
      setEditingNotes(null);
      fetchSubmissions();
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete submission", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Submission deleted" });
      fetchSubmissions();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Submissions</CardTitle>
        <CardDescription>View and manage messages from the contact form</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No submissions yet</p>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className={submission.read ? "opacity-60" : ""}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{submission.name}</h3>
                      {!submission.read && <Badge variant="default">New</Badge>}
                      {submission.service && (
                        <Badge variant="outline">{submission.service}</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </div>
                      <p className="text-xs">
                        {format(new Date(submission.created_at), "PPpp")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRead(submission.id, submission.read)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSubmission(submission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm">Subject:</p>
                    <p className="text-sm">{submission.subject}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Message:
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <p className="font-medium text-sm">Admin Notes:</p>
                  {editingNotes === submission.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add admin notes..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveNotes(submission.id)}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNotes(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                      onClick={() => {
                        setEditingNotes(submission.id);
                        setNotes(submission.admin_notes || "");
                      }}
                    >
                      {submission.admin_notes || "Click to add notes..."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
