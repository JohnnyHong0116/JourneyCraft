import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TripCard } from '../../features/cards/components/TripCard';
import { mockTrips } from '../data/mockTrips';

export const TripCardExample: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TripCard 组件示例</Text>
      <Text style={styles.description}>
        这是按照 Figma 设计规范实现的 TripCard 组件示例
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>完整卡片示例</Text>
        <TripCard 
          trip={mockTrips[0]} 
          showGroupLabel={true}
          groupLabel="Today"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>新卡片示例（无图标）</Text>
        <TripCard 
          trip={{
            id: 'new-1',
            title: 'New Trip',
            location: 'New York, NY',
            createdAt: new Date().toISOString(),
            displayDate: new Date().toISOString(),
            photos: [],
            audioCount: 0,
            videoCount: 0,
          }} 
          showGroupLabel={true}
          groupLabel="Today"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>带 Mood 的卡片</Text>
        <TripCard 
          trip={{
            ...mockTrips[1],
            mood: 'happy'
          }} 
          showGroupLabel={true}
          groupLabel="Yesterday"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>带所有图标的卡片</Text>
        <TripCard 
          trip={{
            ...mockTrips[2],
            isSaved: true,
            isLocked: true,
            companions: ['John', 'Jane'],
            mood: 'overjoyed'
          }} 
          showGroupLabel={true}
          groupLabel="January"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能说明</Text>
        <View style={styles.features}>
          <Text style={styles.feature}>• 完全还原 Figma 设计样式</Text>
          <Text style={styles.feature}>• 支持分组标签显示</Text>
          <Text style={styles.feature}>• 自动显示/隐藏图标（根据数据）</Text>
          <Text style={styles.feature}>• 新卡片默认隐藏所有图标</Text>
          <Text style={styles.feature}>• 支持 Light/Dark 主题</Text>
          <Text style={styles.feature}>• 点击跳转到详情页</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  features: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  feature: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 10,
    color: '#555',
  },
});
