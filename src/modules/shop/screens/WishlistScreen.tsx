import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { EmptyState, LoadingSpinner } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useShopStore } from '../store/shopStore';
import { fetchProductById } from '../services/shopService';
import type { Product } from '../types';
import type { ShopStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../localization/i18n';
import { formatCurrency } from '../../../shared/utils/format';

type Props = NativeStackScreenProps<ShopStackParamList, 'Wishlist'>;
export function WishlistScreen({ navigation }: Props) {
  const { colors, spacing, typography, radii } = useTheme();
  const { t } = useTranslation();
  const wishlist = useShopStore((s) => s.wishlist);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const addToCart = useShopStore((s) => s.addToCart);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(wishlist.map((id) => fetchProductById(id).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .finally(() => setLoading(false));
  }, [wishlist]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <Pressable onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}>
        <Card style={{ marginBottom: spacing.sm }}>
          <View style={styles.row}>
            <Image source={{ uri: item.imageUrl }} style={[styles.thumb, { borderRadius: radii.sm }]} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[typography.h3, { color: colors.primary, marginTop: 6 }]}>{formatCurrency(item.price)}</Text>
            </View>
            <Pressable onPress={() => toggleWishlist(item.id)} hitSlop={8}>
              <Ionicons name="heart" size={22} color={colors.error} />
            </Pressable>
          </View>
          <Button title={t('addToCart')} size="sm" variant="secondary" onPress={() => addToCart(item.id)} style={{ marginTop: 12 }} />
        </Card>
      </Pressable>
    ),
    [colors, typography, radii, navigation, addToCart, toggleWishlist, spacing.sm, t],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.md }]}>
      <FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title={t('wishlistEmpty')} icon="heart-outline" />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 64, height: 64 },
});
