# 图标资源目录（已扁平化）

## 📁 存储规则
- 所有图标直接存放在 `src/assets/icons/` 目录（无分区子目录）。
- 支持两类：
  - 双态：`*-selected.svg` / `*-unselected.svg`
  - 单态：仅一个 `.svg` 文件（两态时使用同一个资源）
- 颜色请在组件中通过 `color` 传入；SVG 内部推荐使用 `currentColor`。

## ✅ 实际文件与名称（已核对）

### Tab / 导航（双态）
- `home-selected.svg` / `home-unselected.svg`
- `map-selected.svg` / `map-unselected.svg`
- `stats-selected.svg` / `stats-unselected.svg`
- `profile-selected.svg` / `profile-unselected.svg`

### 常用功能（双态）
- `search-selected.svg` / `search-unselected.svg`
- `setting-selected.svg` / `setting-unselected.svg`
- `filter-selected.svg` / `filter-unselected.svg`

### 常用功能（单态 → 两态同源）
- `add.svg`

### 媒体与标记（双态）
- `photo-selected.svg` / `photo-unselected.svg`
- `pin-selected.svg` / `pin-unselected.svg`

### 时间/状态（双态）
- `date-selected.svg` / `date-unselected.svg`
- `hourglass-selected.svg` / `hourglass-unselected.svg`
- `bell-selected.svg` / `bell-unselected.svg`

### 收藏（双态）
- `bookmark-selected.svg` / `bookmark-unselected.svg`
- `bookmarksmall-selected.svg` / `bookmarksmall-unselected.svg`

### 卡片内容/操作（单态 → 两态同源）
- `cardimage.svg`
- `cardlock.svg`
- `cardmic.svg`
- `cardpeople.svg`
- `cardsave.svg`
- `cardvideo.svg`
- `cardview.svg`
- `edit.svg`
- `sorting.svg`
- `piechart.svg`
- `threedots.svg`
- `threedots-smaller.svg`
- `redooutline.svg`
- `undooutline.svg`

### 圆形功能类（单态）
- `circlecalendarview.svg`
- `circlecardview.svg`
- `circleclose.svg`
- `circledelete.svg`
- `circlefilter.svg`
- `circlemenu.svg`
- `circlephoto.svg`
- `circlepin.svg`
- `circleredo.svg`
- `circlesave.svg`
- `circlesearch.svg`
- `circleshare.svg`
- `circlesharenew.svg`
- `circlesort.svg`
- `circlethreedots.svg`
- `circleundo.svg`
- `circleunpin.svg`
- `circleunsave.svg`

### 人物数量（单态）
- `people0.svg`
- `people1.svg`
- `people2.svg`
- `peoplemulti.svg`

### 心情状态（单态）
- `overjoyed.svg`
- `happy.svg`
- `neural.svg`
- `sad.svg`
- `depressed.svg`

## 🔧 代码接入

图标统一通过 `Icon` 组件使用，文件映射在 `src/assets/icons.ts` 的 `IconSvg` 中已注册：

```tsx
import { Icon } from '@/components/Icon';

// 双态
<Icon name="home-selected" size={24} color="#22C55E" />
<Icon name="home-unselected" size={24} color="#6B7280" />

// 单态（已在映射中扩展为双态同源）
<Icon name="add-selected" size={38} color="#FFFFFF" />

// 根据状态动态切换
const isActive = true;
<Icon name={isActive ? 'map-selected' : 'map-unselected'} size={24} color={isActive ? '#22C55E' : '#6B7280'} />

// 心情图标使用
<Icon name="happy" size={25} color={Colors.textPrimary} />
<Icon name="sad" size={25} color={Colors.textPrimary} />
```

注意：单态图标在 `icons.ts` 中已通过 `single('file.svg')` 处理为 selected/unselected 同源，因此在使用层可以同样写成 `*-selected` / `*-unselected`。

## 📌 BottomNavBar 指南

- 使用的图标：
  - Home：`home-selected`
  - Location：`pin-selected`
  - Stats：`stats-selected`
  - Profile：`profile-selected`
  - Add（FAB）：`add-selected`

- 颜色（含明暗模式，取自 `src/tokens.ts`）：
  - 选中：`colors.light.navbarSelected` / `colors.dark.navbarSelected`
  - 未选中：`colors.light.navbarUnselected` / `colors.dark.navbarUnselected`
  - Add（FAB 背景）：`colors.light.addButton` / `colors.dark.addButton`

## 🧰 Troubleshooting（add 图标看起来过小/太细）
- 现象：绿色圆内的白色加号显得很小或线条过细。
- 原因（最常见）：
  - `add.svg` 的绘制区域（图形实际占比）在 `viewBox` 中比例过小，导致整体缩放时视觉过小。
  - 图标画板存在额外留白（padding），缩放后有效图形占比进一步减小。
  - 线条使用 `stroke-width` 太小；或没有使用 `stroke-linecap="round"` 与 `stroke-linejoin="round"`，视觉更细。
- 建议规范：
  - `viewBox` 建议为 `0 0 24 24`，加号图形建议占据 70%~80% 的宽高，居中。
  - 线条：`stroke="currentColor"`，`stroke-width="2"~"2.5"`，`stroke-linecap="round"`，`stroke-linejoin="round"`。
  - 不要在 `add.svg` 内再绘制背景圆形；圆形由 FAB 背景提供，图标仅输出加号线段。

## 🧭 命名约定
- 基础名全小写，词间用连字符（`-`）连接。
- 双态使用 `-selected` / `-unselected` 后缀。
- 单态保持原名（在映射中自动扩展为双态）。

## 🧪 检查清单
- [x] 目录为扁平结构
- [x] 文档与实际文件名一一对应
- [x] 组件用法示例可直接复制使用
- [x] 单态与双态均已覆盖
- [x] Add 图标绘制规范与常见问题说明
