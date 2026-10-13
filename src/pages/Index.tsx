import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Reviews } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Leaf, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const trustIndicators = [
    { icon: Star, label: "4.9/5 Rating", value: "2,500+ Reviews" },
    { icon: Shield, label: "Quality Guarantee", value: "100% Satisfaction" },
    { icon: Clock, label: "Since 2020", value: "5+ Years Experience" },
    { icon: Heart, label: "Happy Customers", value: "10,000+ Served" },
  ];

  const benefits = [
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Vetted local laundromats with certified eco-friendly processes",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "100% biodegradable detergents and carbon-neutral delivery",
    },
    {
      icon: Clock,
      title: "24/7 Express",
      description: "Same-day service available for urgent orders",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Insured service with contactless pickup and delivery",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Trust Indicators */}
      <section className="py-8 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustIndicators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Service, Eco-Friendly Approach
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine convenience with sustainability to deliver exceptional laundry service
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Reviews />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-accent to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Hassle-Free, Fresh Laundry?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of happy families across India who trust LaundryGo for all their laundry needs!
          </p>
          <Link to="/book">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Book Your First Order
            </Button>
          </Link>
        </div>
      </section>

      <Newsletter />

      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">LaundryGo</h3>
              <p className="text-sm text-muted-foreground">
                Your caring laundry partner! We bring professional cleaning right to your doorstep - eco-friendly, convenient, and always reliable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/book" className="text-muted-foreground hover:text-primary">Book Service</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link to="/track" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
                <li><Link to="/profile" className="text-muted-foreground hover:text-primary">My Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/sustainability" className="text-muted-foreground hover:text-primary">Sustainability</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+1 (555) 123-4567</li>
                <li>support@laundrygo.com</li>
                <li>Available 7 days a week</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LaundryGo. Professional laundry service at your doorstep. Since 2020.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
