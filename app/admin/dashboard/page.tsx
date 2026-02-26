import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react";

export const revalidate = 0;

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    totalRevenue,
    todayRevenue,
    pendingOrders,
    menuItemCount,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({
      where: { createdAt: { gte: today } },
    }),
    db.order.aggregate({
      _sum: { total: true },
    }),
    db.order.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { total: true },
    }),
    db.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } },
    }),
    db.menuItem.count(),
  ]);

  return {
    totalOrders,
    todayOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    todayRevenue: todayRevenue._sum.total || 0,
    pendingOrders,
    menuItemCount,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(Number(stats.totalRevenue))}
            </div>
            <p className="text-xs text-muted-foreground">
              Today: {formatPrice(Number(stats.todayRevenue))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayOrders} orders today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.menuItemCount}</div>
            <p className="text-xs text-muted-foreground">Active items</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders />
        </CardContent>
      </Card>
    </div>
  );
}

async function RecentOrders() {
  const orders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (orders.length === 0) {
    return <p className="text-muted-foreground">No orders yet</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} •{" "}
              {formatPrice(Number(order.total))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium capitalize">
              {order.status.toLowerCase().replace("_", " ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
