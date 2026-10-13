import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, Wind, Recycle, Award, Trees } from "lucide-react";

const Sustainability = () => {
  const initiatives = [
    {
      icon: Leaf,
      title: "Eco-Friendly Detergents",
      description: "We use 100% biodegradable, plant-based detergents that are gentle on fabrics and the environment.",
      impact: "95% less chemical runoff",
    },
    {
      icon: Droplets,
      title: "Water Conservation",
      description: "Advanced washing machines that use up to 50% less water than traditional methods.",
      impact: "Save 10,000 gallons/month",
    },
    {
      icon: Wind,
      title: "Energy Efficient Machines",
      description: "State-of-the-art equipment with Energy Star certification reduces our carbon footprint.",
      impact: "40% energy reduction",
    },
    {
      icon: Recycle,
      title: "Recycled Packaging",
      description: "All our packaging materials are made from 100% recycled and recyclable materials.",
      impact: "Zero plastic waste",
    },
    {
      icon: Trees,
      title: "Carbon-Neutral Delivery",
      description: "Electric vehicles and optimized routes minimize emissions during pickup and delivery.",
      impact: "Net-zero emissions",
    },
    {
      icon: Award,
      title: "Green Certifications",
      description: "Certified by leading environmental organizations for sustainable practices.",
      impact: "ISO 14001 certified",
    },
  ];

  const stats = [
    { label: "Trees Saved", value: "5,000+", icon: Trees },
    { label: "Water Saved (Gallons)", value: "120K+", icon: Droplets },
    { label: "CO2 Reduced (Tons)", value: "50+", icon: Wind },
    { label: "Recycled Materials", value: "100%", icon: Recycle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-secondary to-accent" variant="secondary">
            Our Commitment
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sustainable Laundry for a Better Planet
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            At LaundryGo, we believe in delivering exceptional service while protecting the
            environment for future generations. Every load we wash is a step towards a greener planet.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-10 w-10 mx-auto mb-3 text-secondary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Initiatives */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Green Initiatives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative) => {
              const Icon = initiative.icon;
              return (
                <Card key={initiative.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-full bg-secondary/10">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{initiative.title}</CardTitle>
                    <CardDescription>{initiative.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">
                      {initiative.impact}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Partnership Section */}
        <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-none">
          <CardContent className="pt-8 pb-8 text-center">
            <Leaf className="h-16 w-16 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl font-bold mb-4">Partnering with Local Laundromats</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              We work exclusively with eco-certified local laundromats that share our commitment
              to sustainability. Together, we're building a cleaner future, one load at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-secondary text-secondary-foreground" variant="secondary">
                100% Eco-Certified Partners
              </Badge>
              <Badge className="bg-accent text-accent-foreground" variant="secondary">
                Supporting Local Business
              </Badge>
              <Badge className="bg-success text-success-foreground" variant="secondary">
                Green Chemistry Approved
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sustainability;
