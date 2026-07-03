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
import { LoadingSpinner, EmptyState } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useTranslation } from '../../../localization/i18n';
import { fetchDoctors, getCities, getSpecializations } from '../services/consultationService';
import type { Doctor, DoctorFilters } from '../types';
import type { ConsultationStackParamList } from '../../../navigation/types';
import { formatCurrency } from '../../../shared/utils/format';
import { useConsultationStore } from '../store/consultationStore';
import { getUpcomingBookings } from '../utils/bookings';

type Props = NativeStackScreenProps<ConsultationStackParamList, 'DoctorList'>;

const DoctorCard = React.memo(function DoctorCard({
  doctor,
  onPress,
}: {
  doctor: Doctor;
  onPress: () => void;
}) {
  const { colors, typography, radii } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ marginBottom: 12 }}>
      <Card>
        <View style={styles.cardRow}>
          <Image source={{ uri: doctor.imageUrl }} style={[styles.avatar, { borderRadius: radii.md }]} />
          <View style={styles.cardContent}>
            <Text style={[typography.bodyMedium, { color: colors.text }]}>{doctor.name}</Text>
            <Badge label={doctor.specialization} variant="primary" style={{ marginTop: 6 }} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
              {doctor.city} · {doctor.experience} yrs
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.rating}>
                <Ionicons name="star" size={13} color={colors.warning} />
                <Text style={[typography.caption, { color: colors.text, marginLeft: 4, fontWeight: '700' }]}>
                  {doctor.rating}
                </Text>
              </View>
              <Text style={[typography.bodyMedium, { color: colors.primary }]}>
                {formatCurrency(doctor.consultationFee)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </Card>
    </Pressable>
  );
});

export function DoctorListScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const loadBookings = useConsultationStore((s) => s.loadBookings);
  const bookings = useConsultationStore((s) => s.bookings);
  const upcoming = useMemo(() => getUpcomingBookings(bookings), [bookings]);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<DoctorFilters>({});
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search);
  const specializations = useMemo(() => getSpecializations(), []);
  const cities = useMemo(() => getCities().slice(0, 5), []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const loadDoctors = useCallback(async (pageNum: number, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const result = await fetchDoctors(pageNum, debouncedSearch, filters);
      setDoctors((prev) => (reset ? result.items : [...prev, ...result.items]));
      setHasMore(result.hasMore);
      setPage(pageNum);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => { loadDoctors(1, true); }, [loadDoctors]);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <DoctorCard doctor={item} onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })} />
    ),
    [navigation],
  );

  if (loading && doctors.length === 0) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('consult')} subtitle={t('consultSubtitle')} />
      <View style={{ paddingHorizontal: spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={t('searchDoctors')} />
        {upcoming.length > 0 && (
          <Pressable onPress={() => navigation.navigate('UpcomingConsultations')} accessibilityRole="button">
            <Card style={{ marginBottom: spacing.sm, backgroundColor: colors.primary + '08' }} elevated={false}>
              <View style={styles.upcomingRow}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: '700', flex: 1, marginLeft: 10 }}>
                  {upcoming.length} {t('upcoming')}
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primary} />
              </View>
            </Card>
          </Pressable>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip
            label={t('availableToday')}
            selected={!!filters.availableToday}
            onPress={() => setFilters((f) => ({ ...f, availableToday: !f.availableToday || undefined }))}
          />
          {specializations.slice(0, 4).map((s) => (
            <FilterChip
              key={s}
              label={s}
              selected={filters.specialization === s}
              onPress={() => setFilters((f) => ({ ...f, specialization: f.specialization === s ? undefined : s }))}
            />
          ))}
          {cities.map((c) => (
            <FilterChip
              key={c}
              label={c}
              selected={filters.city === c}
              onPress={() => setFilters((f) => ({ ...f, city: f.city === c ? undefined : c }))}
            />
          ))}
        </ScrollView>
      </View>
      <FlashList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={() => hasMore && !loadingMore && loadDoctors(page + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyState title={t('noResults')} icon="medical-outline" />}
        ListFooterComponent={loadingMore ? <LoadingSpinner message={t('loadingMore')} /> : null}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 72, height: 72, marginRight: 14 },
  cardContent: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  upcomingRow: { flexDirection: 'row', alignItems: 'center' },
});
