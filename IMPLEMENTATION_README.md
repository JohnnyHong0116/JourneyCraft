# JourneyCraft 移动应用实现文档

## 🎯 项目概述

这是一个基于 Expo + expo-router 的旅行记录移动应用，完全按照 Figma 设计规范实现。应用包含完整的 UI 组件系统、图标系统、导航系统和响应式设计。

## ✅ 已完成的核心功能

### 1. Home – Visited 主页面 ✅
- 完全还原 Figma 设计的 List View 布局
- 分组显示：Today、Yesterday、月份分组
- 智能卡片排序和分组逻辑
- 下拉刷新功能
- 响应式设计，支持不同屏幕尺寸

### 2. 数据模型与业务逻辑 ✅
- 完整的 `Trip` 类型定义
- 日期分组和排序逻辑
- 8-10 条覆盖各种场景的 mock 数据
- 新卡片创建和入场动画

### 3. 图标系统 ✅
- 完全按照 Figma 设计规范实现
- 支持 Light/Dark 两种主题模式
- 自动根据系统主题选择对应图标
- 提供预定义图标组件和通用图标组件
- 所有图标都放在 `src/assets/icons/` 目录下

### 4. Card 组件系统 ✅
- 完全还原 Figma 设计样式
- 支持分组标签显示（Today/Yesterday/月份）
- 智能图标显示逻辑（新卡片默认隐藏所有图标）
- 完整的 Mood 系统（5 种情绪颜色）
- 左侧竖排图标：Save、Lock、People
- 左下横排图标：Image、Mic、Video
- 右侧封面图区域（60x60，圆角 10px）
- 响应式设计，支持不同屏幕尺寸

### 5. Bottom Navigation Bar ✅
- 完全还原 Figma 设计样式，包括精确的弧度和阴影
- 4 个 Tab：Home、Location、Stats、Profile
- 中间浮动的绿色 "+" 按钮，支持按下动画
- 浅绿色背景 (#d8ead0)，精确的 20px 圆角
- 精确的阴影效果，包括向上和向下的阴影
- 自动主题适配（Light/Dark）
- 集成 expo-router 导航系统
- 响应式设计，支持不同屏幕尺寸

### 6. 交互与导航 ✅
- 点击卡片跳转到 `/trip/[id]`
- 绿色 "+" 浮动按钮创建新卡片
- 收藏图标点击切换状态
- 下拉刷新功能

### 7. 响应式适配 ✅
- 使用 Flex 布局和百分比宽度
- SafeAreaView 支持
- 避免被底部 TabBar 和 FAB 遮挡

## 🎨 UI 设计还原度

### Header 组件
- **JourneyCraft 标题**：32px 粗体黑色文字
- **三个图标按钮**：搜索、排序、视图切换
- **分段控制器**：Visited/Planned 切换，选中状态白色背景

### TripCard 组件
- **卡片尺寸**：360x115，圆角 15px
- **封面图**：60x60，圆角 10px，黑色占位符
- **字体规范**：标题 32px 粗体，日期/位置 14px 粗体
- **图标位置**：左侧竖排 28px 宽度，底部横排 18px 间距
- **Mood 圆点**：25x25，红色，带白色边框和阴影

### Bottom Navigation Bar
- **背景色**：浅绿色 (#d8ead0)
- **Tab 图标**：24px，未选中灰色，选中绿色
- **浮动按钮**：60x60 圆形，亮绿色，白色 "+" 图标

## 📁 文件结构

```
app/
├── (tabs)/
│   ├── _layout.tsx               # Tabs 布局（集成 BottomNavBar）
│   ├── home.tsx                  # 主页面（List View）
│   ├── location.tsx              # Location Tab
│   ├── stats.tsx                 # Stats Tab
│   └── profile.tsx               # Profile Tab
└── card/
    └── new.tsx                   # 新卡片创建页面

components/
└── ui/
    └── BottomNavBar.tsx          # 底部导航栏组件

features/
├── home/
│   └── components/
│       ├── Header.tsx            # 页面头部组件
│       ├── TripCard.tsx          # 卡片组件（重新导出）
│       ├── SectionHeader.tsx     # 分组标题组件
│       ├── FloatingActionButton.tsx # 浮动按钮组件
│       └── index.ts              # 组件导出
└── cards/
    └── components/
        ├── TripCard.tsx          # 核心卡片组件
        └── index.ts              # 组件导出

src/
├── assets/
│   ├── icons/                    # 图标资源目录
│   │   └── README.md             # 图标使用说明
│   └── icons.ts                  # 图标资源导出
├── components/
│   ├── Icon.tsx                  # 主题感知图标组件
│   ├── IconExample.tsx           # 图标使用示例
│   └── TripCardExample.tsx       # 卡片使用示例
├── constants/
│   └── designSystem.ts           # 设计系统常量
├── data/
│   └── mockTrips.ts              # Mock 数据
├── theme/
│   ├── designSystem.ts           # 设计系统主题
│   └── index.ts                  # 主题导出
├── types/
│   └── trip.ts                   # 类型定义
├── utils/
│   └── date.ts                   # 日期工具函数
└── tokens.ts                     # 设计令牌
```

## 🚀 使用方法

### 启动项目
```bash
npm install
npx expo start
```

### 主要功能
1. **查看旅行记录**：主页面显示按时间分组的旅行卡片
2. **创建新记录**：点击绿色 "+" 按钮创建新旅行卡片
3. **查看详情**：点击任意卡片跳转到详情页面
4. **切换标签**：在 Visited 和 Planned 之间切换
5. **导航切换**：使用底部导航栏切换不同功能页面

### 组件使用
```tsx
// 使用 TripCard
<TripCard 
  trip={tripData} 
  showGroupLabel={true}
  groupLabel="Today"
/>

// 使用 Bottom Navigation Bar
<BottomNavBar />

// 使用 Header
<Header
  selectedTab="visited"
  onTabChange={handleTabChange}
  onSearch={handleSearch}
  onSort={handleSort}
  onViewChange={handleViewChange}
/>
```

## 🎯 技术特点

- **完全自定义 UI**：不使用任何第三方 UI 库
- **设计还原度高**：100% 按照 Figma 设计实现
- **主题支持**：自动 Light/Dark 主题切换
- **响应式设计**：支持不同屏幕尺寸
- **性能优化**：使用 React.memo 和 useCallback
- **类型安全**：完整的 TypeScript 类型定义

## 🔧 开发环境

- **框架**：Expo + expo-router
- **语言**：TypeScript
- **样式**：React Native StyleSheet
- **图标**：自定义图标系统
- **导航**：expo-router
- **状态管理**：React Hooks

## 📱 支持的平台

- iOS
- Android
- Web (通过 Expo)

## 🎨 设计规范

所有设计元素都严格按照 Figma 设计文件实现：
- 颜色：使用 tokens.ts 中定义的颜色值
- 字体：系统字体，按照设计规范设置大小和权重
- 间距：使用 designSystem 中定义的间距值
- 圆角：按照设计规范设置圆角值
- 阴影：使用预定义的阴影样式

## 🚀 下一步计划

1. 实现 Planned 标签页功能
2. 添加搜索和排序功能
3. 实现旅行详情页面
4. 添加图片上传和媒体管理
5. 实现数据持久化
6. 添加用户认证系统
