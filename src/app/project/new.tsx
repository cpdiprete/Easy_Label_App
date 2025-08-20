// app/project/new.tsx
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { createProject } from "../../lib/projectsRepo";

export default function NewProject() {
const [title, setTitle] = useState("");
const [org, setOrg] = useState("");
const [admin, setAdmin] = useState("");
const [desc, setDesc] = useState("");

// simple defaults
const defaultPrompts = [
    { question: "What is the technical adequacy of the image?", options: ["Adequate", "Artifact", "Unreadable"] },
    { question: "What type of tubule is this?", options: ["Proximal", "Distal", "Other"] },
];

return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
    <Text>Title</Text>
    <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
    <Text>Organization</Text>
    <TextInput value={org} onChangeText={setOrg} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
    <Text>Admin</Text>
    <TextInput value={admin} onChangeText={setAdmin} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
    <Text>Description</Text>
    <TextInput value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, padding: 8, borderRadius: 8, minHeight: 80 }} />

    <Button
        title="Create"
        onPress={() => {
        const id = createProject({
            title: title.trim() || "Untitled",
            admin: admin.trim() || "unknown",
            organization: org.trim() || "unknown",
            description: desc.trim(),
            prompts: defaultPrompts,
            imageUris: [], // add images later in the detail screen
        });
        router.replace({ pathname: "/project/[id]", params: { id } });
        }}
    />
    </ScrollView>
);
}
