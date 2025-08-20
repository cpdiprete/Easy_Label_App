// app/project/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getProject, updateProject, addPrompt, addImage, deleteImage } from "../../lib/projectsRepo";

export default function ProjectDetail() {
const { id } = useLocalSearchParams<{ id: string }>();
const [project, setProject] = useState<any>(null);
const [title, setTitle] = useState("");
const [org, setOrg] = useState("");
const [admin, setAdmin] = useState("");
const [desc, setDesc] = useState("");

const refresh = useCallback(() => {
    if (!id) return;
    const p = getProject(id);
    setProject(p);
    if (p) { setTitle(p.title); setOrg(p.organization); setAdmin(p.admin); setDesc(p.description ?? ""); }
}, [id]);

useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

if (!project) return <ScrollView contentContainerStyle={{ padding: 16 }}><Text>Project not found.</Text></ScrollView>;

const saveBasics = () => {
    updateProject(project.id, { title, organization: org, admin, description: desc });
    refresh();
};

const onAddPrompt = () => {
    addPrompt(project.id, "New question?", ["Option A", "Option B"]);
    refresh();
};

const onAddImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (res.canceled || !res.assets?.length) return;

    const src = res.assets[0].uri;                           // e.g., file:///… or ph://…
    const filename = src.split("/").pop() || `img-${Date.now()}.jpg`;
    const dest = `${FileSystem.documentDirectory}images/${project.id}-${Date.now()}-${filename}`;

    // Ensure folder exists
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images/`, { intermediates: true }).catch(() => {});
    // Copy into app sandbox for stability
    await FileSystem.copyAsync({ from: src, to: dest });

    addImage(project.id, dest);
    refresh();
};

const onDeleteImage = async (uri: string) => {
    try { await FileSystem.deleteAsync(uri, { idempotent: true }); } catch {}
    deleteImage(project.id, uri);
    refresh();
};

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
    <Button title="Save Basics" onPress={saveBasics} />

    <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 12 }} />

    <Text style={{ fontWeight: "bold" }}>Images</Text>
    <Button title="Add Image" onPress={onAddImage} />
    {project.images.map((uri: string) => (
        <View key={uri} style={{ marginTop: 8 }}>
        <Image source={{ uri }} style={{ width: "100%", height: 220, borderRadius: 8 }} />
        <Button title="Delete image" onPress={() => onDeleteImage(uri)} />
        </View>
    ))}

    <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 12 }} />

    <Text style={{ fontWeight: "bold" }}>Prompts</Text>
    <Button title="Add Prompt" onPress={onAddPrompt} />
    {project.prompts.map((p: any) => (
        <View key={p.id} style={{ marginTop: 8, padding: 8, backgroundColor: "#f7f7f7", borderRadius: 8 }}>
        <Text style={{ fontWeight: "600" }}>{p.question}</Text>
        <Text>Options: {p.options.map((o: any) => o.text).join(", ")}</Text>
        </View>
    ))}
    </ScrollView>
);
}
