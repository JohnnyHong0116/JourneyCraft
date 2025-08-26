import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import {
  Icon
} from '@/components/Icon';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';

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
  const colorScheme = useColorScheme() || 'light';
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.appTitle}>JourneyCraft</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={onSearch} activeOpacity={0.7}>
            <Icon name="circlesearch" size={30} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            ref={sortButtonRef}
            style={styles.iconButton} 
            onPress={onSort} 
            activeOpacity={0.7}
          >
            <Icon name="circlesort" size={30} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onViewChange} activeOpacity={0.7}>
            <Icon name="circlecalendarview" size={30} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.segmentedControl}>
        <TouchableOpacity style={[styles.segment, selectedTab === 'visited' && styles.activeSegment]} onPress={() => onTabChange('visited')} activeOpacity={0.8}>
          <Text style={[styles.segmentText, selectedTab === 'visited' && styles.activeSegmentText]}>Visited</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segment, selectedTab === 'planned' && styles.activeSegment]} onPress={() => onTabChange('planned')} activeOpacity={0.8}>
          <Text style={[styles.segmentText, selectedTab === 'planned' && styles.activeSegmentText]}>Planned</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.backgroundDefault, paddingTop: Spacing.lg, paddingBottom: Spacing.md, paddingHorizontal: Spacing.lg, },
  topSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, },
  appTitle: { fontSize: 32, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5, },
  headerIcons: { flexDirection: 'row', gap: Spacing.md, },
  iconButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', },
  headerIcon: { tintColor: Colors.textPrimary, } as any,
  segmentedControl: { flexDirection: 'row', backgroundColor: Colors.inputSearchBackground, borderRadius: BorderRadius.lg, padding: 4, gap: 4, },
  segment: { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', },
  activeSegment: { backgroundColor: Colors.white, ...Shadows.small, },
  segmentText: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textSecondary, },
  activeSegmentText: { color: Colors.textPrimary, fontWeight: '700', },
});
