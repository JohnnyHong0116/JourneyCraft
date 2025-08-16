import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomNavBar } from '../../components/ui/BottomNavBar';

export const BottomNavBarExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bottom Navigation Bar 示例</Text>
      <Text style={styles.description}>
        这是一个完整的 Bottom Navigation Bar 示例，包含：
      </Text>
      
      <View style={styles.features}>
        <Text style={styles.feature}>• 4 个 Tab：Home、Location、Stats、Profile</Text>
        <Text style={styles.feature}>• 中间浮动的绿色 "+" 按钮</Text>
        <Text style={styles.feature}>• 支持 Light/Dark 主题</Text>
        <Text style={styles.feature}>• 点击动画效果</Text>
        <Text style={styles.feature}>• 自动路由导航</Text>
      </View>
      
      <Text style={styles.note}>
        注意：此组件需要在 Tabs 布局中使用才能正常工作
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 15,
    textAlign: 'center',
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 10,
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
});
