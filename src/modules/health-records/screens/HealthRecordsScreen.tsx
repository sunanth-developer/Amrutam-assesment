import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SearchBar } from '../../../design-system/components/SearchBar';
import { FilterChip } from '../../../design-system/components/FilterChip';
import { ScreenHeader } from '../../../design-system/components/ScreenHeader';
import { LoadingSpinner, EmptyState } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { useTranslation } from '../../../localization/i18n';
import {
  fetchHealthRecords,
  getAllTags,
  getRecordTypeLabel,
  groupRecordsByMonthYear,
} from '../services/healthRecordsService';
import { RecordCard } from '../components/RecordCard';
import type { HealthRecord, HealthRecordFilters, HealthRecordType } from '../types';
import type { HealthRecordsStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<HealthRecordsStackParamList, 'RecordsList'>;

const RECORD_TYPES: HealthRecordType[] = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'];

function SectionHeader({ title }: { title: string }) {
  const { colors, typography, radii } = useTheme();
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <View style={[styles.sectionPill, { backgroundColor: colors.primary + '12', borderRadius: radii.full }]}>
        <View style={[styles.sectionDot, { backgroundColor: colors.primary }]} />
        <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>{title}</Text>
      </View>
      <View style={[styles.sectionLine, { backgroundColor: colors.borderLight }]} />
    </View>
  );
}

export function HealthRecordsScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<HealthRecordFilters>({});
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState(true);

  const debouncedSearch = useDebounce(search);
  const allTags = useMemo(() => getAllTags(), []);

  useEffect(() => {
    setLoading(true);
    fetchHealthRecords(1, debouncedSearch, filters)
      .then((result) => setRecords(result.items))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters]);

  const sections = useMemo(
    () => (grouped ? groupRecordsByMonthYear(records) : [{ title: t('allRecords'), data: records }]),
    [records, grouped, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: HealthRecord }) => (
      <RecordCard record={item} onPress={() => navigation.navigate('RecordDetail', { recordId: item.id })} />
    ),
    [navigation],
  );

  if (loading) return <LoadingSpinner />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('records')} subtitle={t('recordsSubtitle')} />
      <View style={{ paddingHorizontal: spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={t('searchRecords')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip label={t('groupByMonth')} selected={grouped} onPress={() => setGrouped((g) => !g)} />
          {RECORD_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={getRecordTypeLabel(type)}
              selected={filters.types?.includes(type) ?? false}
              onPress={() =>
                setFilters((f) => {
                  const types = f.types ?? [];
                  const updated = types.includes(type) ? types.filter((x) => x !== type) : [...types, type];
                  return { ...f, types: updated.length ? updated : undefined };
                })
              }
            />
          ))}
          {allTags.slice(0, 4).map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              selected={filters.tags?.includes(tag) ?? false}
              onPress={() =>
                setFilters((f) => {
                  const tags = f.tags ?? [];
                  const updated = tags.includes(tag) ? tags.filter((x) => x !== tag) : [...tags, tag];
                  return { ...f, tags: updated.length ? updated : undefined };
                })
              }
            />
          ))}
        </ScrollView>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
        ListEmptyComponent={<EmptyState title={t('noResults')} icon="document-text-outline" />}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: 100 }}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  sectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },
  sectionLine: { flex: 1, height: 1 },
});
