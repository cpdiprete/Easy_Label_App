// app/index.tsx is the initial route, and will appear first when you open the app or navigate to your web app's root URL.

import { Text, View, Button } from "react-native";
import {Link, useRouter} from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Go to projects"
      onPress={() => {
        router.push("/projects")
      }}>

      </Button>
    </View>
  );
}