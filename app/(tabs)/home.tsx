import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SectionList,
  SectionListRenderItem,
  SectionListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Spacing } from '@/theme/designSystem';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Trip, TripSection } from '@/types/trip';
import { mockTrips } from '@/data/mockTrips';
import { plannedTripCards } from '@/data/mockApp';
import { groupTripsBySection } from '@/utils/date';
import { Header } from '../../features/home/components/Header';
import { TripCard } from '../../features/home/components/TripCard';
import { SectionHeader } from '../../features/home/components/SectionHeader';
import { PinnedSection } from '../../features/home/components/PinnedSection';
import { HOME_TIMELINE_STICKY_SECTION_HEADERS } from '../../features/home/components/homeTimelineModel';
import SortMenu from '../../src/components/ui/SortMenu';

export default function HomeTab() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const [selectedTab, setSelectedTab] = useState<'visited' | 'planned'>('visited');
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'edited' | 'created'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const sectionListRef = useRef<SectionList<Trip, TripSection>>(null);
  const sortButtonRef = useRef<any>(null);

  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  // 分离pinned和unpinned trips
  const visibleTrips = useMemo(
    () => selectedTab === 'visited' ? trips : plannedTripCards,
    [selectedTab, trips],
  );
  const pinnedTrips = useMemo(() => visibleTrips.filter(trip => trip.isPinned), [visibleTrips]);
  const unpinnedTrips = useMemo(() => visibleTrips.filter(trip => !trip.isPinned), [visibleTrips]);
  
  const sections = useMemo(() => groupTripsBySection(unpinnedTrips, sortBy, order), [unpinnedTrips, sortBy, order]);

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
    router.push('/search');
  };

  const handleSort = () => {
    setSortMenuVisible(true);
  };

  const handleSortByChange = (newSortBy: 'edited' | 'created') => {
    setSortBy(newSortBy);
  };

  const handleOrderChange = (newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
  };

  const handleViewChange = () => {
    router.push({ pathname: '/(tabs)/calendar', params: { mode: selectedTab } });
  };

  const handlePinToggle = (tripId: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId 
          ? { ...trip, isPinned: !trip.isPinned }
          : trip
      )
    );
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
  };

  const renderSectionHeader = useCallback(({ section }: { section: TripSection }) => (
    <SectionHeader title={section.title} />
  ), []);

  const renderTripItem: SectionListRenderItem<Trip, TripSection> = useCallback(({ item }) => (
    <TripCard
      trip={item}
      onPinToggle={handlePinToggle}
      onDelete={handleDeleteTrip}
    />
  ), [handlePinToggle, handleDeleteTrip]);

  return (
    <LinearGradient
      colors={[palette.backgroundTop, mode === 'dark' ? '#101f1b' : '#E3EDDC', palette.backgroundBottom]}
      locations={[0, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Header
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          onSort={handleSort}
          onViewChange={handleViewChange}
          sortButtonRef={sortButtonRef}
        />

        <SortMenu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={sortButtonRef.current}
          sortBy={sortBy}
          order={order}
          onSortByChange={handleSortByChange}
          onOrderChange={handleOrderChange}
        />

        <SectionList<Trip, TripSection>
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderTripItem}
          stickySectionHeadersEnabled={HOME_TIMELINE_STICKY_SECTION_HEADERS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <PinnedSection
              pinnedTrips={pinnedTrips}
              onPinToggle={handlePinToggle}
              onDelete={handleDeleteTrip}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={palette.text}
            />
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', },
  listContent: {
    paddingBottom: 100, // 为底部导航栏和add button留出空间
    paddingTop: Spacing.sm,
  },
});

