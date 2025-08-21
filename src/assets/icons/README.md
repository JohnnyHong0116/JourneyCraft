# 图标资源目录

## 📁 目录说明

此目录用于存放应用所需的所有图标资源文件。自本次更新起：改为“每个图标有 selected / unselected 两种状态”，明暗模式的颜色由组件使用方传入控制，不再用 light/dark 两套资源。

## 现在的约定（重要）

- 资源为纯 SVG 文件
- 每个功能位包含：`selected.svg` 与 `unselected.svg`
- 颜色通过传入 `color`（或使用 CSS-like `currentColor`）由组件层控制

## 🔄 图标文件命名规范

**完全按照 Figma 设计，不做任何修改：**

### TabBar 图标（目录结构）
- `tab/home/selected.svg` / `tab/home/unselected.svg`
- `tab/location/selected.svg` / `tab/location/unselected.svg`
- `tab/stats/selected.svg` / `tab/stats/unselected.svg`
- `tab/profile/selected.svg` / `tab/profile/unselected.svg`

### 功能图标（目录结构）
- `functional/search/selected.svg` / `functional/search/unselected.svg`
- `functional/more/selected.svg` / `functional/more/unselected.svg`
- `functional/calendar/selected.svg` / `functional/calendar/unselected.svg`
- `functional/add/selected.svg` / `functional/add/unselected.svg`

### 卡片图标（目录结构）
- `card/save/selected.svg` / `card/save/unselected.svg`
- `card/lock/selected.svg` / `card/lock/unselected.svg`
- `card/people/selected.svg` / `card/people/unselected.svg`

### 媒体图标（目录结构）
- `media/image/selected.svg` / `media/image/unselected.svg`
- `media/mic/selected.svg` / `media/mic/unselected.svg`
- `media/video/selected.svg` / `media/video/unselected.svg`

### 其他图标
- `map-pin-light.svg` / `map-pin-dark.svg` - 地图定位图标

## 📋 图标规范

- **格式**：纯 SVG（不要嵌入位图）
- **viewBox**：统一如 `0 0 24 24`（或依 Figma），保持等比缩放
- **颜色**：优先使用 `fill="currentColor"`，颜色由组件传入的 `color` 控制；selected/unselected 通过不同的路径形态/描边来区分
- **命名**：统一使用 selected.svg / unselected.svg

## 🚀 添加图标步骤

1. 从 Figma 导出 SVG，填充色改为 `currentColor` 或黑色占位
2. 放入对应目录并命名为 selected.svg / unselected.svg
3. 在 `src/assets/icons.ts` 注册（见下）
4. 在组件中通过 `selected` + `color` 使用

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
