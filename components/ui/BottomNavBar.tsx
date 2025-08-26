import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import { Svg, Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Icon
} from '@/components/Icon';
import { colors, ColorScheme } from '@/tokens';

// ======= 可按 Figma 微调 =======
const BAR_HEIGHT = 92;        // 底栏高度（含凹槽区域）
const FAB_SIZE = 64;          // 中间 + 按钮直径
const FAB_EMBED_COEFF = 0.82;

// 凹槽 Path（保持 viewBox 0 0 390 132）
const NOTCH_PATH =
  'M390 132H0V45H133.765C134.163 45.138 134.581 45.2347 135.01 45.2852C165.027 48.8169 166.031 83.9997 195 84C223.969 83.9997 224.973 48.8169 254.99 45.2852C255.418 45.2347 255.836 45.1379 256.234 45H390V132Z';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scheme = (useColorScheme() ?? 'light') as ColorScheme;

  // 直接从 tokens 读取单个颜色字符串（避免类型不匹配）
  const palette = colors[scheme];
  const navBg = palette.navbar;
  const iconActive = palette.navbarSelected;
  const iconInactive = palette.navbarUnselected;
  const fabBg = palette.addButton;

  // 当前 tab（路由最后一段）
  const current = React.useMemo(() => {
    const seg = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean).pop();
    return seg === '(tabs)' || !seg ? 'home' : seg;
  }, [pathname]);

  const FAB_BOTTOM = Math.round(BAR_HEIGHT - FAB_SIZE * FAB_EMBED_COEFF);
  const FAB_BOTTOM_ABS = FAB_BOTTOM + insets.bottom; // 合并手势区后，FAB 需要上移 insets.bottom

  // 顶部羽化高度（像素）
  const FEATHER_PX = 16;
  const BLUR_TOTAL_H = BAR_HEIGHT + insets.bottom + 12;
  const FEATHER_OFFSET_PERCENT = `${(FEATHER_PX / BLUR_TOTAL_H) * 100}%`;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { height: BAR_HEIGHT + insets.bottom + 12 }]}
    >
      {/* 0) 透明模糊：覆盖底部区域，但在 NavBar 与 FAB 之下（不着色） + 顶部羽化 */}
      <View style={[styles.blurArea, { height: BLUR_TOTAL_H }]}>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <Svg width={width} height={BLUR_TOTAL_H} viewBox={`0 0 ${width} ${BLUR_TOTAL_H}`} preserveAspectRatio="none">
              <Defs>
                {/* 顶部向下的透明→不透明渐变，形成羽化 */}
                <LinearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#000" stopOpacity="0" />
                  <Stop offset={FEATHER_OFFSET_PERCENT} stopColor="#000" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#000" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              {/* 用 alpha 渐变做 Mask：透明=隐藏，非透明=显示 */}
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#fadeMask)" />
            </Svg>
          }
        >
          <BlurView
            tint={Platform.OS === 'ios' ? 'extraLight' : 'light'}
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
          {/* 统一加 10% 白色蒙版，不受明暗模式影响 */}
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(230, 230, 230, 0.3)' }]}
          />
        </MaskedView>
      </View>

      {/* 1) 底栏形状与阴影（包含手势区） */}
      <View style={[styles.barWrap, { width, height: BAR_HEIGHT + insets.bottom + 16 }]}>
        {/* 顶部"凹槽"形状区域（保持原尺寸，不拉伸） */}
        <MaskedView
          style={[{ position: 'absolute', left: 0, right: 0, top: 0, height: BAR_HEIGHT + 16, zIndex: 1 }]}
          maskElement={
            <Svg width={width} height={BAR_HEIGHT + 16} viewBox="0 0 390 132" preserveAspectRatio="none">
              <Path d={NOTCH_PATH} fill="#000" />
            </Svg>
          }
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: navBg, opacity: 1 }]} />
        </MaskedView>

        {/* 手势区填充：与 navbar 同色，避免色差/黑条 */}
        <View
          style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            height: insets.bottom,
            backgroundColor: navBg,
            zIndex: 1,
          }}
        />

        {/* 外轮廓占位（透明，承载阴影/边缘），放最底 */}
        <Svg
          pointerEvents="none"
          width={width}
          height={BAR_HEIGHT + 16}
          viewBox="0 0 390 132"
          preserveAspectRatio="none"
          style={[{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 0 }]}
        >
          <Path d={NOTCH_PATH} fill="transparent" />
        </Svg>

        {/* 2) 图标点击区（在模糊之上、FAB 之下） */}
        <View style={[styles.row, { zIndex: 2, bottom: insets.bottom + 10 }]}>
          <View style={styles.side}>
            <Pressable style={styles.tab} onPress={() => router.replace('/(tabs)/home')}>
              <Icon 
                name={'home-selected'}
                size={24} 
                color={current === 'home' ? iconActive : iconInactive} 
              />
            </Pressable>
            <Pressable style={styles.tab} onPress={() => router.replace('/(tabs)/location')}>
              <Icon 
                name={'pin-selected'}
                size={24} 
                color={current === 'location' ? iconActive : iconInactive} 
              />
            </Pressable>
          </View>

          {/* 中间留出 FAB 的宽度 */}
          <View style={{ width: FAB_SIZE, height: FAB_SIZE }} />

          <View style={styles.side}>
            <Pressable style={styles.tab} onPress={() => router.replace('/(tabs)/stats')}>
              <Icon 
                name={'stats-selected'}
                size={24} 
                color={current === 'stats' ? iconActive : iconInactive} 
              />
            </Pressable>
            <Pressable style={styles.tab} onPress={() => router.replace('/(tabs)/profile')}>
              <Icon 
                name={'profile-selected'}
                size={24} 
                color={current === 'profile' ? iconActive : iconInactive} 
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* 3) 最上层 FAB（半嵌） */}
      {Platform.OS === 'android' ? (
        <Pressable
          onPress={() => router.push('/card/new')}
          style={[styles.fab, styles.androidFab, { bottom: FAB_BOTTOM_ABS }]}
          android_ripple={{ color: '#E6F5E6', borderless: true }}
        >
          <View style={styles.androidGreenCircle}>
            <Text style={styles.androidAddText}>+</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push('/card/new')}
          style={[styles.fab, { bottom: FAB_BOTTOM_ABS, backgroundColor: fabBg }]}
          android_ripple={{ color: '#E6F5E6', borderless: true }}
        >
          <Icon name="add-selected" size={38} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
  },
  blurArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Blur 在最底，但 host 盖在页面之上 -> 视觉上位于页面与 NavBar 之间
  },
  barWrap: {
    alignSelf: 'center',
    overflow: 'visible', // 让阴影完整显示
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: -6 },
        shadowRadius: 16,
        backgroundColor: 'transparent',
      },
              android: {
          elevation: 8,
          backgroundColor: 'transparent',
          shadowColor: '#333333',
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
        },
    }),
  },
  row: {
    position: 'absolute',
    left: 0, right: 0,
    height: 48,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  side: { flexDirection: 'row', gap: 24 },
  tab: {
    width: 48,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3, // FAB 最高层
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: { elevation: 0 },
    }),
  },
  androidFab: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  androidGreenCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#b7d58c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  androidAddText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
  },
});
