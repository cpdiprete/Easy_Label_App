// app/projects.tsx
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Button, Image, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
// import { listProjects, getProject, deleteProject, updateProject, addPrompt, addImage, deleteImage } from "../lib/projectsRepo";
import { listProjects, getProject, deleteProject, updateProject, addPrompt, addImage, deleteImage, getImages, getCoverImageForProject } from "../lib/mvp_projectsRepo";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

// projects are stored in items and grabbed from listProjects() 
export default function Projects() {
    // items
    const [projectsList, setProjectsList] = useState<any[]>([]);
    const [coverImages, setCoverImages] = useState(new Map())
    const refresh = useCallback(() => setProjectsList(listProjects()), []);  // calls listProjects() from /lib/projectsRepo
    useFocusEffect(useCallback(() => { refresh(); }, [refresh])); // called any time this screen comes back into scope
    
    return (
        <ScrollView style={styles.scrollView} 
                contentContainerStyle={{
                    flexGrow: 1,          // takes full height for vertical centering
                    alignItems: "center"  // horizontal centering
                }}>
        {projectsList.map((proj) => (
            
            <View key={proj.id} style={styles.project}>
                    {/* <Image
                        source={{ uri: projectsList[0].uri }}
                        // style={styles.image}
                    /> */}
                <TouchableOpacity onPress={() => 
                    {
                        // console.log("going to id", p.id, "from project: ", p)
                        router.push({ pathname: "/project/[id]/add_details", params: { id: proj.id } })} // SCREEN-CHANGE: head to the specified project details page
                    }
                >
                    <View style={{ padding: 12, backgroundColor: "##D9D9D9", borderRadius: 12, marginTop: 8 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{proj.title}</Text>
                        <Text>{proj.admin} | {proj.organization}</Text>
                        {/* <Text>{p.admin}</Text> */}
                        {proj.cover ? (
                        <Image source={{ uri: proj.cover }} style={{ width: "100%", height: 180, marginTop: 8, borderRadius: 8 }} />
                        ) : null}
                        <Text numberOfLines={3} style={{ marginTop: 6 }}>{proj.description}</Text>
                    </View>
                </TouchableOpacity>

                {/* <View></View> */}
                <Text>{proj.progress} labeled</Text>
                <TouchableOpacity 
                    style = {{backgroundColor: "#E86100", borderRadius:50}}
                        onPress={()=> router.push({pathname: "/project/[id]/labeling", params:{id: proj.id}} // SCREEN-CHANGE: head to the specified project details page
                    )}> 
                        <Text style={{color:"#FFFFFF", fontWeight:"semibold", paddingHorizontal:14}}>Continue Labeling</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{backgroundColor: "red", flexDirection:"row", borderRadius:3, paddingHorizontal:3, marginTop:4}}
                    onPress={() => {
                        deleteProject(proj.id) // delete this project
                        refresh();
                    }}>
                    <MaterialIcons name="delete" size={20} color="white"/> 
                    <Text>Delete project</Text>
                </TouchableOpacity>
            </View>
        ))}
            <TouchableOpacity style={{borderWidth:2, borderRadius:5, paddingHorizontal:2, borderColor:"blue"}} 
                onPress={() => 
                    router.push("/project/new") // SCREEN-CHANGE: head to the specified project details page
                }>
                <Text style={{color:"blue", fontSize:18}}>+ New Project</Text>
            </TouchableOpacity>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 6,
        padding: 12,
        // justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "lightblue",
    },
    project: {
        justifyContent: "center",
        alignItems: "center",
        // padding:12,
        margin:6,
        width:"90%",
        backgroundColor: "#D9D9D9",
        borderRadius: "5%"
    },
    imageBackground: {
        backgroundColor: 'lightpink',
        // width: 150,
        // height: 150.
        flex: 1
    },
    orangeText: {
        color: 'darkorange',
        fontWeight: "bold"
    },
    titleText: {
        fontWeight: "bold"
    }
})
