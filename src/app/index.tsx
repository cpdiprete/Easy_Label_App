// app/index.tsx is the initial route, and will appear first when you open the app or navigate to your web app's root URL.

import { Text, View, Button } from "react-native";
import {Link, useRouter} from "expo-router";
import { clearDbData, clearDbSchema, initDb } from "../lib/db";

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
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Button title="Go to projects"
      onPress={() => {
        router.push("/projects")
      }}>
      </Button>
      <Button title="Clear database data (keep schema)"
      onPress={() => {
        clearDbData();
      }}>
      </Button>

      <Button title="Clear database data (remove schema)"
      onPress={() => {
        clearDbSchema();
      }}>
      </Button>
      <Button title="init database"
      onPress={() => {
        initDb();
      }}>
      </Button>
    </View>
  );
}