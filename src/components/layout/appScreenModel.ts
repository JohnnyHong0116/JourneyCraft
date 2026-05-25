export function getScrollBottomInset(bottomInset: number, footerHeight = 0): number {
  return bottomInset + footerHeight;
}

export function getFooterBottomInset(safeAreaBottom: number, keyboardVisible: boolean): number {
  return keyboardVisible ? 0 : safeAreaBottom;
}

export function getFooterVisualHeight(toolbarHeight: number, bottomInset: number): number {
  return toolbarHeight + bottomInset;
}
