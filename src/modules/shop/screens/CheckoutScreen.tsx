import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useToast } from '../../../design-system/components/Toast';
import { useTranslation } from '../../../localization/i18n';
import { useShopStore } from '../store/shopStore';
import type { CartItemWithProduct } from '../types';
import type { ShopStackParamList } from '../../../navigation/types';
import { calculateCartTotal, formatCurrency } from '../../../shared/utils/format';

type Props = NativeStackScreenProps<ShopStackParamList, 'Checkout'>;

export function CheckoutScreen({ navigation }: Props) {
  const { colors, spacing, typography } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const getCartWithProducts = useShopStore((s) => s.getCartWithProducts);
  const clearCart = useShopStore((s) => s.clearCart);
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  useEffect(() => {
    getCartWithProducts().then(setItems);
  }, [getCartWithProducts]);

  const subtotal = calculateCartTotal(items);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    await clearCart();
    showToast(t('orderPlaced'), 'success');
    navigation.navigate('ProductList');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <Card>
        <Text style={[typography.overline, { color: colors.textMuted }]}>{t('orderSummary')}</Text>
        {items.map((item) => (
          <View key={item.productId} style={styles.row}>
            <Text style={[typography.body, { color: colors.text, flex: 1 }]} numberOfLines={1}>
              {item.product.name} ×{item.quantity}
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.text }]}>
              {formatCurrency(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
        <View style={styles.row}>
          <Text style={{ color: colors.textSecondary }}>{t('subtotal')}</Text>
          <Text style={{ color: colors.text }}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={{ color: colors.textSecondary }}>{t('shipping')}</Text>
          <Text style={{ color: shipping === 0 ? colors.success : colors.text }}>
            {shipping === 0 ? t('free') : formatCurrency(shipping)}
          </Text>
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <Text style={[typography.h3, { color: colors.text }]}>{t('total')}</Text>
          <Text style={[typography.h2, { color: colors.primary }]}>{formatCurrency(total)}</Text>
        </View>
      </Card>
      <Button title={t('placeOrder')} onPress={handlePlaceOrder} size="lg" style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  divider: { height: 1, marginVertical: 16 },
});
