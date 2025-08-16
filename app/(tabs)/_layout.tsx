import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { BottomNavBar } from '../../components/ui/BottomNavBar';
import { Colors } from '@/theme/designSystem';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Tabs 
          screenOptions={{ 
            headerShown: false,
            tabBarStyle: { display: 'none' }, // 隐藏默认 TabBar
          }}
        >
          <Tabs.Screen name="home" options={{ title: 'Home' }} />
          <Tabs.Screen name="location" options={{ title: 'Location' }} />
          <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
          <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
      </View>
      
      {/* 自定义 Bottom Navigation Bar */}
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDefault,
  },
  content: {
    flex: 1,
  },
});


