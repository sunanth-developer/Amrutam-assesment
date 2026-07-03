import { ENV } from '@/config/env';
import { apiRequest, buildCacheKey } from '@/core/api/apiClient';
import { AppError } from '@/core/errors/AppError';
import { productsChunks, productsManifest } from '@/core/api/registries/productsRegistry';
import type { PaginatedResult } from '@/shared/types/api';
import type { Product, ProductFilters, SortOption } from '../types';

function loadAllProducts(): Product[] {
  const all: Product[] = [];
  for (let i = 0; i < productsManifest.chunks; i++) {
    all.push(...productsChunks[i]);
  }
  return all;
}

let productsCache: Product[] | null = null;

function getProductsData(): Product[] {
  if (!productsCache) productsCache = loadAllProducts();
  return productsCache;
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export async function fetchProducts(
  page = 1,
  search = '',
  filters: ProductFilters = {},
  sort: SortOption = 'rating',
): Promise<PaginatedResult<Product>> {
  const cacheKey = buildCacheKey('products-list', { page, search, filters, sort });
  return apiRequest(() => {
    let products = getProductsData();

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    if (filters.categories?.length) {
      products = products.filter((p) => filters.categories!.includes(p.category));
    }
    if (filters.brands?.length) {
      products = products.filter((p) => filters.brands!.includes(p.brand));
    }
    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    products = sortProducts(products, sort);

    const start = (page - 1) * ENV.PAGE_SIZE;
    const items = products.slice(start, start + ENV.PAGE_SIZE);

    return {
      items,
      total: products.length,
      page,
      pageSize: ENV.PAGE_SIZE,
      hasMore: start + ENV.PAGE_SIZE < products.length,
    };
  }, { cacheKey });
}

export async function fetchProductById(id: string): Promise<Product> {
  return apiRequest(() => {
    const product = getProductsData().find((p) => p.id === id);
    if (!product) throw new AppError('NOT_FOUND', 'Product not found');
    return product;
  }, { cacheKey: buildCacheKey('product', { id }) });
}

export function getCategories(): string[] {
  return [...new Set(getProductsData().map((p) => p.category))];
}

export function getBrands(): string[] {
  return [...new Set(getProductsData().map((p) => p.brand))];
}
