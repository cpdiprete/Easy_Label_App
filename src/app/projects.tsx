import { Text, View, ScrollView, StyleSheet, Button } from "react-native";
import { Link, router } from "expo-router";

// Define a type for props
type ProjectProperties = {
    title: string;
    organization: string;
    contact: string;
    description: string;
};

const Project = ({title, organization, contact, description} : ProjectProperties) => {
    return (
        <View
        style={styles.project}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.orangeText}>Contact = {contact}</Text>
            <View
                style={styles.imageBackground}>
            </View>
            {/* <Link></Link> */}
            {/* <Text>Description of the project blah blaj blah Description of the project blah blaj blah Description of the project blah blaj blah</Text> */}
            <Text>{description}</Text>
            <Button title="Continue"
                onPress={() => {
                    router.push("/project")
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
            <Project
                title="Project 1"
                organization="Digital Pathology"
                contact="fanfan@emory.edu"
                description="Description of the project blah blaj blah Description of the project blah blaj blah Description of the project blah blaj blah"
            />
            <Project
                title="Project 2"
                organization="Georgia Tech"
                contact="cdiprete6@gatech.edu"
                description="Calvin likes NBA basketball, so he wants to make an nba statistical related project on kristaps porizingus stats compared to dirk nowitzki"
            />
            <Project
                title="Project 3"
                organization="Augusta university"
                contact="706-814-1305"
                description="lorem epsum snsjc sdcjnsdc svdjnsdvjd vdjnvdjfv"
            />
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
        width: 150,
        height: 150
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