import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderStatus } from "@prisma/client";

export const revalidate = 0;

async function getOrders() {
  return await db.order.findMany({
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {formatPrice(Number(order.total))}
                    </p>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span>{formatPrice(Number(item.price * item.quantity))}</span>
                    </div>
                  ))}
                </div>
                {order.address && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>
                      {order.address.street}, {order.address.city}, {order.address.state}{" "}
                      {order.address.zipCode}
                    </p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>Delivery Type: {order.deliveryType}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
