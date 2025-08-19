import { Text, View, ScrollView, StyleSheet, Image, Button, ImageSourcePropType } from "react-native";
import { Link, router } from "expo-router";
import { useRoute } from "@react-navigation/native"
import { useState } from "react";

type Prompt = { question: string; answers: string[] };
type PromptWrapper = { prompt: Prompt };

// Define a type for props
type ProjectProperties = {
    title: string;
    organization: string;
    contact: string;
    description: string;
    images: ImageSourcePropType[];
    prompts: PromptWrapper[];
};

const data = [
    { 
        projects: [
            {
                title:"Testing",
                admin:"Calvin",
                organization:"Sigma Nu",
                protocolpdf:"www.boom",
                images: [require("../../assets/tubule_for_Calvin/1.png")],
                description:"This project is about blah blah and mor eblh and some other blah and blah and duuuude b;ah blah",
                prompts: [
                    {
                        prompt: {
                            question: "What is the technical adequacy of the image?",
                            answers: ["Adequate", "Artifact", "Unreadable"]
                        },
                    },
                    {
                        prompt: {
                            question: "What type of tubule is this?",
                            answers: ["Proximal", "Distal", "Other"]
                        },
                    },
                    {
                        prompt: {
                            question: "What type of tubule is this?",
                            answers: ["Proximal", "Distal", "Other"]
                        }
                    },
                ]
            },
            {
                title:"Project2",
                admin:"fanfan@emory.edu",
                organization:"Emory",
                protocolpdf:"www.boom",
                images: [require("../../assets/tubule_for_Calvin/2.png")],
                description:"This is the 2nd project I want to test and see if this renders or not",
                prompts: [
                    {
                        prompt: {
                            question: "What is the technical adequacy of the image?",
                            answers: ["Adequate", "Artifact", "Unreadable"]
                        },
                    },
                    {
                        prompt: {
                            question: "What type of tubule is this?",
                            answers: ["Proximal", "Distal", "Other"]
                        },
                    },
                    {
                        prompt: {
                            question: "What type of tubule is this?",
                            answers: ["Proximal", "Distal", "Other"]
                        }
                    },
                ]
            }
        ],
    }
];



const Project = ({title, organization, contact, description, prompts, images} : ProjectProperties) => {
    // console.log("images = ", images)
    // const [selectedProject, SetSelectedProject] = useState(["", "", "", "", "", [""]]);
    // const path = "../.." + String(images[0])
    return (
        <View
        style={styles.project}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.orangeText}>Contact = {contact}</Text>
            <View
                style={styles.imageBackground}>
                    <Image
                    // source={require(path)}
                    source ={images[0]}
                    // style={{width:"50%"}}
                    >
                        
                    </Image>
            </View>
            {/* <Link></Link> */}
            {/* <Text>Description of the project blah blaj blah Description of the project blah blaj blah Description of the project blah blaj blah</Text> */}
            <Text style={{marginVertical:5, marginHorizontal:10, alignContent:"center"}}>{description}</Text>
            <Button title="Continue"
                onPress={() => {
                    // SetSelectedProject([title, organization, contact, description, images])
                    console.log("PROMPTS BEING PASSED", JSON.stringify(prompts))
                    router.push({pathname: "/project", params: {title: title, organization: organization, contact: contact, description:description, prompts: JSON.stringify(prompts)}})
                }}>
            </Button>
        </View>
    );
}

const ProjectScreen = () => {
    return (

        <ScrollView
            style={styles.scrollView}
                contentContainerStyle={{
                    flexGrow: 1,          // ensures it takes full height for vertical centering
                    // justifyContent: "center", //vertical centering
                    alignItems: "center"  // horizontal centering
                }}
            >
            {data[0].projects.map((proj, i) => (
                <Project
                    key={`${proj.title}-${i}`}
                    title={proj.title}
                    organization={proj.organization}
                    contact={proj.admin}
                    description={proj.description}
                    images={proj.images}
                    prompts={proj.prompts}
                />
            )
            )}
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
        width:"80%",
        backgroundColor: "lightgray"
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

export default ProjectScreen;