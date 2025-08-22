# 实现文档

## 📋 项目概述

这是一个基于 Expo Router 的 React Native 旅行应用，实现了完整的图标系统、底部导航栏、卡片组件和主页面功能。

## 🎯 核心功能

### 1. 图标系统 (SVG + Selected/Unselected 两态)

**新的图标系统特点：**
- **SVG 格式**：所有图标使用 SVG 格式，支持矢量缩放
- **两态设计**：每个图标都有 `selected` 和 `unselected` 两种状态
- **扁平结构**：所有图标直接放在 `src/assets/icons/` 目录下，不再分区
- **颜色控制**：颜色通过组件传入的 `color` 属性控制，支持明暗模式

**文件结构：**
```
src/assets/icons/
├── home-selected.svg
├── home-unselected.svg
├── location-selected.svg
├── location-unselected.svg
├── stats-selected.svg
├── stats-unselected.svg
├── profile-selected.svg
├── profile-unselected.svg
├── search-selected.svg
├── search-unselected.svg
├── more-selected.svg
├── more-unselected.svg
├── calendar-selected.svg
├── calendar-unselected.svg
├── add-selected.svg
├── add-unselected.svg
├── save-selected.svg
├── save-unselected.svg
├── lock-selected.svg
├── lock-unselected.svg
├── people-selected.svg
├── people-unselected.svg
├── image-selected.svg
├── image-unselected.svg
├── mic-selected.svg
├── mic-unselected.svg
├── video-selected.svg
└── video-unselected.svg
```

**使用方式：**
```tsx
import { Icon } from '@/components/Icon';

// 使用 selected/unselected 状态
<Icon name="home-selected" size={24} color="#22C55E" />
<Icon name="home-unselected" size={24} color="#6B7280" />

// 根据条件动态选择状态
<Icon 
  name={isActive ? 'home-selected' : 'home-unselected'} 
  size={24} 
  color={isActive ? activeColor : inactiveColor} 
/>
```

### 2. 底部导航栏 (BottomNavBar)

**技术实现：**
- **SVG 凹槽**：使用 `react-native-svg` 渲染复杂的凹槽形状
- **毛玻璃效果**：使用 `expo-blur` 实现毛玻璃背景
- **羽化渐变**：顶部羽化效果，平滑过渡
- **精确嵌入**：FAB 按钮精确嵌入凹槽位置
- **响应式设计**：支持不同屏幕尺寸和 iPhone 手势区域

**关键特性：**
- 凹槽形状完全按照 Figma 设计
- 毛玻璃效果 + 半透明叠加
- 阴影效果（iOS/Android 适配）
- 4 个 Tab 图标 + 中间 FAB 按钮
- 自动根据当前路由高亮对应 Tab

### 3. 卡片组件 (TripCard)

**功能特性：**
- **分组显示**：支持按日期分组（Today, Yesterday, Month）
- **状态图标**：左侧竖排图标（save, lock, people）
- **媒体指示**：底部横排图标（image, mic, video）
- **心情圆点**：左下角心情状态指示
- **封面图片**：右侧封面图片或占位符
- **交互反馈**：点击导航到详情页面

**数据驱动：**
- 根据数据存在性显示/隐藏图标
- 新卡片默认隐藏所有图标
- 支持图片、音频、视频计数显示

### 4. 主页面 (Home)

**核心功能：**
- **分组列表**：使用 `SectionList` 实现分组显示
- **下拉刷新**：支持刷新数据
- **搜索排序**：预留搜索和排序功能接口
- **标签切换**：Visited/Planned 标签切换
- **响应式布局**：适配不同屏幕尺寸

## 🛠 技术栈

### 核心依赖
- **Expo Router**: 路由管理
- **React Native**: 跨平台开发
- **TypeScript**: 类型安全
- **react-native-svg**: SVG 渲染
- **expo-blur**: 毛玻璃效果
- **react-native-svg-transformer**: SVG 导入支持

### 配置更新
- **Metro 配置**: 支持 SVG 作为源码导入
- **TypeScript 配置**: 添加 SVG 类型声明
- **路径别名**: 配置 `@/` 等路径别名

## 📁 文件结构

```
src/
├── assets/
│   ├── icons/           # SVG 图标文件
│   ├── icons.ts         # 图标导出映射
│   └── icons/README.md  # 图标使用说明
├── components/
│   └── Icon.tsx         # 图标组件
├── types/
│   ├── trip.ts          # 旅行数据类型
│   └── svg.d.ts         # SVG 类型声明
├── utils/
│   └── date.ts          # 日期处理工具
└── data/
    └── mockTrips.ts     # 模拟数据

features/
├── home/
│   └── components/
│       ├── Header.tsx
│       ├── TripCard.tsx
│       └── SectionHeader.tsx
└── cards/
    └── components/
        └── TripCard.tsx

components/ui/
└── BottomNavBar.tsx     # 底部导航栏

app/
├── (tabs)/
│   ├── _layout.tsx      # Tab 布局
│   ├── home.tsx         # 主页面
│   ├── location.tsx     # 位置页面
│   ├── stats.tsx        # 统计页面
│   └── profile.tsx      # 个人页面
└── card/
    └── new.tsx          # 新建卡片页面
```

## 🚀 使用方法

### 1. 启动项目
```bash
npm install
npx expo start
```

### 2. 添加新图标
1. 将 SVG 文件放入 `src/assets/icons/` 目录
2. 命名为 `{iconName}-selected.svg` 和 `{iconName}-unselected.svg`
3. 在 `src/assets/icons.ts` 中注册图标
4. 在组件中使用 `Icon` 组件

### 3. 使用图标组件
```tsx
import { Icon } from '@/components/Icon';

// 基本使用
<Icon name="home-selected" size={24} color="#22C55E" />

// 条件渲染
<Icon 
  name={isActive ? 'tab-selected' : 'tab-unselected'} 
  size={24} 
  color={isActive ? activeColor : inactiveColor} 
/>
```

## 🎨 设计系统

### 颜色系统
- 使用 `src/tokens.ts` 中定义的颜色
- 支持明暗模式切换
- 统一的颜色命名规范

### 间距系统
- 使用 `src/theme/designSystem.ts` 中定义的间距
- 统一的间距比例

### 字体系统
- 统一的字体大小和行高
- 支持不同字重

## 🔧 开发注意事项

### 1. SVG 图标规范
- 使用 `currentColor` 作为填充色
- 保持统一的 `viewBox` 尺寸
- 确保 selected/unselected 状态有明显区别

### 2. 性能优化
- 图标组件支持缓存
- 使用 `useCallback` 优化渲染
- 避免不必要的重渲染

### 3. 类型安全
- 所有组件都有完整的 TypeScript 类型
- 使用严格的类型检查
- 避免 `any` 类型的使用

## 📱 平台兼容性

### iOS
- 支持毛玻璃效果
- 适配 iPhone 手势区域
- 支持动态字体大小

### Android
- 使用 elevation 替代阴影
- 适配不同屏幕密度
- 支持 RTL 布局

## 🔄 更新日志

### 最新更新 (图标系统重构)
- ✅ 重构图标系统为 SVG + selected/unselected 两态
- ✅ 扁平化图标目录结构
- ✅ 更新所有组件使用新的图标系统
- ✅ 修复所有 TypeScript 错误
- ✅ 添加 SVG 类型声明
- ✅ 配置 Metro 支持 SVG 导入

### 之前更新
- ✅ 实现底部导航栏凹槽设计
- ✅ 实现卡片组件和分组显示
- ✅ 实现主页面功能
- ✅ 配置路由和导航

## 🎯 下一步计划

1. **图标完善**：添加所有 Figma 设计的图标文件
2. **功能扩展**：实现搜索、排序、筛选功能
3. **性能优化**：添加虚拟化列表支持
4. **测试覆盖**：添加单元测试和集成测试
5. **文档完善**：添加更多使用示例和最佳实践
