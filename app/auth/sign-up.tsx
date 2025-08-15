import React from 'react';
import { View, StyleSheet } from 'react-native';
import AuthScreen from '@features/auth/screens/AuthScreen';

export default function SignUp() {
  return (
    <View style={styles.container}>
      <AuthScreen initialTab="signup" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});


