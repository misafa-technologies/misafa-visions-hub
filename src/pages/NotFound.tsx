import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-4 flex items-center justify-center">
      <Card className="w-full max-w-lg text-center border-primary/10">
        <CardContent className="p-6 sm:p-12">
          {/* Error Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Page Not Found</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-xs text-muted-foreground mb-6 sm:mb-8">
            Requested: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()} className="border-primary/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
            <h3 className="font-medium mb-4 text-sm sm:text-base">Popular Pages</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/services">Services</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products">Products</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects">Projects</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
