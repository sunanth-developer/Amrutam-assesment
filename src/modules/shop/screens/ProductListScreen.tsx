import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchBar } from '../../../design-system/components/SearchBar';
import { FilterChip } from '../../../design-system/components/FilterChip';
import { ScreenHeader } from '../../../design-system/components/ScreenHeader';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { Button } from '../../../design-system/components/Button';
import { QuantityStepper } from '../../../design-system/components/QuantityStepper';
import { LoadingSpinner, EmptyState } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useTranslation } from '../../../localization/i18n';
import { fetchProducts, getCategories } from '../services/shopService';
import { useShopStore, selectCartCount } from '../store/shopStore';
import type { Product, ProductFilters, SortOption } from '../types';
import type { ShopStackParamList } from '../../../navigation/types';
import { formatCurrency } from '../../../shared/utils/format';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

const SORT_OPTIONS = (t: ReturnType<typeof useTranslation>['t']) => [
  { label: t('rating'), value: 'rating' as const },
  { label: t('priceAsc'), value: 'price_asc' as const },
  { label: t('priceDesc'), value: 'price_desc' as const },
  { label: t('name'), value: 'name' as const },
];

const ProductCard = React.memo(function ProductCard({
  product,
  onPress,
  quantity,
  onIncrement,
  onDecrement,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  onPress: () => void;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const { colors, typography, radii } = useTheme();
  const { t } = useTranslation();
  const inCart = quantity > 0;

  return (
    <Pressable onPress={onPress} style={styles.cardWrap} accessibilityRole="button">
      <Card padding="sm">
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.imageUrl }} style={[styles.image, { borderRadius: radii.md }]} />
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            style={[styles.heartBtn, { backgroundColor: colors.surface + 'E6', borderRadius: radii.full }]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={18} color={isWishlisted ? colors.error : colors.textSecondary} />
          </Pressable>
        </View>
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: 10 }]}>{product.brand}</Text>
        <Text style={[typography.bodyMedium, { color: colors.text, marginTop: 2 }]} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={[typography.h3, { color: colors.primary }]}>{formatCurrency(product.price)}</Text>
          {product.rating > 0 && (
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={[typography.caption, { marginLeft: 3 }]}>{product.rating}</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          {inCart ? (
            <QuantityStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} disabled={!product.inStock} compact />
          ) : (
            <Button title={t('add')} size="sm" onPress={onIncrement} disabled={!product.inStock} style={{ flex: 1 }} />
          )}
        </View>
      </Card>
    </Pressable>
  );
});

export function ProductListScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const cart = useShopStore((s) => s.cart);
  const wishlist = useShopStore((s) => s.wishlist);
  const loadPersisted = useShopStore((s) => s.loadPersisted);
  const addToCart = useShopStore((s) => s.addToCart);
  const updateQuantity = useShopStore((s) => s.updateQuantity);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>('rating');
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search);
  const categories = useMemo(() => getCategories(), []);
  const cartCount = selectCartCount(cart);

  useEffect(() => { loadPersisted(); }, [loadPersisted]);

  const loadProducts = useCallback(async (pageNum: number, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const result = await fetchProducts(pageNum, debouncedSearch, filters, sort);
      setProducts((prev) => (reset ? result.items : [...prev, ...result.items]));
      setHasMore(result.hasMore);
      setPage(pageNum);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, filters, sort]);

  useEffect(() => { loadProducts(1, true); }, [loadProducts]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      const quantity = cart.find((c) => c.productId === item.id)?.quantity ?? 0;
      return (
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          quantity={quantity}
          onIncrement={() => addToCart(item.id)}
          onDecrement={() => updateQuantity(item.id, quantity - 1)}
          isWishlisted={wishlist.includes(item.id)}
          onToggleWishlist={() => toggleWishlist(item.id)}
        />
      );
    },
    [navigation, cart, wishlist, addToCart, updateQuantity, toggleWishlist],
  );

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('shop')}
        subtitle={t('shopSubtitle')}
        right={
          <Pressable onPress={() => navigation.navigate('Cart')} style={styles.cartBtn} accessibilityLabel={`Cart, ${cartCount} items`}>
            <Ionicons name="bag-handle-outline" size={26} color={colors.text} />
            {cartCount > 0 && <Badge label={cartCount} variant="error" style={styles.cartBadge} />}
          </Pressable>
        }
      />
      <View style={{ paddingHorizontal: spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={t('searchProducts')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {SORT_OPTIONS(t).map((opt) => (
            <FilterChip key={opt.value} label={opt.label} selected={sort === opt.value} onPress={() => setSort(opt.value)} />
          ))}
          <FilterChip label={t('inStock')} selected={!!filters.inStockOnly} onPress={() => setFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly || undefined }))} />
          {categories.slice(0, 5).map((c) => (
            <FilterChip
              key={c}
              label={c}
              selected={filters.categories?.includes(c) ?? false}
              onPress={() =>
                setFilters((f) => {
                  const cats = f.categories ?? [];
                  const updated = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c];
                  return { ...f, categories: updated.length ? updated : undefined };
                })
              }
            />
          ))}
        </ScrollView>
        <Pressable onPress={() => navigation.navigate('Wishlist')} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('wishlist')} →</Text>
        </Pressable>
      </View>
      <FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={wishlist}
        numColumns={2}
        onEndReached={() => hasMore && !loadingMore && loadProducts(page + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyState title={t('noResults')} icon="bag-handle-outline" />}
        contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrap: { flex: 1, margin: 6 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 130 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  actions: { marginTop: 10 },
  cartBtn: { padding: 8, position: 'relative' },
  cartBadge: { position: 'absolute', top: 0, right: 0, minWidth: 20, alignItems: 'center' },
});
