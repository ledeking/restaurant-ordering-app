"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Store } from "lucide-react";

interface DeliveryOptionsProps {
  onSubmit: (type: "DELIVERY" | "PICKUP") => void;
  initialType?: "DELIVERY" | "PICKUP";
}

export function DeliveryOptions({
  onSubmit,
  initialType = "DELIVERY",
}: DeliveryOptionsProps) {
  const [selectedType, setSelectedType] = useState<"DELIVERY" | "PICKUP">(
    initialType
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === "DELIVERY"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setSelectedType("DELIVERY")}
        >
          <Truck className="h-6 w-6" />
          <div className="flex-1">
            <h3 className="font-semibold">Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Get your order delivered to your address
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            selectedType === "PICKUP"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => setSelectedType("PICKUP")}
        >
          <Store className="h-6 w-6" />
          <div className="flex-1">
            <h3 className="font-semibold">Pickup</h3>
            <p className="text-sm text-muted-foreground">
              Pick up your order at the restaurant
            </p>
          </div>
        </div>
        <Button
          onClick={() => onSubmit(selectedType)}
          className="w-full"
        >
          Continue to Payment
        </Button>
      </CardContent>
    </Card>
  );
}
