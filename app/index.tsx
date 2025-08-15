import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthScreen from '../src/screens/AuthScreen';

export default function Home() {
  return (
    <View style={styles.container}>
      <AuthScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});


