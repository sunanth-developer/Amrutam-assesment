import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { LoadingSpinner } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useToast } from '../../../design-system/components/Toast';
import { fetchProductById } from '../services/shopService';
import { useShopStore } from '../store/shopStore';
import type { Product } from '../types';
import type { ShopStackParamList } from '../../../navigation/types';
import { formatCurrency } from '../../../shared/utils/format';
import { useTranslation } from '../../../localization/i18n';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { colors, spacing, typography, radii } = useTheme();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const wishlisted = useShopStore((s) => s.wishlist.includes(productId));

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductById(productId).then(setProduct).finally(() => setLoading(false));
  }, [productId]);

  if (loading || !product) return <LoadingSpinner />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={{ uri: product.imageUrl }} style={[styles.image, { borderRadius: radii.xl }]} />
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.overline, { color: colors.textMuted }]}>{product.brand}</Text>
        <Text style={[typography.h1, { color: colors.text, marginTop: 6 }]}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={[typography.h1, { color: colors.primary }]}>{formatCurrency(product.price)}</Text>
          {product.originalPrice && (
            <Text style={[typography.body, { color: colors.textMuted, textDecorationLine: 'line-through', marginLeft: 10 }]}>
              {formatCurrency(product.originalPrice)}
            </Text>
          )}
        </View>

        <View style={styles.badges}>
          <Badge label={`${product.rating} ★`} variant="warning" />
          <Badge label={`${product.reviewCount} reviews`} variant="neutral" />
          {product.inStock ? <Badge label={t('inStockBadge')} variant="success" /> : <Badge label={t('outOfStock')} variant="error" />}
        </View>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.body, { color: colors.textSecondary, lineHeight: 24 }]}>{product.description}</Text>
        </Card>

        <View style={[styles.actions, { marginTop: spacing.xl }]}>
          <Button
            title={wishlisted ? t('saved') : t('wishlist')}
            variant="outline"
            onPress={() => toggleWishlist(productId)}
            style={{ flex: 1 }}
          />
          <Button
            title={t('addToCart')}
            onPress={() => { addToCart(productId); showToast(t('addedToCart'), 'success'); }}
            disabled={!product.inStock}
            style={{ flex: 2 }}
          />
        </View>
        <Button title={t('cart')} variant="ghost" onPress={() => navigation.navigate('Cart')} style={{ marginTop: spacing.sm }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '92%', height: 300, alignSelf: 'center', marginTop: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  actions: { flexDirection: 'row', gap: 10 },
});
