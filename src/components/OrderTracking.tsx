import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, CheckCircle2, Truck } from "lucide-react";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "LG12345",
    status: "in-progress",
    stage: "cleaning",
    pickupDate: "2025-10-25",
    deliveryDate: "2025-10-27",
  },
  {
    id: "LG12346",
    status: "ready",
    stage: "ready-for-delivery",
    pickupDate: "2025-10-24",
    deliveryDate: "2025-10-26",
  },
];

const stages = [
  { key: "picked-up", label: "Picked Up", icon: Package },
  { key: "cleaning", label: "Cleaning", icon: Package },
  { key: "ready-for-delivery", label: "Ready for Delivery", icon: CheckCircle2 },
  { key: "delivered", label: "Delivered", icon: Truck },
];

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<typeof mockOrders[0] | null>(null);

  const handleTrack = () => {
    const order = mockOrders.find((o) => o.id === orderId);
    if (order) {
      setTrackedOrder(order);
    } else {
      toast.error("Order not found. Please check your order ID.");
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Track Your Order
            </h2>
            <p className="text-xl text-muted-foreground">
              Enter your order ID to see real-time status
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Order ID (e.g., LG12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                className="flex-1"
              />
              <Button 
                onClick={handleTrack}
                className="bg-primary hover:bg-primary/90"
              >
                <Search className="mr-2 h-4 w-4" />
                Track
              </Button>
            </div>
          </Card>

          {trackedOrder && (
            <Card className="p-8 shadow-hover animate-fade-in">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Order {trackedOrder.id}
                    </h3>
                    <p className="text-muted-foreground">
                      Pickup: {new Date(trackedOrder.pickupDate).toLocaleDateString()} • 
                      Delivery: {new Date(trackedOrder.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={trackedOrder.status === "ready" ? "default" : "secondary"}
                    className="text-sm px-3 py-1"
                  >
                    {trackedOrder.status === "ready" ? "Ready" : "In Progress"}
                  </Badge>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
                
                <div className="space-y-8">
                  {stages.map((stage, index) => {
                    const isActive = stage.key === trackedOrder.stage;
                    const isPast = stages.findIndex(s => s.key === trackedOrder.stage) > index;
                    const Icon = stage.icon;
                    
                    return (
                      <div key={stage.key} className="relative flex items-center gap-4">
                        <div 
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isActive || isPast
                              ? "bg-primary text-primary-foreground shadow-soft"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                            {stage.label}
                          </h4>
                          {isActive && (
                            <p className="text-sm text-muted-foreground">Current status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};
