import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { QuantityStepper } from '../../../design-system/components/QuantityStepper';
import { EmptyState } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useShopStore } from '../store/shopStore';
import type { CartItemWithProduct } from '../types';
import type { ShopStackParamList } from '../../../navigation/types';
import { calculateCartTotal, formatCurrency } from '../../../shared/utils/format';
import { useTranslation } from '../../../localization/i18n';

type Props = NativeStackScreenProps<ShopStackParamList, 'Cart'>;

export function CartScreen({ navigation }: Props) {
  const { colors, spacing, typography, radii, shadows } = useTheme();
  const { t } = useTranslation();
  const getCartWithProducts = useShopStore((s) => s.getCartWithProducts);
  const updateQuantity = useShopStore((s) => s.updateQuantity);
  const removeFromCart = useShopStore((s) => s.removeFromCart);

  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  const refresh = useCallback(async () => {
    setItems(await getCartWithProducts());
  }, [getCartWithProducts]);

  useEffect(() => { refresh(); }, [refresh]);

  const total = calculateCartTotal(items);

  const renderItem = ({ item }: { item: CartItemWithProduct }) => (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={styles.itemRow}>
        <Image source={{ uri: item.product.imageUrl }} style={[styles.thumb, { borderRadius: radii.sm }]} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.bodyMedium, { color: colors.text }]} numberOfLines={2}>{item.product.name}</Text>
          <Text style={[typography.h3, { color: colors.primary, marginTop: 6 }]}>{formatCurrency(item.product.price)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={() => updateQuantity(item.productId, item.quantity + 1).then(refresh)}
          onDecrement={() => updateQuantity(item.productId, item.quantity - 1).then(refresh)}
        />
        <Pressable onPress={() => removeFromCart(item.productId).then(refresh)}>
          <Text style={[typography.caption, { color: colors.error, fontWeight: '600' }]}>{t('remove')}</Text>
        </Pressable>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={<EmptyState title={t('cartEmpty')} subtitle={t('cartEmptySubtitle')} icon="bag-handle-outline" />}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 140 }}
      />
      {items.length > 0 && (
        <View style={[styles.footer, shadows.lg, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <View style={styles.totalRow}>
            <Text style={[typography.body, { color: colors.textSecondary }]}>{t('total')}</Text>
            <Text style={[typography.h2, { color: colors.text }]}>{formatCurrency(total)}</Text>
          </View>
          <Button title={t('checkout')} onPress={() => navigation.navigate('Checkout')} size="lg" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 64, height: 64 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28, borderTopWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
});
