import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Alert,
  SectionList,
  SectionListRenderItem,
  SectionListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/theme/designSystem';
import { Trip, TripSection } from '@/types/trip';
import { mockTrips } from '@/data/mockTrips';
import { groupTripsBySection } from '@/utils/date';
import { Header } from '../../features/home/components/Header';
import { TripCard } from '../../features/home/components/TripCard';
import { SectionHeader } from '../../features/home/components/SectionHeader';

export default function HomeTab() {
  const [selectedTab, setSelectedTab] = useState<'visited' | 'planned'>('visited');
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [refreshing, setRefreshing] = useState(false);
  const sectionListRef = useRef<SectionList<Trip, TripSection>>(null);

  const sections = groupTripsBySection(trips);

  const handleTabChange = (tab: 'visited' | 'planned') => {
    setSelectedTab(tab);
    // 这里可以添加切换逻辑
  };

  const handleAddNewTrip = useCallback(() => {
    router.push('/card/new' as any);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    // 搜索功能
  };

  const handleSort = () => {
    // 排序功能
  };

  const handleViewChange = () => {
    // 视图切换功能
  };

  const renderSectionHeader = useCallback(({ section }: { section: TripSection }) => (
    <SectionHeader title={section.title} />
  ), []);

  const renderTripItem: SectionListRenderItem<Trip, TripSection> = useCallback(({ item }) => (
    <TripCard
      trip={item}
    />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onViewChange={handleViewChange}
      />

      <SectionList<Trip, TripSection>
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderTripItem}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.black}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundDefault, },
  listContent: {
    paddingBottom: 80, // 为底部导航栏留出空间
    paddingTop: Spacing.sm,
  },
});


