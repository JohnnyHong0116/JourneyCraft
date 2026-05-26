import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TripEditorScreen } from '../../../features/trip/TripEditorScreen';

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TripEditorScreen tripId={id} />;
}
