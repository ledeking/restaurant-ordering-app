"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { CartItem } from "@/lib/store/cart-store";

interface CreateCheckoutSessionParams {
  items: CartItem[];
  address: any;
  deliveryType: "DELIVERY" | "PICKUP";
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export async function createCheckoutSession({
  items,
  address,
  deliveryType,
  subtotal,
  tax,
  deliveryFee,
  total,
}: CreateCheckoutSessionParams) {
  const user = await getCurrentUser();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Create order in database
  const order = await db.order.create({
    data: {
      userId: user?.id,
      clerkId: user?.clerkId || null,
      email: user?.email || null,
      status: "PENDING",
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
      deliveryType: deliveryType,
      items: {
        create: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.variantPrice || item.price,
          selectedVariants: item.selectedVariants || null,
        })),
      },
      ...(address && deliveryType === "DELIVERY"
        ? {
            address: {
              create: {
                userId: user?.id || "",
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country || "US",
              },
            },
          }
        : {}),
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round((item.variantPrice || item.price) * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${appUrl}/order-confirmation/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout`,
    metadata: {
      orderId: order.id,
    },
  });

  // Update order with payment intent ID
  await db.order.update({
    where: { id: order.id },
    data: { paymentIntentId: session.id },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
