import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getProject, updateProject, addPrompt, addImage, deleteImage } from "../../../lib/projectsRepo";


export default function ProjectDetail() {
const [promptText, setPromptText] = useState("");
const [showAddPromptUI, setShowAddPromptUI] = useState(false);
const [questionText, setQuestionText] = useState("");
const [answers, setAnswers] = useState<string[]>([""]);
const { id } = useLocalSearchParams<{ id: string }>();
const [project, setProject] = useState<any>(null);
const [title, setTitle] = useState("");
const [org, setOrg] = useState("");
const [admin, setAdmin] = useState("");
const [desc, setDesc] = useState("");

    const addAnswer = () => setAnswers(prev => [...prev, ""]);
    const updateAnswer = (i: number, text: string) =>
    setAnswers(prev => {
        const copy = [...prev];
        copy[i] = text;
        return copy;
    });

    const savePrompt = () => {
        const cleanAnswers = answers.map(a => a.trim()).filter(Boolean);
        console.log(cleanAnswers)
        if (!(questionText.trim())) {
            console.log("Cant add prompt of blank question")
        } else if (!(cleanAnswers.length)) {
            console.log("Can't add prompt with blank answers")
        } else {
            addPrompt(project.id, questionText.trim(), cleanAnswers);
            setShowAddPromptUI(false);
            setQuestionText("");
            setAnswers([""]);
            refresh();
        }
    };


    const onAddPrompt = () => {
        setShowAddPromptUI(true);
        // const [showAddPromptUI, setShowAddPromptUI] = useState(false);
        // <View>
        //     <TextInput
        //         defaultValue="Prompt"
        //         // value={promptText}
        //         // onChangeText={setPromptText}
        //     >
        //     </TextInput>
        //     <TouchableOpacity
        //         style={{backgroundColor: "red"}}
        //         onPress={() => {
        //             addPrompt(project.id, "New question?", ["Option A", "Option B"]);
        //         }}>
        //             <Text>butttontntn</Text>
        //     </TouchableOpacity>
        // </View>
        // refresh();
    };

    const refresh = useCallback(() => {
        if (!id) {
            return
        }
        const p = getProject(id);
        setProject(p);
        console.log("set project")
        // console.log(project, p)
        if (p) { 
            setTitle(p.title)
            setOrg(p.organization)
            setAdmin(p.admin)
            setDesc(p.description ?? "")
        }
    }, [id]);

    useFocusEffect(useCallback(() => { 
        refresh(); 
    }, [refresh]));

    if (!project) {
        return <ScrollView contentContainerStyle={{ padding: 16 }}><Text>Project noot found.</Text></ScrollView>;
    }

    const saveBasics = () => {
        updateProject(project.id, { title, organization: org, admin, description: desc });
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
            <ScrollView>
                <Modal
                    visible={showAddPromptUI}
                    style={styles.promptPopup}
                >
                    <View style={styles.screenLayout}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowAddPromptUI(false)} />
                        <View style={styles.popupContent}>
                            <TextInput
                                defaultValue="New question (edit this)"
                                value={questionText}
                                onChangeText={setQuestionText}
                                placeholder="Question"
                                style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}/>
                        </View>
                        {answers.map((a, i) => (
                            <TextInput
                                key={i}
                                value={a}
                                onChangeText={(t) => updateAnswer(i, t)}
                                placeholder={`Answer ${i + 1}`}
                                style={{ borderWidth: 1, padding: 8, borderRadius: 6, marginTop: 8 }}
                            />
                        ))}
                        <TouchableOpacity onPress={addAnswer} style={{ marginTop: 8 }}>
                            <Text style={{color:"blue"}}>+ Answer Choice</Text>
                        </TouchableOpacity>
                    </View>
                    <Button title="Save" onPress={savePrompt} />

                </Modal>
                <Text>Title</Text>
                <TextInput value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
                <Text>Organization</Text>
                <TextInput value={org} onChangeText={setOrg} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
                <Text>Admin</Text>
                <TextInput value={admin} onChangeText={setAdmin} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
                <Text>Description</Text>
                <TextInput value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, padding: 8, borderRadius: 8, minHeight: 80 }} />
                <Button title="Save Basics" onPress={saveBasics} />

                <View style={{backgroundColor: "#000", marginVertical: 12 }} />

                <Text style={{ fontWeight: "bold" }}>Images</Text>
                <Button title="Add Image" onPress={onAddImage} />
                {project.images.map((uri: string) => (
                    <View key={uri} style={{ marginTop: 8 }}>
                    <Image source={{ uri }} style={{ width: "100%", height: 220, borderRadius: 8 }} />
                    <Button title="Delete image" onPress={() => onDeleteImage(uri)} />
                    </View>
                ))}
                <View style={{marginVertical: 12 }}>
                    <Text style={{ fontWeight: "bold", color:"000" }}>Prompts</Text>
                    <Button title="Add Prompt" onPress={onAddPrompt} />
                </View>

                {project.prompts.map((p: any) => (
                    <View key={p.id} style={{ marginTop: 8, padding: 8, backgroundColor: "#f7f7f7", borderRadius: 8 }}>
                    <Text style={{ fontWeight: "600" }}>{p.question}</Text>
                    <Text>Options: {p.options.map((o: any) => o.text).join(", ")}</Text>
                    </View>
                ))}
            </ScrollView>
        );
}
const styles = StyleSheet.create({
    promptPopup: {
        backgroundColor: "rgba(0,0,0,0.45)", padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    screenLayout: {
        flex: 1,
        padding: 20,
        justifyContent: "center"
    },
    popupContent: {
        width: "100%",
        maxWidth: 520,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        gap: 12,
        // drop shadow
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    }
})