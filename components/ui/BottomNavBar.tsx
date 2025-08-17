import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useColorScheme } from 'react-native';
import { 
  HomeIcon, 
  LocationIcon, 
  StatsIcon, 
  ProfileIcon,
  AddIcon 
} from '@/components/Icon';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const BAR_HORIZONTAL_MARGIN = 16;
const BAR_WIDTH = screenWidth - BAR_HORIZONTAL_MARGIN * 2;
const BAR_HEIGHT = 70; // further reduce white area height while keeping icons anchored at bottom
const CORNER_RADIUS = 0;
const NOTCH_RADIUS = 36; // wider circle visually
const NOTCH_WIDTH_FACTOR = 2.3; // widen notch footprint (was 1.6)
const NOTCH_DEPTH_FACTOR = 1.15; // adjusted depth
const NAV_Y_OFFSET = 18; // push the upper boundary (notch) further downward
const SIDE_PADDING = 16; // horizontal paddings inside items row (reduced)
const TOUCH_MIN_WIDTH = 56; // comfortable horizontal touch width (slightly reduced)
const ITEM_HORIZONTAL_PAD = 6; // inner padding per item (reduced)
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;
const ICON_Y_OFFSET = 8; // move icons slightly downward
const TOP_STROKE = 2;
const TOP_STROKE_NOTCH = 1.2; // slightly thinner so视觉厚度一致
const TOP_STROKE_EXTEND = 6; // extend straight shadow into notch a bit

const getBarPath = (w: number, h: number) => {
  const r = CORNER_RADIUS;
  const c = NOTCH_RADIUS;
  const cx = w / 2;
  const notchStart = cx - c * NOTCH_WIDTH_FACTOR;
  const notchEnd = cx + c * NOTCH_WIDTH_FACTOR;
  const notchDepth = c * NOTCH_DEPTH_FACTOR; // adjusted depth

  return [
    `M 0 ${r}`,
    `Q 0 0 ${r} 0`,
    `H ${notchStart}`,
    `C ${cx - c} 0 ${cx - c * 0.9} ${notchDepth} ${cx} ${notchDepth}`,
    `C ${cx + c * 0.9} ${notchDepth} ${cx + c} 0 ${notchEnd} 0`,
    `H ${w - r}`,
    `Q ${w} 0 ${w} ${r}`,
    `V ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `H ${r}`,
    `Q 0 ${h} 0 ${h - r}`,
    'Z',
  ].join(' ');
};

// Top-edge segments for uniform perceived thickness
const getTopSegments = (w: number) => {
  const r = CORNER_RADIUS;
  const c = NOTCH_RADIUS;
  const cx = w / 2;
  const notchStart = cx - c * NOTCH_WIDTH_FACTOR;
  const notchEnd = cx + c * NOTCH_WIDTH_FACTOR;
  const notchDepth = c * NOTCH_DEPTH_FACTOR;
  const leftEnd = notchStart + TOP_STROKE_EXTEND;
  const rightStart = notchEnd - TOP_STROKE_EXTEND;
  const left = [`M 0 ${r}`, `Q 0 0 ${r} 0`, `H ${leftEnd}`].join(' ');
  const notch = [
    `M ${leftEnd} 0`,
    `C ${cx - c} 0 ${cx - c * 0.9} ${notchDepth} ${cx} ${notchDepth}`,
    `C ${cx + c * 0.9} ${notchDepth} ${cx + c} 0 ${rightStart} 0`,
  ].join(' ');
  const right = [`M ${rightStart} 0`, `H ${w - r}`, `Q ${w} 0 ${w} ${r}`].join(' ');
  return { left, notch, right };
};

interface TabItem {
  name: string;
  route: string;
  icon: React.ComponentType<any>;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'home', route: '/(tabs)/home', icon: HomeIcon, label: 'Home' },
  { name: 'location', route: '/(tabs)/location', icon: LocationIcon, label: 'Location' },
  { name: 'stats', route: '/(tabs)/stats', icon: StatsIcon, label: 'Stats' },
  { name: 'profile', route: '/(tabs)/profile', icon: ProfileIcon, label: 'Profile' },
];

export const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme() || 'light';
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(BAR_WIDTH);

  const getLastSegment = (p: string) => p.split('?')[0].split('#')[0].split('/').filter(Boolean).pop() || '';
  const getTabKey = (route: string) => route.split('/').filter(Boolean).pop() || '';
  const isActiveTab = (route: string) => {
    const tabKey = getTabKey(route);
    let seg = getLastSegment(pathname);
    if (seg === '(tabs)') seg = 'home';
    return seg === tabKey;
  };
  const handleTabPress = (route: string) => router.push(route as any);
  const handleAddButtonPress = () => router.push('/card/new' as any);

  const selectedColor = colors.light.navbarSelected;
  const unselectedColor = colors.light.navbarUnselected;
  const notchDepth = NOTCH_RADIUS * NOTCH_DEPTH_FACTOR;
  const placeholderWidth = Math.round(NOTCH_RADIUS * NOTCH_WIDTH_FACTOR * 2); // match notch horizontal span

  const GAP = 6;
  const fabTop = notchDepth - 2 * NOTCH_RADIUS - GAP; // recomputed with new depth
  const fabLeft = Math.round(barWidth / 2 - NOTCH_RADIUS);
  const { left: topLeft, notch: topNotch, right: topRight } = getTopSegments(barWidth);

  return (
    <View style={[styles.container, { marginBottom: insets.bottom, backgroundColor: 'transparent' }]}>      
      {/* Fully transparent backdrop above the white bar (from FAB to notch) */}
      <View
        pointerEvents="none"
        style={[styles.upperBackdrop, { height: Math.ceil(NAV_Y_OFFSET + notchDepth + NOTCH_RADIUS), backgroundColor: 'transparent' }]}
      />

      <View style={[styles.barContainer, { marginTop: NAV_Y_OFFSET }]} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
        {/* Only top-edge shadow via SVG stroke; native shadow disabled */}
        <View style={[styles.barShadowHolder, { width: barWidth, height: BAR_HEIGHT }]} />
        <View style={[styles.bar, { width: barWidth, height: BAR_HEIGHT }]}>          
          <Svg width={barWidth} height={BAR_HEIGHT}>
            <Path d={getBarPath(barWidth, BAR_HEIGHT)} fill={colors.light.surfaceCard} />
            <Path d={topLeft} fill="none" stroke={colors.light.shadowTint} strokeWidth={TOP_STROKE} strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit={2} />
            <Path d={topNotch} fill="none" stroke={colors.light.shadowTint} strokeWidth={TOP_STROKE_NOTCH} strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit={2} />
            <Path d={topRight} fill="none" stroke={colors.light.shadowTint} strokeWidth={TOP_STROKE} strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit={2} />
          </Svg>
        </View>

        <View style={[styles.itemsRow, { width: barWidth, height: BAR_HEIGHT, paddingTop: ICON_Y_OFFSET } ]}>
          <View style={styles.sideRowLeft}>
            {[tabs[0], tabs[1]].map((tab) => {
              const IconComponent = tab.icon;
              const active = isActiveTab(tab.route);
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tabButton}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                >
                  <IconComponent size={24} color={active ? selectedColor : unselectedColor} theme={colorScheme} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ width: placeholderWidth }} />

          <View style={styles.sideRowRight}>
            {[tabs[2], tabs[3]].map((tab) => {
              const IconComponent = tab.icon;
              const active = isActiveTab(tab.route);
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tabButton}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                >
                  <IconComponent size={24} color={active ? selectedColor : unselectedColor} theme={colorScheme} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.fab, { left: fabLeft, top: fabTop }]}
          onPress={handleAddButtonPress}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Add"
        >
          <AddIcon size={30} color={colors.light.surfaceCard} />
        </TouchableOpacity>
      </View>

      {/* Fill the iPhone home indicator area with the same navbar color */}
      <View style={[styles.homeIndicatorFill, { height: insets.bottom, bottom: -insets.bottom, backgroundColor: colors.light.surfaceCard }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', width: '100%', alignItems: 'center' },
  upperBackdrop: { position: 'absolute', top: 0, left: 0, right: 0 },
  barContainer: { width: '100%', paddingHorizontal: BAR_HORIZONTAL_MARGIN, alignItems: 'center' },
  barShadowHolder: {
    position: 'absolute', top: 0, borderRadius: CORNER_RADIUS, width: '100%',
    shadowOpacity: 0, // disable native shadow completely to avoid bottom bleed
    backgroundColor: 'transparent',
  },
  bar: { borderRadius: CORNER_RADIUS, backgroundColor: 'transparent' },
  itemsRow: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIDE_PADDING,
  },
  sideRowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  sideRowRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  tabButton: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: ITEM_HORIZONTAL_PAD,
    minHeight: 44, minWidth: TOUCH_MIN_WIDTH, marginHorizontal: 4,
  },
  fab: {
    position: 'absolute', width: NOTCH_RADIUS * 2, height: NOTCH_RADIUS * 2, borderRadius: NOTCH_RADIUS,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.light.addButton,
  },
  homeIndicatorFill: { position: 'absolute', left: 0, right: 0 },
});
