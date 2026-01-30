import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Users, Award, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">About Misafa Technologies</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Building digital futures through innovation, creativity, and expertise
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-10 sm:mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardContent className="p-6 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Story</h2>
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground">
                <p>
                  Misafa Technologies was founded with a simple yet powerful mission: to help businesses, individuals, and organizations transform their digital presence and build lasting brands.
                </p>
                <p>
                  We believe that every brand has a unique story to tell. Our team of creative professionals and technical experts work together to bring these stories to life through innovative digital solutions.
                </p>
                <p>
                  From startups to established enterprises, we've helped countless clients achieve their goals through our comprehensive suite of services including web development, branding, AI automation, and more.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-10 sm:mb-16">
          <Card className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border-primary/10">
            <CardContent className="p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                To empower businesses with cutting-edge digital solutions that drive growth, enhance brand visibility, and create meaningful connections with their audiences.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border-primary/10">
            <CardContent className="p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-accent/30 group-hover:to-primary/30 transition-colors">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                To be the leading digital transformation partner, recognized for innovation, quality, and our commitment to helping brands reach their full potential in the digital age.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border-primary/10">
            <CardContent className="p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-destructive/20 to-accent/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-destructive/30 group-hover:to-accent/30 transition-colors">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Our Team</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                A diverse group of talented designers, developers, strategists, and content creators dedicated to delivering exceptional results and exceeding client expectations.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border-primary/10">
            <CardContent className="p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Our Values</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Innovation, integrity, excellence, and client success. We're committed to staying ahead of industry trends and delivering solutions that make a real difference.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <CardContent className="p-6 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Let's work together to transform your brand and build your digital future.
            </p>
            <Link to="/contact">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
