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
// import { initDb } from "../lib/db";
import { initDb } from "../lib/mvp_db";


export default function RootLayout() {
  // useEffect(() => { initDb(); }, []); // intialize projects db on this phone/app if it hasnt been done yet
  return (
    <Stack>
      <Stack.Screen name="projects" options={{ title: "Projects" }} />
      <Stack.Screen name="project/new" options={{ title: "New Project" }} />
      <Stack.Screen name="project/[id]/add_details" options={{ title: "Project" }} />
      <Stack.Screen name="project/[id]/labeling" options={{ title: "Labeling Screen" }} />
      <Stack.Screen name="project/[id]/popup_bs" options={{title: "popup practuce"}}/>
    </Stack>
  );
}
