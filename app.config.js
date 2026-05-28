import 'dotenv/config';

const brandAssets = {
  iconFlat: "./assets/brand/journeycraft-icon-flat.png",
  iconLiquidGlass: "./assets/brand/journeycraft-icon-liquid-glass.png",
  logoLight: "./assets/brand/journeycraft-logo-light.png",
  logoMono: "./assets/brand/journeycraft-logo-mono.png",
};

export default {
  expo: {
    name: "JourneyCraft",
    slug: "journeycraft-app",
    scheme: "journeycraft",
    version: "1.0.0",
    orientation: "portrait",
    icon: brandAssets.iconFlat,
    userInterfaceStyle: "light",
    splash: {
      image: brandAssets.logoLight,
      resizeMode: "contain",
      backgroundColor: "#F8F2E4"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      icon: brandAssets.iconFlat,
      bundleIdentifier: "com.journeycraft.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: brandAssets.iconFlat,
        backgroundColor: "#F8F2E4"
      },
      package: "com.journeycraft.app"
    },
    web: {
      favicon: brandAssets.iconFlat
    },
    extra: {
      EXPO_PUBLIC_LOCATIONIQ_KEY: process.env.EXPO_PUBLIC_LOCATIONIQ_KEY,
      brand: {
        iconLiquidGlass: brandAssets.iconLiquidGlass,
        logoMono: brandAssets.logoMono,
      },
    }
  }
};
