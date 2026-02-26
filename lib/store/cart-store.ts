import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
  variantPrice?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (menuItemId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const getItemKey = (menuItemId: string, selectedVariants?: Record<string, string>) => {
  if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
    return menuItemId;
  }
  const variantString = JSON.stringify(selectedVariants);
  return `${menuItemId}:${variantString}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const key = getItemKey(item.menuItemId, item.selectedVariants);
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex(
          (i) => getItemKey(i.menuItemId, i.selectedVariants) === key
        );

        if (existingIndex >= 0) {
          const updated = [...existingItems];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({ items: [...existingItems, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (menuItemId, selectedVariants) => {
        const key = getItemKey(menuItemId, selectedVariants);
        set({
          items: get().items.filter(
            (i) => getItemKey(i.menuItemId, i.selectedVariants) !== key
          ),
        });
      },
      updateQuantity: (menuItemId, quantity, selectedVariants) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId, selectedVariants);
          return;
        }
        const key = getItemKey(menuItemId, selectedVariants);
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex(
          (i) => getItemKey(i.menuItemId, i.selectedVariants) === key
        );

        if (existingIndex >= 0) {
          const updated = [...existingItems];
          updated[existingIndex].quantity = quantity;
          set({ items: updated });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = (item.variantPrice || item.price) * item.quantity;
          return total + itemPrice;
        }, 0);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
