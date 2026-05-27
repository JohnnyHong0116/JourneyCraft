import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Icon, SemanticIcon } from '@/components/Icon';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { useTranslation } from '@/i18n/useTranslation';

const { width: screenWidth } = Dimensions.get('window');

interface HeaderProps {
  selectedTab: 'visited' | 'planned';
  onTabChange: (tab: 'visited' | 'planned') => void;
  onSearch: () => void;
  onSort: () => void;
  onViewChange: () => void;
  sortButtonRef?: React.RefObject<any>;
}

export const Header: React.FC<HeaderProps> = ({
  selectedTab,
  onTabChange,
  onSearch,
  onSort,
  onViewChange,
  sortButtonRef,
}) => {
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.appTitle}>JourneyCraft</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity accessibilityLabel={t('home.search')} style={styles.iconButton} onPress={onSearch} activeOpacity={0.7}>
            <SemanticIcon name="search-outline" size={21} color={palette.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            ref={sortButtonRef}
            accessibilityLabel={t('home.sort')}
            style={styles.iconButton} 
            onPress={onSort} 
            activeOpacity={0.7}
          >
            <Icon name="sort" size={21} color={palette.text} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel={t('home.calendarView')} style={styles.iconButton} onPress={onViewChange} activeOpacity={0.7}>
            <SemanticIcon name="calendar-outline" size={21} color={palette.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.segmentedControl}>
        <TouchableOpacity style={[styles.segment, selectedTab === 'visited' && styles.activeSegment]} onPress={() => onTabChange('visited')} activeOpacity={0.8}>
          <Text style={[styles.segmentText, selectedTab === 'visited' && styles.activeSegmentText]}>{t('common.visited')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segment, selectedTab === 'planned' && styles.activeSegment]} onPress={() => onTabChange('planned')} activeOpacity={0.8}>
          <Text style={[styles.segmentText, selectedTab === 'planned' && styles.activeSegmentText]}>{t('common.planned')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  container: { backgroundColor: 'transparent', paddingTop: Spacing.lg, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg, },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, },
  appTitle: { fontSize: 32, fontWeight: '700', color: palette.text, letterSpacing: 0, },
  headerIcons: { flexDirection: 'row', gap: Spacing.sm, },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: palette.cardMuted, justifyContent: 'center', alignItems: 'center' },
  segmentedControl: { flexDirection: 'row', backgroundColor: palette.cardMuted, borderRadius: BorderRadius.lg, padding: 4, gap: 4, },
  segment: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', },
  activeSegment: { backgroundColor: palette.card, ...Shadows.small, },
  segmentText: { fontSize: Typography.fontSize.md, fontWeight: '600', color: palette.secondaryText, },
  activeSegmentText: { color: palette.text, fontWeight: '700', },
});
