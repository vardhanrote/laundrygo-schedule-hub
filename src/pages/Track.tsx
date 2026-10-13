import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  pickup_date: string;
  delivery_date: string;
  created_at: string;
}

const Track = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: Clock, label: "Pending Pickup", color: "bg-warning text-warning-foreground", step: 1 };
      case "picked_up":
        return { icon: Truck, label: "Picked Up", color: "bg-primary text-primary-foreground", step: 2 };
      case "in_progress":
        return { icon: Package, label: "In Progress", color: "bg-accent text-accent-foreground", step: 3 };
      case "completed":
        return { icon: CheckCircle2, label: "Completed", color: "bg-success text-success-foreground", step: 4 };
      default:
        return { icon: Clock, label: "Unknown", color: "bg-muted text-muted-foreground", step: 1 };
    }
  };

  const StatusProgress = ({ currentStep }: { currentStep: number }) => {
    const steps = [
      { label: "Pending", icon: Clock },
      { label: "Picked Up", icon: Truck },
      { label: "Processing", icon: Package },
      { label: "Ready", icon: CheckCircle2 },
    ];

    return (
      <div className="relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = index + 1 <= currentStep;
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`rounded-full p-3 ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  } transition-colors`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs mt-2 text-center">{step.label}</p>
              </div>
            );
          })}
        </div>
        {/* Progress Bar */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted -z-0 mx-12">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Track Your Orders</h1>
          <p className="text-muted-foreground mb-8">
            Monitor the status of your laundry orders in real-time
          </p>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground">
                  You haven't placed any orders yet. Start by booking a service!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Order #{order.id.slice(0, 8)}
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">₹{order.total_amount?.toFixed(2) || "0.00"}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <StatusProgress currentStep={statusInfo.step} />

                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Pickup Date</p>
                          <p className="font-semibold">
                            {new Date(order.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Date</p>
                          <p className="font-semibold">
                            {new Date(order.delivery_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
