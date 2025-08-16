# 图标资源目录

## 📁 目录说明

此目录用于存放应用所需的所有图标资源文件。**完全按照 Figma 设计规范，不做任何修改**。每个图标都有 Light 和 Dark 两种模式。

## ⚠️ 当前状态

**注意：目前图标文件尚未添加，应用使用 Ionicons 系统图标作为占位符。**

## 🔄 图标文件命名规范

**完全按照 Figma 设计，不做任何修改：**

### TabBar 图标
- `home-light.png` / `home-dark.png` - 首页按钮
- `location-light.png` / `location-dark.png` - 位置按钮
- `stats-light.png` / `stats-dark.png` - 统计按钮
- `profile-light.png` / `profile-dark.png` - 个人资料按钮

### 功能图标
- `search-light.png` / `search-dark.png` - 搜索按钮
- `more-light.png` / `more-dark.png` - 更多选项按钮
- `calendar-light.png` / `calendar-dark.png` - 日历按钮
- `add-light.png` / `add-dark.png` - 添加按钮

### 卡片左侧竖排图标
- `save-light.png` / `save-dark.png` - 收藏/保存图标
- `lock-light.png` / `lock-dark.png` - 加密图标
- `people-group-light.png` / `people-group-dark.png` - 同行人物图标

### 卡片左下横排图标
- `image-light.png` / `image-dark.png` - 图片图标
- `mic-light.png` / `mic-dark.png` - 录音图标
- `video-light.png` / `video-dark.png` - 视频图标

### 其他图标
- `map-pin-light.png` / `map-pin-dark.png` - 地图定位图标

## 📋 图标规格要求

**完全按照 Figma 设计，不做任何修改：**

- **格式**：PNG 格式，支持透明背景
- **尺寸**：根据 Figma 设计确定，不做任何调整
- **颜色**：完全按照 Figma 设计，不做任何修改
- **风格**：完全按照 Figma 设计，不做任何修改

## 🚀 添加图标步骤

**完全按照 Figma 设计，不做任何修改：**

1. 从 Figma 设计文件导出图标（**不做任何修改**）
2. 按照命名规范重命名文件（**不做任何修改**）
3. 放置到对应目录（**不做任何修改**）
4. 在 `src/assets/icons.ts` 中取消注释对应行（**不做任何修改**）
5. 更新 `src/components/Icon.tsx` 使用自定义图标（**不做任何修改**）

## 🔧 技术实现

图标通过 `src/assets/icons.ts` 统一导出，组件通过 `src/components/Icon.tsx` 使用。

**当前使用 Ionicons 作为占位符，确保应用可以正常运行。**

## 📱 使用示例

```tsx
import { HomeIcon, SearchIcon } from '@/components/Icon';

// 使用图标（完全按照 Figma 设计）
<HomeIcon size={24} />
<SearchIcon size={20} />
```

## ⚠️ 重要提醒

**所有图标必须完全按照 Figma 设计实现，包括：**
- 颜色值（不做任何修改）
- 尺寸规格（不做任何修改）
- 图标样式（不做任何修改）
- 文件命名（不做任何修改）

**任何修改都会影响设计的完整性和一致性。**
