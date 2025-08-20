// import { Stack } from "expo-router";
// import * as React from 'react';
// import { View, Text } from 'react-native';
// import { createStaticNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { StatusBar } from "expo-status-bar";

// export default function RootLayout() {
//   return (
//     <React.Fragment>
//       <StatusBar style="auto">
//       </StatusBar>
//       <Stack/>
//     </React.Fragment>
//   );
// }

// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDb } from "../lib/db";

export default function RootLayout() {
  useEffect(() => { initDb(); }, []);
  return (
    <Stack>
      <Stack.Screen name="projects" options={{ title: "Projects" }} />
      <Stack.Screen name="project/new" options={{ title: "New Project" }} />
      <Stack.Screen name="project/[id]" options={{ title: "Project" }} />
    </Stack>
  );
}
