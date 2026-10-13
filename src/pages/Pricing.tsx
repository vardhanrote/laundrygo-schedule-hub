import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const perItemPrices = [
    { name: "Wash & Fold", price: "₹15", description: "Professional washing and folding with care" },
    { name: "Ironing", price: "₹12", description: "Crisp and neat ironing service" },
    { name: "Dry Clean", price: "₹25", description: "Premium dry cleaning for delicate fabrics" },
    { name: "Stain Removal", price: "₹10", description: "Expert stain treatment that works wonders" },
    { name: "Repairs", price: "₹15", description: "Quick fixes for your favorite clothes" },
    { name: "Alterations", price: "₹20", description: "Perfect fit alterations by experts" },
  ];

  const subscriptionPlans = [
    {
      name: "Family Plan",
      icon: Users,
      price: "₹999",
      period: "/month",
      description: "Perfect for Indian families",
      features: [
        "Up to 40 lbs of laundry per month",
        "Free pickup & delivery at your convenience",
        "Priority scheduling - we're always on time!",
        "15% discount on extra services",
        "Separate sorting for each family member",
      ],
      popular: false,
    },
    {
      name: "Business Plan",
      icon: Briefcase,
      price: "₹2,999",
      period: "/month",
      description: "Ideal for businesses and professionals",
      features: [
        "Up to 150 lbs of laundry per month",
        "Free pickup & delivery across the city",
        "Same-day express service available",
        "25% discount on all additional services",
        "Dedicated support manager for your account",
        "Easy invoice billing",
        "Flexible scheduling as per your needs",
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Simple & Affordable Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that suits your needs best. No hidden charges, just transparent and honest pricing that fits your budget.
          </p>
        </div>

        {/* Special Offer */}
        <div className="mb-12 bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center text-white">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Special Welcome Offer - 20% Off!</h2>
          <p className="text-lg mb-4 opacity-90">
            First time with us? Get 20% discount on your first order! Just use code: WELCOME20
          </p>
          <Link to="/book">
            <Button size="lg" variant="secondary">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Per-Item Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Per-Item Pricing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perItemPrices.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {item.price}
                    <span className="text-sm text-muted-foreground font-normal"> per item</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Subscription Plans</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 rounded-t-lg font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <plan.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/book">
                    <Button className="w-full" size="lg" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">All Plans Include</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <Check className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="font-semibold">Eco-Friendly Products</p>
                </div>
                <div>
                  <Check className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="font-semibold">Quality Guarantee</p>
                </div>
                <div>
                  <Check className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="font-semibold">24/7 Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
