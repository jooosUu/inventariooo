import { create } from 'zustand';
import { Product, InventoryStats } from '../types/inventory';

interface InventoryStore {
  products: Product[];
  stats: InventoryStats;
  addProduct: (product: Product) => void;
  updateStock: (id: string, quantity: number) => void;
  getProduct: (barcode: string) => Product | undefined;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: [],
  stats: {
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    recentMovements: 0,
  },
  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product],
      stats: {
        ...state.stats,
        totalProducts: state.stats.totalProducts + 1,
        totalValue: state.stats.totalValue + (product.price * product.stock),
      },
    }));
  },
  updateStock: (id, quantity) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + quantity, lastUpdated: new Date() }
          : product
      ),
    }));
  },
  getProduct: (barcode) => {
    return get().products.find((product) => product.barcode === barcode);
  },
}));