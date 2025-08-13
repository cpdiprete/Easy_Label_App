import { Text, View, ScrollView, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { FlatList } from "react-native";
import { useState } from "react";
import React from "react"
// What is the technical adequacy of the image?
const data = [
    {
        Prompt: {
            Question: "What is the technical adequacy of the image?",
            Answers: ["Adequate", "Artifact", "Unreadable"]
        }
    },
    {
        Prompt: {
            Question: "What type of tubule is this?",
            Answers: ["Proximal", "Distal", "Other"]
        }
    },
    {
        Prompt: {
            Question: "What type of tubule is this?",
            Answers: ["Proximal", "Distal", "Other"]
        }
    }
];

const NoDropdownAnswers = ({prompt_index, question, answers}) => {
    const [selectedAnswer, setSelectedAnswer] = useState([null, null]);
    const [selectedRow, setSelectedRow] = useState([null, null]);
    // I have a string question and a list of answers, i should be able to render a ques
    return (
        <View style= {
            (selectedRow[0] === prompt_index) ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}
            >
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.choicesRow}>
            {answers.map((ans, i) => (
                <TouchableOpacity
                    key={`${ans}-${i}`}
                    style= {
                        selectedAnswer[0] === i ? styles.selectedAnswerChoice : styles.answerChoice
                    }
                    onPress={() => {
                        setSelectedAnswer([i, ans])
                        setSelectedRow([prompt_index, ans])
                    }}
                >
                    <Text style = {selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
                        {ans}
                    </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
    )
}

const DrodownAnswers = ({prompt_index, question, answers}) => {
    const [selectedAnswer, setSelectedAnswer] = useState([null, null]);
    const [selectedRow, setSelectedRow] = useState([null, null]);
    const [openDropdown, setOpenDropdown] = useState(false)
    return (
        <View style = {(selectedRow[0] === prompt_index) ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}>
            {/* <Text style={styles.questionText}>{question}</Text> */}
            <TouchableOpacity 
                style={styles.answerChoice}
                onPress={() => {
                    setOpenDropdown(true)
                }}
            >
                {openDropdown ? (
                    <>
                        {/* <Text>{selectedAnswer[1]}</Text> */}
                        <Text>{selectedAnswer?.[1] ?? ""}</Text>
                        {answers.map((ans, i) => (
                            <TouchableOpacity
                                key={`${ans}-${i}`}
                                style= {
                                    selectedAnswer[0] === i ? styles.selectedAnswerChoice : styles.answerChoice
                                }
                                onPress={() => {
                                    setSelectedAnswer([i, ans])
                                    setSelectedRow([prompt_index, ans])
                                    setOpenDropdown(false)
                                }}
                            >
                                <Text style = {selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
                                    {ans}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </>
                    ) : (
                        selectedAnswer[1] === null ? <Text>{question}</Text> : <Text>{selectedAnswer[1]}</Text>
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

const QuestionList = ({questionJSON}) => {
    const [selectedByQuestion, setSelectedByQuestion] = useState({});
    return (
        <FlatList 
            data={questionJSON}
            keyExtractor={(_, index) => String(index)}
            renderItem={({index, item }) => (
                // <NoDropdownAnswers
                //     prompt_index={index}
                //     question = {item.Prompt.Question}
                //     answers={item.Prompt.Answers}/>
                <DrodownAnswers
                    prompt_index={index}
                    question = {item.Prompt.Question}
                    answers={item.Prompt.Answers}
                />
            )}
        >
        </FlatList>
    )
}

const ProjectScreen = () => {
    return (
        <View style={styles.projectScreenLayout}>
            <View>
                <Text> Title of the project </Text>
                <Text> Organization admin </Text>
                <View
                    style={styles.imageBackground}>
                </View>
                <QuestionList questionJSON={data}/>
            </View>
            <Button title="Submit"></Button>
        </View>
        
        )
}

const styles = StyleSheet.create({
    projectScreenLayout: {
        backgroundColor: 'lightblue',
        // justifyContent: "center",
        alignItems: "center"
    },
    imageBackground: {
        backgroundColor: 'lightpink',
        width: 150,
        height: 150
    },
    NonDropdownPrompt: {
        backgroundColor: 'gray',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    }, 
    NonDropdownPromptAnswered: {
        backgroundColor: '#f9c2ff',
        borderWidth: 3,
        borderColor:'black',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    questionText: {
        fontSize: 16,
    },
    // answerChoice: {
    //     // fontSize:14
    //     backgroundColor: "white"
    // },
    choicesRow: {
        flexDirection: 'row',      // put children on the same line
        alignItems: 'center',

        // flexWrap: 'wrap',        // <-- uncomment if you want wrapping to the next line
        // gap: 8,                  // RN ≥0.71; otherwise use marginRight on child
    },
    answerChoice: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,            // spacing if you don't use `gap`
        marginTop: 8,              // nice when wrapping
        alignSelf: 'flex-start',   // prevents stretching
    },
    selectedAnswerChoice: {
        backgroundColor: 'black',
        
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,            // spacing if you don't use `gap`
        marginTop: 8,              // nice when wrapping
        alignSelf: 'flex-start',   // prevents stretching
    },
    answerChoiceText: {
        color: "black"
    },
    selectedAnswerChoiceText: {
        color:"white"
    },

})
export default ProjectScreen
