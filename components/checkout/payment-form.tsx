"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentFormProps {
  onPayment: () => void;
  loading: boolean;
  total: number;
}

export function PaymentForm({ onPayment, loading, total }: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5" />
            <span className="font-semibold">Secure Payment</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You will be redirected to Stripe to complete your payment securely.
          </p>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">{formatPrice(total)}</span>
          </div>
          <Button
            onClick={onPayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
