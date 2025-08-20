// import { Text, View, ScrollView, StyleSheet, Image, Button, ImageSourcePropType } from "react-native";
// import { Link, router } from "expo-router";
// import { useRoute } from "@react-navigation/native"
// import { useState } from "react";
// import { projectsData } from "../lib/projectsData" 

// type Prompt = { question: string; answers: string[] };
// type PromptWrapper = { prompt: Prompt };

// // Define a type for props
// type ProjectProperties = {
//     title: string;
//     organization: string;
//     contact: string;
//     description: string;
//     images: ImageSourcePropType[];
//     prompts: PromptWrapper[];
// };

// const data = [
//     { 
//         projects: [
//             {
//                 title:"Testing",
//                 admin:"Calvin",
//                 organization:"Sigma Nu",
//                 protocolpdf:"www.boom",
//                 images: [require("../../assets/tubule_for_Calvin/1.png")],
//                 description:"This project is about blah blah and mor eblh and some other blah and blah and duuuude b;ah blah",
//                 prompts: [
//                     {
//                         prompt: {
//                             question: "What is the technical adequacy of the image?",
//                             answers: ["Adequate", "Artifact", "Unreadable"]
//                         },
//                     },
//                     {
//                         prompt: {
//                             question: "What type of tubule is this?",
//                             answers: ["Proximal", "Distal", "Other"]
//                         },
//                     },
//                     {
//                         prompt: {
//                             question: "What type of tubule is this?",
//                             answers: ["Proximal", "Distal", "Other"]
//                         }
//                     },
//                 ]
//             },
//             {
//                 title:"Project2",
//                 admin:"fanfan@emory.edu",
//                 organization:"Emory",
//                 protocolpdf:"www.boom",
//                 images: [require("../../assets/tubule_for_Calvin/2.png")],
//                 description:"This is the 2nd project I want to test and see if this renders or not",
//                 prompts: [
//                     {
//                         prompt: {
//                             question: "What is the technical adequacy of the image?",
//                             answers: ["Adequate", "Artifact", "Unreadable"]
//                         },
//                     },
//                     {
//                         prompt: {
//                             question: "What type of tubule is this?",
//                             answers: ["Proximal", "Distal", "Other"]
//                         },
//                     },
//                     {
//                         prompt: {
//                             question: "What type of tubule is this?",
//                             answers: ["Proximal", "Distal", "Other"]
//                         }
//                     },
//                 ]
//             }
//         ],
//     }
// ];



// const Project = ({title, organization, contact, description, prompts, images} : ProjectProperties) => {
//     // console.log("images = ", images)
//     // const [selectedProject, SetSelectedProject] = useState(["", "", "", "", "", [""]]);
//     // const path = "../.." + String(images[0])
//     return (
//         <View
//         style={styles.project}>
//             <Text style={styles.titleText}>{title}</Text>
//             <Text style={styles.orangeText}>Contact = {contact}</Text>
//             <View
//                 style={styles.imageBackground}>
//                     <Image
//                     // source={require(path)}
//                     source ={images[0]}
//                     // style={{width:"50%"}}
//                     >
                        
//                     </Image>
//             </View>
//             {/* <Link></Link> */}
//             {/* <Text>Description of the project blah blaj blah Description of the project blah blaj blah Description of the project blah blaj blah</Text> */}
//             <Text style={{marginVertical:5, marginHorizontal:10, alignContent:"center"}}>{description}</Text>
//             <Button title="Continue"
//                 onPress={() => {
//                     // SetSelectedProject([title, organization, contact, description, images])
//                     console.log("PROMPTS BEING PASSED", JSON.stringify(prompts))
//                     router.push({pathname: "/project", params: {title: title, organization: organization, contact: contact, description:description, prompts: JSON.stringify(prompts)}})
//                 }}>
//             </Button>
//         </View>
//     );
// }

// const ProjectScreen = () => {
//     return (

//         <ScrollView
//             style={styles.scrollView}
//                 contentContainerStyle={{
//                     flexGrow: 1,          // ensures it takes full height for vertical centering
//                     // justifyContent: "center", //vertical centering
//                     alignItems: "center"  // horizontal centering
//                 }}
//             >
//             {/* {data[0].projects.map((proj, i) => (
//                 <Project
//                     key={`${proj.title}-${i}`}
//                     title={proj.title}
//                     organization={proj.organization}
//                     contact={proj.admin}
//                     description={proj.description}
//                     images={proj.images}
//                     prompts={proj.prompts}
//                 />
//             )
//             )} */}
//             {projectsData.map(proj => (
//                 <Project
//                     key={proj.id}
//                     title={proj.title}
//                     organization={proj.organization}
//                     contact={proj.admin}
//                     description={proj.description}
//                     images={proj.images}
//                     prompts={proj.prompts}
//                     // For detail page by id:
//                     // onPress={() => router.push({ pathname: "/project/[id]", params: { id: proj.id } })}
//                 />
//             ))}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     scrollView: {
//         flex: 6,
//         padding: 12,
//         // justifyContent: "center",
//         // alignItems: "center",
//         backgroundColor: "lightblue",
//     },
//     project: {
//         justifyContent: "center",
//         alignItems: "center",
//         // padding:12,
//         margin:6,
//         width:"80%",
//         backgroundColor: "lightgray"
//     },
//     imageBackground: {
//         backgroundColor: 'lightpink',
//         // width: 150,
//         // height: 150.
//         flex: 1
//     },
//     orangeText: {
//         color: 'darkorange',
//         fontWeight: "bold"
//     },
//     titleText: {
//         fontWeight: "bold"
//     }
// })

// export default ProjectScreen;


// app/projects.tsx
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Button, Image, ScrollView, TouchableOpacity } from "react-native";
import { listProjects } from "../lib/projectsRepo";

export default function Projects() {
const [items, setItems] = useState<any[]>([]);

const refresh = useCallback(() => setItems(listProjects()), []);
useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
    <Button title="New Project" onPress={() => router.push("/project/new")} />
    {items.map((p) => (
        <TouchableOpacity key={p.id} onPress={() => router.push({ pathname: "/project/[id]", params: { id: p.id } })}>
        <View style={{ padding: 12, backgroundColor: "#f2f2f2", borderRadius: 12, marginTop: 8 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{p.title}</Text>
            <Text>{p.organization}</Text>
            {p.cover ? (
            <Image source={{ uri: p.cover }} style={{ width: "100%", height: 180, marginTop: 8, borderRadius: 8 }} />
            ) : null}
            <Text numberOfLines={2} style={{ marginTop: 6 }}>{p.description}</Text>
        </View>
        </TouchableOpacity>
    ))}
    </ScrollView>
);
}
