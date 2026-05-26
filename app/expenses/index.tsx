import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ExpenseBreakdownScreen } from '../../features/expenses/ExpenseBreakdownScreen';

export default function ExpensesScreen() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  return <ExpenseBreakdownScreen tripId={tripId} />;
}
