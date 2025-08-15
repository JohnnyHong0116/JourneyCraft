import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

export default function Card({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
});


