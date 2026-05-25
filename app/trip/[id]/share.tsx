import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function ShareTripScreen() {
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Share Trip" mode="dark" />
        <SurfaceCard mode="dark" style={styles.shareCard}>
          <Ionicons name="paper-plane-outline" size={36} color={AppPalette.dark.accent} />
          <Text style={styles.title}>Trip to Chengdu</Text>
          <Text style={styles.caption}>Share your journal, photos and trip highlights with friends.</Text>
          {['Copy Link', 'Share as Story', 'Invite Collaborators'].map((action) => (
            <Pressable key={action} style={styles.row} onPress={() => action === 'Invite Collaborators' && router.push('/trip/1/people')}>
              <Text style={styles.rowText}>{action}</Text>
              <Ionicons name="chevron-forward" size={20} color={AppPalette.dark.text} />
            </Pressable>
          ))}
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  shareCard: { marginTop: Spacing.xl, alignItems: 'center', gap: Spacing.md },
  title: { color: AppPalette.dark.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  caption: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm, textAlign: 'center', lineHeight: 21, marginBottom: Spacing.md },
  row: { width: '100%', minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.divider },
  rowText: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '600' },
});
