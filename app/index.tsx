import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen } from '@/components/layout/AppScreen';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/auth/sign-in'), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppScreen>
      <View style={styles.brandWrap}>
        <Text style={styles.brand}>JourneyCraft</Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  brandWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 25, fontWeight: '700', color: AppPalette.light.text },
});
