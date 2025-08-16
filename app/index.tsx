// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import AuthScreen from '../src/screens/AuthScreen';

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <AuthScreen />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });

// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // 临时直接进入 Home 页面
  return <Redirect href="/(tabs)/home" />;
}
