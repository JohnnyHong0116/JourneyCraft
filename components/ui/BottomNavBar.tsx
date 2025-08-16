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

const { width: screenWidth } = Dimensions.get('window');

interface TabItem {
  name: string;
  route: string;
  icon: React.ComponentType<any>;
  label: string;
}

const tabs: TabItem[] = [
  {
    name: 'home',
    route: '/(tabs)/home',
    icon: HomeIcon,
    label: 'Home',
  },
  {
    name: 'location',
    route: '/(tabs)/location',
    icon: LocationIcon,
    label: 'Location',
  },
  {
    name: 'stats',
    route: '/(tabs)/stats',
    icon: StatsIcon,
    label: 'Stats',
  },
  {
    name: 'profile',
    route: '/(tabs)/profile',
    icon: ProfileIcon,
    label: 'Profile',
  },
];

export const BottomNavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme() || 'light';
  const [isAddButtonPressed, setIsAddButtonPressed] = useState(false);

  const isActiveTab = (route: string) => {
    return pathname === route;
  };

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const handleAddButtonPress = () => {
    router.push('/card/new' as any);
  };

  const handleAddButtonPressIn = () => {
    setIsAddButtonPressed(true);
  };

  const handleAddButtonPressOut = () => {
    setIsAddButtonPressed(false);
  };

  return (
    <View style={styles.container}>
      {/* 背景容器 - 完全按照 Figma 设计，不做任何修改 */}
      <View style={styles.backgroundContainer}>
        {/* 主要导航栏 */}
        <View style={styles.navBar}>
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            const isActive = isActiveTab(tab.route);
            
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconComponent
                  size={24}
                  style={[
                    styles.tabIcon,
                    isActive && styles.activeTabIcon,
                  ]}
                  theme={colorScheme}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 浮动 + 按钮 - 完全按照 Figma 设计，不做任何修改 */}
      <TouchableOpacity
        style={[
          styles.floatingAddButton,
          isAddButtonPressed && styles.floatingAddButtonPressed,
        ]}
        onPress={handleAddButtonPress}
        onPressIn={handleAddButtonPressIn}
        onPressOut={handleAddButtonPressOut}
        activeOpacity={0.9}
      >
        <AddIcon size={28} style={styles.addIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  backgroundContainer: {
    // 完全按照 Figma 设计，不做任何修改
    backgroundColor: '#d8ead0', // 精确的浅绿色背景
    borderTopLeftRadius: 20, // 精确的弧度
    borderTopRightRadius: 20, // 精确的弧度
    paddingTop: 16, // 精确的顶部间距
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // iOS 安全区域
    // 精确的阴影效果，完全按照 Figma 设计
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08, // 精确的阴影透明度
    shadowRadius: 8, // 精确的阴影半径
    elevation: 8, // Android 阴影
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20, // 精确的水平间距
    paddingVertical: 16, // 精确的垂直间距
    minHeight: 60, // 精确的最小高度
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // 精确的垂直内边距
    minHeight: 44, // 精确的最小高度
  },
  tabIcon: {
    tintColor: '#6B7280', // 精确的未选中状态颜色
    opacity: 0.8, // 精确的透明度
  },
  activeTabIcon: {
    tintColor: '#22C55E', // 精确的选中状态颜色
    opacity: 1, // 完全不透明
  },
  floatingAddButton: {
    position: 'absolute',
    top: -30, // 精确位置，让按钮浮动在导航栏上方
    left: '50%',
    marginLeft: -30,
    width: 60, // 精确的宽度
    height: 60, // 精确的高度
    borderRadius: 30, // 精确的圆角
    backgroundColor: '#22C55E', // 精确的亮绿色
    justifyContent: 'center',
    alignItems: 'center',
    // 精确的阴影效果，完全按照 Figma 设计
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2, // 精确的阴影透明度
    shadowRadius: 12, // 精确的阴影半径
    elevation: 12, // Android 阴影
    transform: [{ scale: 1 }],
  },
  floatingAddButtonPressed: {
    transform: [{ scale: 0.95 }], // 精确的按下动画
  },
  addIcon: {
    tintColor: '#FFFFFF', // 精确的白色图标
  } as any,
});
