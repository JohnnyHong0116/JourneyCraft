import React from 'react';
import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';
import { BRAND_NAMES } from './brandAssets';

const logoLight = require('../../assets/brand/journeycraft-logo-light.png');
const logoMono = require('../../assets/brand/journeycraft-logo-mono.png');
const iconFlat = require('../../assets/brand/journeycraft-icon-flat.png');

type BrandLogoVariant = 'light' | 'mono' | 'icon';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  width?: number;
  style?: StyleProp<ImageStyle>;
}

export function BrandLogo({ variant = 'light', width = 240, style }: BrandLogoProps) {
  const source = variant === 'mono' ? logoMono : variant === 'icon' ? iconFlat : logoLight;
  const aspectRatio = variant === 'icon' ? 1 : 1.5;

  return (
    <Image
      accessibilityIgnoresInvertColors
      accessibilityLabel={`${BRAND_NAMES.english} ${BRAND_NAMES.chinese}`}
      resizeMode="contain"
      source={source}
      style={[styles.logo, { width, height: width / aspectRatio }, style]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
});

