import React, { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../../../design-system/components/Card';
import { Badge } from '../../../design-system/components/Badge';
import { LoadingSpinner } from '../../../design-system/components/LoadingSpinner';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { fetchHealthRecordById, getRecordTypeLabel } from '../services/healthRecordsService';
import type { HealthRecord } from '../types';
import type { HealthRecordsStackParamList } from '../../../navigation/types';
import { useTranslation } from '../../../localization/i18n';
import { formatDate } from '../../../shared/utils/format';

type Props = NativeStackScreenProps<HealthRecordsStackParamList, 'RecordDetail'>;

export function HealthRecordDetailScreen({ route }: Props) {
  const { recordId } = route.params;
  const { colors, spacing, typography, radii } = useTheme();
  const { t } = useTranslation();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthRecordById(recordId).then(setRecord).finally(() => setLoading(false));
  }, [recordId]);

  if (loading || !record) return <LoadingSpinner />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <Badge label={getRecordTypeLabel(record.type)} variant="primary" />
      <Text style={[typography.h1, { color: colors.text, marginTop: 12 }]}>{record.title}</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: 8 }]}>
        {formatDate(record.date)} · {record.doctorName}
      </Text>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{record.facility}</Text>

      {record.allergen && (
        <Card style={{ marginTop: spacing.lg, backgroundColor: colors.warning + '12' }} elevated={false}>
          <Text style={[typography.bodyMedium, { color: colors.text }]}>
            Allergen: {record.allergen} ({record.severity})
          </Text>
        </Card>
      )}
      {record.vaccineName && (
        <Card style={{ marginTop: spacing.md, backgroundColor: colors.success + '12' }} elevated={false}>
          <Text style={[typography.bodyMedium, { color: colors.text }]}>
            Vaccine: {record.vaccineName} (Dose {record.doseNumber})
          </Text>
        </Card>
      )}

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={[typography.body, { color: colors.text, lineHeight: 24 }]}>{record.notes}</Text>
      </Card>

      <View style={styles.tags}>
        {record.tags.map((tag) => (
          <Badge key={tag} label={tag} variant="neutral" />
        ))}
      </View>

      {record.attachments && record.attachments.length > 0 && (
        <View style={{ marginTop: spacing.xl }}>
          <Text style={[typography.overline, { color: colors.textMuted, marginBottom: spacing.sm }]}>{t('attachments')}</Text>
          {record.attachments.map((att) => (
            <Card key={att.id} style={{ marginBottom: spacing.sm }} padding="sm">
              {att.type === 'image' ? (
                <Image source={{ uri: att.url }} style={[styles.attachmentImage, { borderRadius: radii.md }]} />
              ) : (
                <View style={[styles.pdfThumb, { backgroundColor: colors.background, borderRadius: radii.sm }]}>
                  <Text style={{ fontSize: 32 }}>📄</Text>
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>PDF</Text>
                </View>
              )}
              <Text
                style={[typography.bodyMedium, { color: colors.primary, marginTop: spacing.sm }]}
                onPress={() => Linking.openURL(att.url)}
                accessibilityRole="link"
              >
                {att.name}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  attachmentImage: { width: '100%', height: 280 },
  pdfThumb: { width: 80, height: 100, alignItems: 'center', justifyContent: 'center' },
});
