import { Calendar, Sparkles, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Calendar,
    title: "Schedule Pickup",
    description: "Choose your convenient time slot and we'll come to your doorstep to collect your laundry.",
  },
  {
    icon: Sparkles,
    title: "We Clean",
    description: "Our professional team cleans your clothes with care using premium detergents and equipment.",
  },
  {
    icon: Truck,
    title: "Get Delivery",
    description: "Track your order in real-time and receive fresh, clean clothes at your preferred time.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to fresh, clean laundry
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="p-8 text-center hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-card border-border"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                <step.icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="text-6xl font-bold text-primary/20 mb-4">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-card-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
