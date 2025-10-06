import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Filter } from "lucide-react";

export default function Projects() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of successful projects and transformations
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button variant="default" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            All Projects
          </Button>
          <Button variant="outline" size="sm">Websites</Button>
          <Button variant="outline" size="sm">Branding</Button>
          <Button variant="outline" size="sm">AI Solutions</Button>
          <Button variant="outline" size="sm">Social Media</Button>
          <Button variant="outline" size="sm">Content</Button>
        </div>

        {/* Empty State */}
        <Card className="bg-muted/30">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Projects Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're currently working on showcasing our amazing portfolio. Check back soon to see the incredible transformations we've delivered for our clients!
            </p>
            <Link to="/contact">
              <Button size="lg">
                Start Your Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
