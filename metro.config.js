const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// 添加路径别名支持
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@features': path.resolve(__dirname, 'features'),
  '@ui': path.resolve(__dirname, 'components/ui'),
  '@theme': path.resolve(__dirname, 'src/theme'),
};

module.exports = config;
