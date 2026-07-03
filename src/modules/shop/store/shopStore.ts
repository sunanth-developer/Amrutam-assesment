import { create } from 'zustand';
import { getItem, setItem, STORAGE_KEYS } from '../../../core/storage/storage';
import { fetchProductById } from '../services/shopService';
import type { CartItem, CartItemWithProduct, Product } from '../types';

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  loaded: boolean;
  loadPersisted: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getCartWithProducts: () => Promise<CartItemWithProduct[]>;
  clearCart: () => Promise<void>;
}

async function persistCart(cart: CartItem[]) {
  await setItem(STORAGE_KEYS.CART, cart);
}

async function persistWishlist(wishlist: string[]) {
  await setItem(STORAGE_KEYS.WISHLIST, wishlist);
}

export const useShopStore = create<ShopState>((set, get) => ({
  cart: [],
  wishlist: [],
  loaded: false,

  loadPersisted: async () => {
    const [cart, wishlist] = await Promise.all([
      getItem<CartItem[]>(STORAGE_KEYS.CART),
      getItem<string[]>(STORAGE_KEYS.WISHLIST),
    ]);
    set({ cart: cart ?? [], wishlist: wishlist ?? [], loaded: true });
  },

  addToCart: async (productId) => {
    const { cart } = get();
    const existing = cart.find((c) => c.productId === productId);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map((c) =>
        c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c,
      );
    } else {
      updated = [...cart, { productId, quantity: 1, addedAt: new Date().toISOString() }];
    }
    await persistCart(updated);
    set({ cart: updated });
  },

  removeFromCart: async (productId) => {
    const updated = get().cart.filter((c) => c.productId !== productId);
    await persistCart(updated);
    set({ cart: updated });
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await get().removeFromCart(productId);
      return;
    }
    const updated = get().cart.map((c) =>
      c.productId === productId ? { ...c, quantity } : c,
    );
    await persistCart(updated);
    set({ cart: updated });
  },

  toggleWishlist: async (productId) => {
    const { wishlist } = get();
    const updated = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    await persistWishlist(updated);
    set({ wishlist: updated });
  },

  isInWishlist: (productId) => get().wishlist.includes(productId),

  getCartWithProducts: async () => {
    const { cart } = get();
    const items: CartItemWithProduct[] = [];
    for (const item of cart) {
      try {
        const product = await fetchProductById(item.productId);
        items.push({ ...item, product });
      } catch {
        // skip unavailable products
      }
    }
    return items;
  },

  clearCart: async () => {
    await persistCart([]);
    set({ cart: [] });
  },
}));

export function selectCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
