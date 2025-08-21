const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// SVG support (react-native-svg + transformer)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  // 路径别名
  alias: {
    '@': path.resolve(__dirname, 'src'),
    '@features': path.resolve(__dirname, 'features'),
    '@ui': path.resolve(__dirname, 'components/ui'),
    '@theme': path.resolve(__dirname, 'src/theme'),
  },
};

module.exports = config;
