import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SectionList,
  SectionListRenderItem,
  SectionListRenderItemInfo,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/theme/designSystem';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Trip, TripSection } from '@/types/trip';
import type { PlannedTrip } from '@/types/plannedTrip';
import { mockTrips } from '@/data/mockTrips';
import { plannedTripCards } from '@/data/mockApp';
import { groupTripsBySection } from '@/utils/date';
import { Header } from '../../features/home/components/Header';
import { TripCard } from '../../features/home/components/TripCard';
import { SectionHeader } from '../../features/home/components/SectionHeader';
import { PinnedSection } from '../../features/home/components/PinnedSection';
import { HOME_TIMELINE_STICKY_SECTION_HEADERS } from '../../features/home/components/homeTimelineModel';
import { PlannedTripCard } from '../../features/planned/components/PlannedTripCard';
import { getUpcomingPlannedTrips } from '../../features/planned/plannedModel';
import { useTranslation } from '@/i18n/useTranslation';
import SortMenu from '../../src/components/ui/SortMenu';
import { resolveHomeTimelineMode, type HomeTimelineMode } from '../../features/search/homeSearchModel';
import { applyCompanionOverrides } from '../../features/people/peopleModel';
import { loadCompanionOverrides } from '../../features/people/peopleStorage';

export default function HomeTab() {
  const params = useLocalSearchParams<{ timelineMode?: HomeTimelineMode }>();
  const { mode, language } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const [selectedTab, setSelectedTab] = useState<HomeTimelineMode>(() => resolveHomeTimelineMode(params.timelineMode));
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'edited' | 'created'>('created');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const sectionListRef = useRef<SectionList<Trip, TripSection>>(null);
  const sortButtonRef = useRef<any>(null);

  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [plans, setPlans] = useState<PlannedTrip[]>(plannedTripCards);

  const pinnedTrips = useMemo(() => trips.filter(trip => trip.isPinned), [trips]);
  const unpinnedTrips = useMemo(() => trips.filter(trip => !trip.isPinned), [trips]);
  const upcomingPlans = useMemo(() => getUpcomingPlannedTrips(plans, new Date()), [plans]);
  const pinnedPlans = useMemo(() => upcomingPlans.filter((trip) => trip.isPinned), [upcomingPlans]);
  const unpinnedPlans = useMemo(() => upcomingPlans.filter((trip) => !trip.isPinned), [upcomingPlans]);
  
  const sections = useMemo(
    () => groupTripsBySection(unpinnedTrips, sortBy, order, language),
    [language, unpinnedTrips, sortBy, order],
  );
  const plannedSections = useMemo(
    () => groupTripsBySection(unpinnedPlans, sortBy, order, language),
    [language, unpinnedPlans, sortBy, order],
  );

  useEffect(() => {
    setSelectedTab(resolveHomeTimelineMode(params.timelineMode));
  }, [params.timelineMode]);

  useFocusEffect(useCallback(() => {
    let active = true;
    void loadCompanionOverrides().then((overrides) => {
      if (!active) return;
      setTrips((current) => applyCompanionOverrides(current, overrides));
      setPlans((current) => applyCompanionOverrides(current, overrides));
    });
    return () => { active = false; };
  }, []));

  const handleTabChange = (tab: HomeTimelineMode) => {
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
    router.push({ pathname: '/search', params: { timelineMode: selectedTab, origin: 'home' } });
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

  const toggleTripState = (tripId: string, field: 'isSaved' | 'isLocked') => {
    setTrips((current) => current.map((trip) => (
      trip.id === tripId ? { ...trip, [field]: !trip[field] } : trip
    )));
  };

  const handleMoodChange = (tripId: string, mood: Trip['mood']) => {
    setTrips((current) => current.map((trip) => trip.id === tripId ? { ...trip, mood } : trip));
  };

  const handleDeletePlan = (tripId: string) => {
    setPlans((current) => current.filter((trip) => trip.id !== tripId));
  };

  const togglePlanState = (tripId: string, field: 'isPinned' | 'isSaved' | 'isLocked') => {
    setPlans((current) => current.map((trip) => (
      trip.id === tripId ? { ...trip, [field]: !trip[field] } : trip
    )));
  };

  const renderSectionHeader = useCallback(({ section }: { section: TripSection }) => (
    <SectionHeader title={section.title} />
  ), []);

  const renderTripItem: SectionListRenderItem<Trip, TripSection> = useCallback(({ item }) => (
    <TripCard
      trip={item}
      onPinToggle={handlePinToggle}
      onSaveToggle={(id) => toggleTripState(id, 'isSaved')}
      onLockToggle={(id) => toggleTripState(id, 'isLocked')}
      onMoodChange={handleMoodChange}
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

        {selectedTab === 'planned' ? (
          <SectionList<Trip, TripSection>
            sections={plannedSections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={({ item }) => (
              <PlannedTripCard
                trip={item as PlannedTrip}
                onPinToggle={(id) => togglePlanState(id, 'isPinned')}
                onSaveToggle={(id) => togglePlanState(id, 'isSaved')}
                onLockToggle={(id) => togglePlanState(id, 'isLocked')}
                onDelete={handleDeletePlan}
              />
            )}
            stickySectionHeadersEnabled={HOME_TIMELINE_STICKY_SECTION_HEADERS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, upcomingPlans.length === 0 && styles.emptyList]}
            ListHeaderComponent={(
              <PinnedSection
                pinnedTrips={pinnedPlans}
                onPinToggle={(id) => togglePlanState(id, 'isPinned')}
                onDelete={handleDeletePlan}
                renderTrip={(trip) => (
                  <PlannedTripCard
                    trip={trip as PlannedTrip}
                    onPinToggle={(id) => togglePlanState(id, 'isPinned')}
                    onSaveToggle={(id) => togglePlanState(id, 'isSaved')}
                    onLockToggle={(id) => togglePlanState(id, 'isLocked')}
                    onDelete={handleDeletePlan}
                  />
                )}
              />
            )}
            ListEmptyComponent={(
              <View style={styles.emptyPlans}>
                <Text style={[styles.emptyTitle, { color: palette.text }]}>{t('planned.noTrips')}</Text>
                <Text style={[styles.emptyDescription, { color: palette.secondaryText }]}>{t('planned.emptyDescription')}</Text>
                <Pressable style={[styles.createPlan, { backgroundColor: palette.accentStrong }]} onPress={handleAddNewTrip}>
                  <Text style={styles.createPlanText}>{t('planned.createPlan')}</Text>
                </Pressable>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={palette.text} />}
          />
        ) : (
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
                renderTrip={(trip) => (
                  <TripCard
                    trip={trip}
                    onPinToggle={handlePinToggle}
                    onSaveToggle={(id) => toggleTripState(id, 'isSaved')}
                    onLockToggle={(id) => toggleTripState(id, 'isLocked')}
                    onMoodChange={handleMoodChange}
                    onDelete={handleDeleteTrip}
                  />
                )}
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
        )}
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
  emptyList: { flexGrow: 1 },
  emptyPlans: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl, gap: Spacing.md },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDescription: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
  createPlan: { marginTop: Spacing.sm, borderRadius: 12, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  createPlanText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
