import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Icon, 
  HomeIcon, 
  SaveIcon, 
  LockIcon, 
  PeopleGroupIcon,
  ImageIcon,
  MicIcon,
  VideoIcon,
  SearchIcon,
  AddIcon
} from './Icon';

export const IconExample: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>图标使用示例</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TabBar 图标</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <HomeIcon size={24} />
            <Text style={styles.iconLabel}>首页</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>卡片左侧图标</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <SaveIcon size={20} />
            <Text style={styles.iconLabel}>保存</Text>
          </View>
          <View style={styles.iconItem}>
            <LockIcon size={20} />
            <Text style={styles.iconLabel}>加密</Text>
          </View>
          <View style={styles.iconItem}>
            <PeopleGroupIcon size={20} />
            <Text style={styles.iconLabel}>同行人</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>卡片底部图标</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <ImageIcon size={16} />
            <Text style={styles.iconLabel}>图片</Text>
          </View>
          <View style={styles.iconItem}>
            <MicIcon size={16} />
            <Text style={styles.iconLabel}>录音</Text>
          </View>
          <View style={styles.iconItem}>
            <VideoIcon size={16} />
            <Text style={styles.iconLabel}>视频</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能图标</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <SearchIcon size={20} />
            <Text style={styles.iconLabel}>搜索</Text>
          </View>
          <View style={styles.iconItem}>
            <AddIcon size={20} />
            <Text style={styles.iconLabel}>添加</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通用图标组件</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <Icon name="saveLight" size={20} />
            <Text style={styles.iconLabel}>保存(Light)</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="saveDark" size={20} />
            <Text style={styles.iconLabel}>保存(Dark)</Text>
          </View>
        </View>
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  iconItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
