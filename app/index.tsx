import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppScreen } from '@/components/layout/AppScreen';
import { BrandLogo } from '@/brand/BrandLogo';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/auth/sign-in'), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppScreen>
      <View style={styles.brandWrap}>
        <BrandLogo width={260} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  brandWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
