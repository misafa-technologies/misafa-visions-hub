import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Palette, Bot, Share2, FileText, Video, Code, Megaphone, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website Creation",
    description: "Custom-built websites and web applications using the latest technologies. From landing pages to complex web platforms, we create responsive, fast, and SEO-optimized solutions.",
    features: ["Responsive Design", "SEO Optimization", "E-commerce Integration", "Custom CMS"]
  },
  {
    icon: Palette,
    title: "Branding Projects",
    description: "Complete brand identity packages that make your business unforgettable. We craft logos, color schemes, typography, and brand guidelines that resonate with your audience.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Marketing Materials"]
  },
  {
    icon: Bot,
    title: "AI Automation",
    description: "Streamline your business processes with cutting-edge AI solutions. From chatbots to workflow automation, we help you save time and increase efficiency.",
    features: ["Custom Chatbots", "Process Automation", "AI Integration", "Data Analysis"]
  },
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Strategic social media management that grows your audience and engagement. We create, schedule, and optimize content across all major platforms.",
    features: ["Content Strategy", "Post Scheduling", "Analytics Tracking", "Community Management"]
  },
  {
    icon: FileText,
    title: "Content Writing",
    description: "Compelling content that converts. From blog posts to product descriptions, we create SEO-optimized content that tells your brand story.",
    features: ["Blog Writing", "Product Descriptions", "SEO Content", "Copywriting"]
  },
  {
    icon: Video,
    title: "Video Editing",
    description: "Professional video production and editing for social media, marketing, and more. We transform raw footage into engaging visual stories.",
    features: ["Video Production", "Post-Production", "Motion Graphics", "Color Grading"]
  },
  {
    icon: Code,
    title: "Custom Development",
    description: "Bespoke software solutions tailored to your specific needs. From APIs to complex integrations, we build what you need.",
    features: ["API Development", "System Integration", "Database Design", "Cloud Solutions"]
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Comprehensive digital marketing strategies that drive results. We help you reach your target audience and achieve your business goals.",
    features: ["SEO/SEM", "Email Marketing", "PPC Campaigns", "Analytics"]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital solutions designed to elevate your brand and accelerate your growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card"
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">Key Features:</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center">
                        <ArrowRight className="w-3 h-3 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see exactly what you're looking for? We specialize in creating custom solutions tailored to your unique needs.
            </p>
            <Link to="/contact">
              <Button size="lg" className="text-lg px-8">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
