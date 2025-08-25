    import React, { useState } from "react";
    import {
        View,
        Text,
        TextInput,
        Button,
        Modal,
        Pressable,
        TouchableOpacity,
        StyleSheet,
        StyleSheet as RNStyleSheet,
    } from "react-native";

    export default function PopupExampleScreen() {
        const [open, setOpen] = useState(false);
        const [promptText, setPromptText] = useState("");

        const save = () => {
            // Do something with promptText...
            setOpen(false);
            setPromptText("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Screen</Text>
            <Button title="Add Prompt" onPress={() => setOpen(true)} />

            <Modal
                visible={open}
                animationType="fade"
                transparent
                onRequestClose={() => setOpen(false)} // Android back button
            >
                {/* Backdrop + centered sheet */}
                <View style={styles.backdrop}>
                    {/* Click outside to dismiss */}
                    <Pressable style={RNStyleSheet.absoluteFill} onPress={() => setOpen(false)} />

                    {/* Popup content */}
                    <View style={styles.sheet}>
                        <Text style={styles.sheetTitle}>New Prompt</Text>
                        <TextInput
                            placeholder="Enter prompt text"
                            value={promptText}
                            onChangeText={setPromptText}
                            style={styles.input}
                        />
                        <View style={styles.row}>
                        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={save}>
                            <Text style={styles.btnPrimaryText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => setOpen(false)}>
                            <Text style={styles.btnGhostText}>Cancel</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },

    // Modal
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)", // <-- dim background
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    sheet: {
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
    },
    sheetTitle: { fontSize: 18, fontWeight: "600" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
    row: { flexDirection: "row", gap: 12, marginTop: 8 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
    btnPrimary: { backgroundColor: "#2563eb" },
    btnPrimaryText: { color: "#fff", fontWeight: "600" },
    btnGhost: { backgroundColor: "#f2f2f2" },
    btnGhostText: { color: "#111" },
    });
