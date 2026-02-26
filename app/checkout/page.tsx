"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { AddressForm } from "@/components/checkout/address-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { DeliveryOptions } from "@/components/checkout/delivery-options";
import { createCheckoutSession } from "@/actions/checkout";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type CheckoutStep = "address" | "delivery" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<any>(null);
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [loading, setLoading] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = deliveryType === "DELIVERY" ? (subtotal > 50 ? 0 : 5.99) : 0;
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleAddressSubmit = (addressData: any) => {
    setAddress(addressData);
    setStep("delivery");
  };

  const handleDeliverySubmit = (type: "DELIVERY" | "PICKUP") => {
    setDeliveryType(type);
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!address && deliveryType === "DELIVERY") {
      toast({
        title: "Error",
        description: "Please provide a delivery address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sessionUrl = await createCheckoutSession({
        items,
        address,
        deliveryType,
        subtotal,
        tax,
        deliveryFee,
        total,
      });
      window.location.href = sessionUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {step === "address" && (
            <AddressForm onSubmit={handleAddressSubmit} initialData={address} />
          )}
          {step === "delivery" && (
            <DeliveryOptions
              onSubmit={handleDeliverySubmit}
              initialType={deliveryType}
            />
          )}
          {step === "payment" && (
            <PaymentForm
              onPayment={handlePayment}
              loading={loading}
              total={total}
            />
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      {formatPrice((item.variantPrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
