"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/orders";
import { toast } from "@/hooks/use-toast";
import { OrderStatus } from "@prisma/client";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus.toLowerCase().replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
      disabled={loading}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
        <SelectItem value="PREPARING">Preparing</SelectItem>
        <SelectItem value="READY">Ready</SelectItem>
        <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
        <SelectItem value="CANCELLED">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
