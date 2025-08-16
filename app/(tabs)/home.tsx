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
  const sectionListRef = useRef<SectionList>(null);

  const sections = groupTripsBySection(trips);

  const handleTabChange = (tab: 'visited' | 'planned') => {
    setSelectedTab(tab);
    // TODO: 切换到 Planned 标签页的逻辑
    if (tab === 'planned') {
      Alert.alert('Coming Soon', 'Planned trips feature will be available soon!');
      setSelectedTab('visited'); // 暂时保持选中 visited
    }
  };



  const handleAddNewTrip = useCallback(() => {
    const newTrip: Trip = {
      id: `new-${Date.now()}`,
      title: 'New Trip',
      location: 'Location',
      createdAt: new Date().toISOString(),
      displayDate: new Date().toISOString(),
      photos: [],
      audioCount: 0,
      videoCount: 0,
      isSaved: false,
      isLocked: false,
    };

    setTrips(prevTrips => [newTrip, ...prevTrips]);

    // 滚动到新卡片位置
    setTimeout(() => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
      });
    }, 100);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    Alert.alert('Search', 'Search functionality coming soon!');
  };

  const handleSort = () => {
    Alert.alert('Sort', 'Sort functionality coming soon!');
  };

  const handleViewChange = () => {
    Alert.alert('View Change', 'View change functionality coming soon!');
  };

  const renderSectionHeader = useCallback(({ section }: { section: TripSection }) => (
    <SectionHeader title={section.title} />
  ), []);

  const renderTripItem: SectionListRenderItem<Trip> = useCallback(({ item, section }) => (
    <TripCard
      trip={item}
      showGroupLabel={true}
      groupLabel={section.title}
    />
  ), []);

  const renderSectionItem = useCallback(({ item, index }: SectionListRenderItemInfo<Trip>) => (
    <View key={item.id}>
      {renderTripItem({ item, index, section: { title: '', data: [] } })}
    </View>
  ), [renderTripItem]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onViewChange={handleViewChange}
      />
      
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
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
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDefault,
  },
  listContent: {
    paddingBottom: 80, // 为底部导航栏留出空间
    paddingTop: Spacing.sm,
  },
});


