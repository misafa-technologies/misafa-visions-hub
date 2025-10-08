import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Globe, Palette, Bot, Share2, FileText, Video } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, any> = {
  Globe,
  Palette,
  Bot,
  Share2,
  FileText,
  Video,
};

export default function Home() {
  const { services: dbServices, loading } = useServices();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
              We Build Brands.
              <br />
              We Build the Future.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Helping businesses, individuals, and organizations create and upgrade their brands through innovative digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive digital solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-3 text-center text-muted-foreground">Loading services...</p>
            ) : dbServices.length > 0 ? (
              dbServices.map((service, index) => {
                const IconComponent = service.icon ? iconMap[service.icon] || Globe : Globe;
                return (
                  <Card 
                    key={service.id} 
                    className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 bg-card"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="col-span-3 text-center text-muted-foreground">No services available yet.</p>
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline">
                Explore All Services <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Brand?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of satisfied clients who have elevated their digital presence with Misafa Technologies.
              </p>
              <Link to="/contact">
                <Button size="lg" className="text-lg px-8">
                  Work With Us <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
