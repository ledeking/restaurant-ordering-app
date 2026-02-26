import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MenuItemForm } from "@/components/admin/menu-item-form";

export const revalidate = 0;

async function getMenuItem(id: string) {
  return await db.menuItem.findUnique({
    where: { id },
    include: { category: true },
  });
}

export default async function EditMenuItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getMenuItem(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Menu Item</h1>
      <MenuItemForm item={item} />
    </div>
  );
}
