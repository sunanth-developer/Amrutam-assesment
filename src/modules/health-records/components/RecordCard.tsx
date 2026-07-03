import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../design-system/theme/ThemeProvider';
import { Badge } from '../../../design-system/components/Badge';
import { getRecordTypeLabel } from '../services/healthRecordsService';
import type { HealthRecord, HealthRecordType } from '../types';
import { formatDate } from '../../../shared/utils/format';

const TYPE_CONFIG: Record<
  HealthRecordType,
  { icon: keyof typeof Ionicons.glyphMap; accent: string }
> = {
  lab_report: { icon: 'flask', accent: '#3B9EFF' },
  prescription: { icon: 'medkit', accent: '#1A7A55' },
  consultation: { icon: 'chatbubbles', accent: '#7C5CBF' },
  vaccination: { icon: 'shield-checkmark', accent: '#30A46C' },
  allergy: { icon: 'warning', accent: '#E5484D' },
};

export const RecordCard = React.memo(function RecordCard({
  record,
  onPress,
}: {
  record: HealthRecord;
  onPress: () => void;
}) {
  const { colors, typography, radii, shadows, spacing } = useTheme();
  const config = TYPE_CONFIG[record.type];
  const attachment = record.attachments?.[0];
  const extraAttachments = (record.attachments?.length ?? 0) - 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${record.title}, ${getRecordTypeLabel(record.type)}`}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.92 : 1 }]}
    >
      <View
        style={[
          styles.card,
          shadows.sm,
          {
            backgroundColor: colors.card,
            borderRadius: radii.lg,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <View style={[styles.accentBar, { backgroundColor: config.accent }]} />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={[styles.iconCircle, { backgroundColor: config.accent + '18' }]}>
              <Ionicons name={config.icon} size={20} color={config.accent} />
            </View>
            <View style={styles.topText}>
              <Text style={[typography.overline, { color: config.accent }]}>
                {getRecordTypeLabel(record.type)}
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                {formatDate(record.date)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>

          <Text style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]} numberOfLines={2}>
            {record.title}
          </Text>

          <View style={[styles.metaBlock, { backgroundColor: colors.background, borderRadius: radii.sm }]}>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
              <Text style={[typography.caption, { color: colors.textSecondary, flex: 1, marginLeft: 6 }]} numberOfLines={1}>
                {record.doctorName}
              </Text>
            </View>
            <View style={[styles.metaRow, { marginTop: 6 }]}>
              <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
              <Text style={[typography.caption, { color: colors.textMuted, flex: 1, marginLeft: 6 }]} numberOfLines={1}>
                {record.facility}
              </Text>
            </View>
          </View>

          {(record.tags.length > 0 || attachment) && (
            <View style={styles.footer}>
              <View style={styles.tags}>
                {record.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} label={tag} variant="neutral" />
                ))}
                {record.tags.length > 2 && (
                  <Text style={[typography.caption, { color: colors.textMuted }]}>+{record.tags.length - 2}</Text>
                )}
              </View>

              {attachment && (
                <View style={styles.thumbWrap}>
                  {attachment.type === 'image' ? (
                    <Image
                      source={{ uri: attachment.thumbnailUrl }}
                      style={[styles.thumbnail, { borderRadius: radii.sm }]}
                    />
                  ) : (
                    <View style={[styles.pdfThumb, { backgroundColor: config.accent + '12', borderRadius: radii.sm }]}>
                      <Ionicons name="document-text" size={22} color={config.accent} />
                    </View>
                  )}
                  {extraAttachments > 0 && (
                    <View style={[styles.moreBadge, { backgroundColor: colors.primary, borderRadius: radii.full }]}>
                      <Text style={styles.moreText}>+{extraAttachments}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  card: { borderWidth: 1, overflow: 'hidden' },
  accentBar: { height: 3, width: '100%' },
  body: { padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topText: { flex: 1 },
  metaBlock: { marginTop: 12, padding: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  tags: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, flex: 1 },
  thumbWrap: { position: 'relative', marginLeft: 12 },
  thumbnail: { width: 52, height: 52 },
  pdfThumb: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  moreText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});
