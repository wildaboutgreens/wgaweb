'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  pricePaise: number;
  quantity: number;
  maxStock: number;
  thumbnailUrl?: string | null;
}

export const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  'broccoli-microgreens': 'https://images.unsplash.com/photo-1540073280202-6e5c781befec?fm=jpg&q=80&w=800&auto=format&fit=crop',
  'sunflower-microgreens': 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?fm=jpg&q=80&w=800&auto=format&fit=crop',
  'radish-microgreens': 'https://images.unsplash.com/photo-1647613233075-e0d5546b0f22?fm=jpg&q=80&w=800&auto=format&fit=crop',
  'classic-trio-bundle': 'https://plus.unsplash.com/premium_photo-1703258064295-71c77cc0720f?fm=jpg&q=80&w=800&auto=format&fit=crop',
};

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?fm=jpg&q=80&w=800&auto=format&fit=crop';

export function getProductThumbnail(slug: string, currentUrl?: string | null): string {
  if (currentUrl && currentUrl.trim() !== '') return currentUrl;
  return PRODUCT_FALLBACK_IMAGES[slug] || DEFAULT_PRODUCT_IMAGE;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalPaise: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (open) => set({ isOpen: open }),

      addItem: (newItem) =>
        set((state) => {
          const resolvedThumb = getProductThumbnail(newItem.productSlug, newItem.thumbnailUrl);
          const itemWithThumb = { ...newItem, thumbnailUrl: resolvedThumb };

          const existing = state.items.find((i) => i.variantId === newItem.variantId);
          if (existing) {
            const newQty = Math.min(existing.quantity + (newItem.quantity || 1), newItem.maxStock);
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: newQty, thumbnailUrl: i.thumbnailUrl || resolvedThumb }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...itemWithThumb, quantity: Math.min(newItem.quantity || 1, newItem.maxStock) },
            ],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.variantId !== variantId) };
          }
          return {
            items: state.items.map((i) =>
              i.variantId === variantId
                ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      totalPaise: () => get().items.reduce((sum, i) => sum + i.pricePaise * i.quantity, 0),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'wga-cart',
      // Only persist items, not UI state like isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);
