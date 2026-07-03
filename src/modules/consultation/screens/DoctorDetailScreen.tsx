import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../../design-system/components/Button';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { LoadingSpinner } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useToast } from '../../../design-system/components/Toast';
import { fetchDoctorById, fetchDoctorSlots } from '../services/consultationService';
import { useConsultationStore } from '../store/consultationStore';
import type { Doctor, TimeSlot } from '../types';
import type { ConsultationStackParamList } from '../../../navigation/types';
import { formatCurrency, formatTime } from '../../../shared/utils/format';
import { getErrorMessage, AppError } from '../../../core/errors/AppError';
import { useTranslation } from '../../../localization/i18n';
import { formatSlotDayLabel, getAvailableDates, getSlotsForDate } from '../utils/slots';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorDetail'>;

export function DoctorDetailScreen({ route, navigation }: Props) {
  const { doctorId } = route.params;
  const { colors, spacing, typography, radii } = useTheme();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const bookConsultation = useConsultationStore((s) => s.bookConsultation);
  const bookings = useConsultationStore((s) => s.bookings);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const availableDates = useMemo(() => getAvailableDates(slots), [slots]);
  const slotsForSelectedDate = useMemo(
    () => (selectedDate ? getSlotsForDate(slots, selectedDate) : []),
    [slots, selectedDate],
  );

  const loadSlots = useCallback(async () => {
    const slotList = await fetchDoctorSlots(doctorId, bookings);
    setSlots(slotList);
    setSelectedDate((current) => {
      if (current && slotList.some((s) => s.date === current)) return current;
      return getAvailableDates(slotList)[0] ?? null;
    });
    setSelectedSlot((current) =>
      current && slotList.some((s) => s.id === current.id) ? current : null,
    );
  }, [doctorId, bookings]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDoctorById(doctorId), loadSlots()])
      .then(([doc]) => setDoctor(doc))
      .catch((e) => showToast(getErrorMessage(e), 'error'))
      .finally(() => setLoading(false));
  }, [doctorId, loadSlots, showToast]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) loadSlots().catch((e) => showToast(getErrorMessage(e), 'error'));
    }, [loading, loadSlots, showToast]),
  );

  const handleBook = useCallback(async () => {
    if (!doctor || !selectedSlot) return;
    setBooking(true);
    try {
      await bookConsultation(doctor, selectedSlot);
      await loadSlots();
      showToast(t('bookingSuccess'), 'success');
      navigation.navigate('UpcomingConsultations');
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      if (error instanceof AppError && ['SLOT_CONFLICT', 'SLOT_EXPIRED'].includes(error.code)) {
        await loadSlots();
      }
    } finally {
      setBooking(false);
    }
  }, [doctor, selectedSlot, bookConsultation, loadSlots, showToast, navigation]);

  if (loading || !doctor) return <LoadingSpinner />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={{ uri: doctor.imageUrl }} style={[styles.hero, { borderRadius: radii.xl }]} />
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: colors.text }]}>{doctor.name}</Text>
        <Badge label={doctor.specialization} variant="primary" style={{ marginTop: 10 }} />
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 12 }]}>
          {doctor.city} · {doctor.experience} years experience · ⭐ {doctor.rating}
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.overline, { color: colors.textMuted }]}>{t('fee')}</Text>
          <Text style={[typography.h2, { color: colors.primary, marginTop: 4 }]}>{formatCurrency(doctor.consultationFee)}</Text>
        </Card>

        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.lg, lineHeight: 24 }]}>{doctor.about}</Text>

        <Text style={[typography.h2, { color: colors.text, marginTop: spacing.xl }]}>{t('bookSlot')}</Text>

        {availableDates.length === 0 ? (
          <Text style={{ color: colors.textSecondary, marginTop: spacing.sm }}>{t('noSlotsAvailable')}</Text>
        ) : (
          <>
            <Text style={[typography.overline, { color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.sm }]}>{t('selectDate')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {availableDates.map((date) => {
                const { label, day } = formatSlotDayLabel(date);
                const isSelected = selectedDate === date;
                return (
                  <Pressable
                    key={date}
                    onPress={() => { setSelectedDate(date); setSelectedSlot(null); }}
                    style={[
                      styles.dateChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                        borderRadius: radii.md,
                      },
                    ]}
                  >
                    <Text style={[typography.caption, { color: isSelected ? colors.onPrimary : colors.textMuted, fontWeight: '700' }]}>{label}</Text>
                    <Text style={[typography.h3, { color: isSelected ? colors.onPrimary : colors.text, marginTop: 2 }]}>{day}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {selectedDate && (
              <>
                <Text style={[typography.overline, { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm }]}>{t('selectTime')}</Text>
                <View style={styles.timeGrid}>
                  {slotsForSelectedDate.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <Pressable
                        key={slot.id}
                        onPress={() => setSelectedSlot(slot)}
                        style={[
                          styles.timeChip,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.surface,
                            borderColor: isSelected ? colors.primary : colors.borderLight,
                            borderRadius: radii.sm,
                          },
                        ]}
                      >
                        <Text style={[typography.bodyMedium, { color: isSelected ? colors.onPrimary : colors.text }]}>
                          {formatTime(slot.startTime)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </>
        )}

        <Button title={t('bookNow')} onPress={handleBook} disabled={!selectedSlot || booking} size="lg" style={{ marginTop: spacing.xl }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { height: 240, marginHorizontal: 16, marginTop: 16, alignSelf: 'stretch' },
  dateRow: { gap: 10 },
  dateChip: { minWidth: 80, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, alignItems: 'center' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: { paddingVertical: 14, paddingHorizontal: 18, borderWidth: 1.5, minWidth: '28%' },
});
