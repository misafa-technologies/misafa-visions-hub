import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, DollarSign, ExternalLink, Check, Globe, Palette, Bot, Share2, FileText, Video, Code, Megaphone } from "lucide-react";
import * as Icons from "lucide-react";
import { useContactInfo } from "@/hooks/useContactInfo";
import { PageLoader } from "@/components/PageLoader";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string[] | null;
  visible: boolean;
  display_order: number;
  pricing?: PricingTier[];
  link_url?: string;
}

const staticServices = [
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
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { contactInfo } = useContactInfo();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services_offered")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setDynamicServices(data as unknown as Service[]);
    }
    setLoading(false);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8 text-primary" /> : null;
  };

  const whatsappNumber = contactInfo.find((info) => info.key === "whatsapp")?.value || "";

  const handleInquiry = (serviceTitle: string) => {
    const message = encodeURIComponent(`Hi, I'm interested in learning more about ${serviceTitle}. Can you provide more information?`);
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`;
    window.open(url, "_blank");
  };

  const allServices = [...staticServices, ...dynamicServices];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Our Services</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Comprehensive digital solutions designed to elevate your brand and accelerate your growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-10 sm:mb-16">
          {allServices.map((service, index) => {
            const isDynamic = 'id' in service;
            return (
              <Card 
                key={isDynamic ? service.id : index}
                className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card animate-fade-in border-primary/10"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CardContent className="p-4 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors flex-shrink-0">
                      {isDynamic ? getIcon(service.icon) : <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">{service.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary">Key Features:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features?.map((feature, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center">
                          <ArrowRight className="w-3 h-3 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Section for Dynamic Services */}
                  {isDynamic && service.pricing && service.pricing.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-primary mb-3">Pricing Plans:</p>
                      <div className="space-y-3">
                        {service.pricing.map((tier, idx) => (
                          <div key={idx} className="border rounded-lg p-3 hover:border-primary transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-semibold">{tier.name}</div>
                              <div className="text-xl font-bold text-primary">
                                ${tier.price}
                                <span className="text-xs text-muted-foreground ml-1">/{tier.period}</span>
                              </div>
                            </div>
                            {tier.features && tier.features.length > 0 && (
                              <ul className="space-y-1 mt-2">
                                {tier.features.map((feature, fIdx) => (
                                  <li key={fIdx} className="flex items-start text-xs">
                                    <Check className="w-3 h-3 text-primary mr-1 flex-shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {service.title === "Website Creation" && (
                    <Link to="/pricing" className="mt-4 block">
                      <Button variant="outline" className="w-full">
                        <DollarSign className="w-4 h-4 mr-2" />
                        View Pricing Plans
                      </Button>
                    </Link>
                  )}
                  
                  {isDynamic && service.link_url && (
                    <a href={service.link_url} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                      <Button className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </a>
                  )}

                  {isDynamic && !service.link_url && (
                    <Button onClick={() => handleInquiry(service.title)} className="w-full mt-4" disabled={!whatsappNumber}>
                      Get Started
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
