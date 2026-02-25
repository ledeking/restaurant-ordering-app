"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteMenuItem } from "@/actions/menu";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface MenuItemActionsProps {
  itemId: string;
  itemName: string;
}

export function MenuItemActions({ itemId, itemName }: MenuItemActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteMenuItem(itemId);
      toast({
        title: "Item deleted",
        description: `${itemName} has been deleted.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
