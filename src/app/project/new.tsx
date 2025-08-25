import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Modal } from "react-native";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { createProject } from "../../lib/projectsRepo";

export default function NewProject() {
    const [title, setTitle] = useState("");
    const [org, setOrg] = useState("");
    const [admin, setAdmin] = useState("");
    const [desc, setDesc] = useState("");

      // PDF state
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    // simple defaults
    const defaultPrompts = [
        { question: "What is the technical adequacy of the image?", options: ["Adequate", "Artifact", "Unreadable"] },
        { question: "What type of tubule is this?", options: ["Proximal", "Distal", "Other"] },
    ];

    const pickPdf = async () => {
        const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: false,
        });
        if (res.canceled || !res.assets?.length) return;

        const asset = res.assets[0];
        const name = asset.name?.endsWith(".pdf") ? asset.name : `${asset.name || "protocol"}-${Date.now()}.pdf`;

        // Copy into app sandbox so it's always readable by your app
        const dir = `${FileSystem.documentDirectory}protocols/`;
        try { await FileSystem.makeDirectoryAsync(dir, { intermediates: true }); } catch {}
        const dest = `${dir}${name}`;
        await FileSystem.copyAsync({ from: asset.uri, to: dest });

        setPdfUri(dest);      // e.g. file:///data/.../protocols/whatever.pdf
        setPdfName(name);
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Organization</Text>
        <TextInput value={org} onChangeText={setOrg} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Admin Contact</Text>
        <TextInput value={admin} onChangeText={setAdmin} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
        <Text>Brief Description</Text>
        <TextInput value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, padding: 8, borderRadius: 8, minHeight: 80 }} />

        {/* PDF picker */}
        <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 8 }} />
        <Text style={{ fontWeight: "600" }}>Protocol PDF</Text>
        <Button title={pdfUri ? "Replace PDF" : "Select Protocol PDF"} onPress={pickPdf} />
        {pdfUri ? (
        <>
            <Text style={{ marginTop: 6 }}>Selected: {pdfName}</Text>
            <Button title="Preview PDF" onPress={() => setPreviewOpen(true)} />
        </>
        ) : null}
        <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 8 }} />
        <Button
            title="Create Project"
            onPress={() => {
                const id = createProject({
                    title: title.trim() || "Untitled",
                    admin: admin.trim() || "unknown",
                    organization: org.trim() || "unknown",
                    description: desc.trim(),
                    prompts: defaultPrompts,
                    imageUris: [], // add images later in the detail screen
                });
                router.replace({ pathname: "/project/[id]/add_details", params: { id } });
            }}
        />
        </ScrollView>
    );
}
