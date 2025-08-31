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
import { Colors, Spacing } from '@/theme/designSystem';
import { Trip, TripSection } from '@/types/trip';
import { mockTrips } from '@/data/mockTrips';
import { groupTripsBySection } from '@/utils/date';
import { Header } from '../../features/home/components/Header';
import { TripCard } from '../../features/home/components/TripCard';
import { SectionHeader } from '../../features/home/components/SectionHeader';
import { PinnedSection } from '../../features/home/components/PinnedSection';
import SortMenu from '../../src/components/ui/SortMenu';

export default function HomeTab() {
  const [selectedTab, setSelectedTab] = useState<'visited' | 'planned'>('visited');
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'edited' | 'created'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const sectionListRef = useRef<SectionList<Trip, TripSection>>(null);
  const sortButtonRef = useRef<any>(null);

  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  // 分离pinned和unpinned trips
  const pinnedTrips = useMemo(() => trips.filter(trip => trip.isPinned), [trips]);
  const unpinnedTrips = useMemo(() => trips.filter(trip => !trip.isPinned), [trips]);
  
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
    // 搜索功能
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
    // 视图切换功能
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
      colors={[Colors.backgroundTop, '#E3EDDC', Colors.backgroundGreen]}
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
          stickySectionHeadersEnabled={true}
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
              tintColor={Colors.black}
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


