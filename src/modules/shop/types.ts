export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  imageUrl: string;
  tags: string[];
}

export type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'name';

export interface ProductFilters {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}
