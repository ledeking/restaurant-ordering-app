"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

interface CreateMenuItemData {
  name: string;
  description?: string;
  price: string;
  image?: string;
  categoryId: string;
  inStock: boolean;
  featured: boolean;
}

export async function createMenuItem(data: CreateMenuItemData) {
  await requireAdmin();

  const slug = slugify(data.name);
  const existing = await db.menuItem.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  await db.menuItem.create({
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image || null,
      categoryId: data.categoryId,
      inStock: data.inStock,
      featured: data.featured,
      slug: finalSlug,
    },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function updateMenuItem(
  id: string,
  data: CreateMenuItemData
) {
  await requireAdmin();

  const existing = await db.menuItem.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Menu item not found");
  }

  let slug = existing.slug;
  if (data.name !== existing.name) {
    slug = slugify(data.name);
    const slugExists = await db.menuItem.findUnique({ where: { slug } });
    if (slugExists && slugExists.id !== id) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  await db.menuItem.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      image: data.image || null,
      categoryId: data.categoryId,
      inStock: data.inStock,
      featured: data.featured,
      slug,
    },
  });

  revalidatePath("/menu");
  revalidatePath(`/menu/${slug}`);
  revalidatePath("/admin/menu");
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();

  await db.menuItem.delete({
    where: { id },
  });

  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}
