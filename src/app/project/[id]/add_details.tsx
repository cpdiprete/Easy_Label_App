import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
// import { getProject, updateProject, addPrompt, addImage, deleteImage } from "../../../lib/projectsRepo";
// import { getProject, updateProject, addPrompt, addImage, deleteImage, getPromptOptions, getPromptAnswerChoices } from "../../../lib/mvp_projectsRepo";
import { getProject, updateProject, addPrompt, addImage ,deleteImage, getPromptOptions, getPromptAnswerChoices } from "../../../lib/mvp_projectsRepo";

export default function ProjectDetail() {
    const [promptText, setPromptText] = useState("");
    const [showAddPromptUI, setShowAddPromptUI] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [answers, setAnswers] = useState<string[]>([""]);
    const { id } = useLocalSearchParams<{ id: string }>();
    const project_id = Number(id);
    const [project, setProject] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [labeledCount, setLabeledCount] = useState(2);
    const [userInputOrg, setUserInputOrg] = useState("");

// User inputted project attribures
    const [userInputAdminContact, setUserInputAdminContact] = useState("");
    const [userInputDesc, setUserInputDesc] = useState("");
    const [displayPrompts, setDisplayPrompts] = useState<any>("")
    const [promptOptionsMap, setPromptOptionsMap] = useState<any>(new Map())
    const [displayImages, setDisplayImages] = useState("")

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
        if (!project_id) {
            console.log("Id not found in add_details")
            return
        }
        const p = getProject(project_id);
        setProject(p);
        const project_prompts = getPromptOptions(project_id)
        setDisplayPrompts(project_prompts)
        const newMap = new Map()
        project_prompts.forEach(prompt => {
            newMap.set(prompt.id, getPromptAnswerChoices(prompt.id))
        });
        setPromptOptionsMap(newMap)
        console.log("set project")
        if (p) { 
            setTitle(p.title)
            setUserInputOrg(p.organization)
            setUserInputAdminContact(p.admin_contact)
            setUserInputDesc(p.description ?? "")
        }
        else {
            console.log("project not gotten.. in add_details refresh() func")
        }
    }, [id]);

    useFocusEffect(useCallback(() => { 
        refresh(); 
    }, [refresh]));

    if (!project) {
        return <ScrollView contentContainerStyle={{ padding: 16 }}><Text>Project noot found.</Text></ScrollView>;
    }

    const saveBasics = () => {
        updateProject(project.id, { title, organization: userInputOrg, admin_contact:userInputAdminContact, description: userInputDesc});
        refresh();
    };


    const onAddImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            console.log("add_details.onAddImage() Not allowed to pick image")
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
        if (res.canceled || !res.assets?.length) {
            console.log("add_details.onAddImage() some shit went wrong")
            return;
        }

        const src = res.assets[0].uri;                           // e.g., file:///… or ph://…
        const filename = src.split("/").pop() || `img-${Date.now()}.jpg`;
        const dest = `${FileSystem.documentDirectory}images/${project.id}-${Date.now()}-${filename}`;

        // Ensure folder exists
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images/`, { intermediates: true }).catch(() => {});
        // Copy into app sandbox for stability
        await FileSystem.copyAsync({ from: src, to: dest });

        // addImage(project.id, dest);
        addImage(project_id, dest);
        console.log("add_details.onAddImage().. added image")
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
                <TextInput value={userInputOrg} onChangeText={setUserInputOrg} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
                <Text>Admin</Text>
                <TextInput value={userInputAdminContact} onChangeText={setUserInputAdminContact} style={{ borderWidth: 1, padding: 8, borderRadius: 8 }} />
                <Text>Description</Text>
                <TextInput value={userInputDesc} onChangeText={setUserInputDesc} multiline style={{ borderWidth: 1, padding: 8, borderRadius: 8, minHeight: 80 }} />
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
                {displayPrompts.map((prompt: any) => (
                    <View key={prompt.id} style={{ marginTop: 8, padding: 8, backgroundColor: "#f7f7f7", borderRadius: 8 }}>
                        <Text style={{ fontWeight: "600" }}>{prompt.question_text}</Text>
                        <Text> Options: {
                            (promptOptionsMap.get(prompt.id) ?? [])
                            .map((o: any) => o.option_text)
                            .join(", ")
                        }
                        </Text>
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