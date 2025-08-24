export default {
  expo: {
    name: "Mobile App Design",
    slug: "mobile-app-design",
    scheme: "mobileappdesign",             // <— add this for deep linking
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.mobileappdesign"  // <— add this
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.mobileappdesign"           // <— add this
    },
    web: {
      favicon: "./assets/icon.png"
    },
    extra: {
      EXPO_PUBLIC_LOCATIONIQ_KEY: "pk_xxxxxxxxxxxxxxxxxxxxxx", // your real LocationIQ token
    }
  }
};
