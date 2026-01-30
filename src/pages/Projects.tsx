import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";

interface Project {
  id: string;
  title: string;
  description: string;
  features: string[] | null;
  image_url: string | null;
  vercel_link: string | null;
  visible: boolean | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Our Projects</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Explore our portfolio of successful projects and transformations
          </p>
        </div>

        {loading ? (
          <PageLoader />
        ) : projects.length === 0 ? (
          <Card className="bg-muted/30 border-primary/10">
            <CardContent className="p-8 sm:p-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Projects Coming Soon</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                We're currently working on showcasing our amazing portfolio. Check back soon to see the incredible transformations we've delivered for our clients!
              </p>
              <Link to="/contact">
                <Button size="lg">
                  Start Your Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className="overflow-hidden group hover:shadow-lg hover:shadow-primary/20 transition-all animate-fade-in border-primary/10"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {project.image_url && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img 
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{project.description}</p>
                  {project.features && project.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">{feature}</Badge>
                      ))}
                    </div>
                  )}
                  {project.vercel_link && (
                    <a 
                      href={project.vercel_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      View Live Project <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
