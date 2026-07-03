import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { EmptyState } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useToast } from '../../../design-system/components/Toast';
import { useConsultationStore } from '../store/consultationStore';
import { getUpcomingBookings } from '../utils/bookings';
import type { Booking } from '../types';
import type { ConsultationStackParamList } from '../../../navigation/types';
import { formatDate, formatTime } from '../../../shared/utils/format';
import { useTranslation } from '../../../localization/i18n';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'UpcomingConsultations'>;

export function UpcomingConsultationsScreen({}: Props) {
  const { colors, spacing, typography } = useTheme();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const allBookings = useConsultationStore((s) => s.bookings);
  const bookings = useMemo(() => getUpcomingBookings(allBookings), [allBookings]);
  const cancelBooking = useConsultationStore((s) => s.cancelBooking);

  const handleCancel = async (id: string) => {
    await cancelBooking(id);
    showToast(t('bookingCancelled'), 'info');
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '12' }]}>
          <Ionicons name="medical" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[typography.bodyMedium, { color: colors.text }]}>{item.doctorName}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
            {formatDate(item.date)} · {formatTime(item.startTime)} – {formatTime(item.endTime)}
          </Text>
        </View>
        <Badge
          label={item.status === 'pending_sync' ? t('syncing') : t('confirmed')}
          variant={item.status === 'pending_sync' ? 'warning' : 'success'}
        />
      </View>
      <Button title={t('cancel')} variant="outline" size="sm" onPress={() => handleCancel(item.id)} style={{ marginTop: spacing.md }} />
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.md }]}>
      <FlashList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title={t('noUpcoming')} subtitle={t('noUpcomingSubtitle')} icon="calendar-outline" />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
