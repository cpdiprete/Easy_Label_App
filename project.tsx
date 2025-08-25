import { Text, View, ScrollView, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { FlatList } from "react-native";
import { useState } from "react";
import React from "react"
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useLocalSearchParams } from "expo-router";
type Prompt = { question: string; answers: string[] };

const data = [
    {
        title:"Testing",
        admin:"Calvin",
        organization:"Sigma Nu",
        protocolpdf:"www.boom",
        images: ["imageurl1", "imageurl2"],
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
                        selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox
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

// const DrodownAnswers = ({prompt_index, question, answers}) => {
//     const [selectedAnswer, setSelectedAnswer] = useState([null, null]);
//     const [selectedRow, setSelectedRow] = useState([null, null]);
//     const [openDropdown, setOpenDropdown] = useState(false)
//     return (
//         <View style = {(selectedRow[0] === prompt_index) ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}>
//             {/* <Text style={styles.questionText}>{question}</Text> */}
//             <Text>{question}</Text>
//             <TouchableOpacity 
//                 style={styles.answerChoiceBox}
//                 onPress={() => {
//                     setOpenDropdown(true)
//                 }}
//             >
//                 {openDropdown ? (
//                     <>
//                         {/* <Text>{selectedAnswer[1]}</Text> */}
//                         <Text>{selectedAnswer?.[1] ?? ""}</Text>
//                         {answers.map((ans, i) => (
//                             <TouchableOpacity
//                                 key={`${ans}-${i}`}
//                                 style= {
//                                     selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox
//                                 }
//                                 onPress={() => {
//                                     setSelectedAnswer([i, ans])
//                                     setSelectedRow([prompt_index, ans])
//                                     setOpenDropdown(false)
//                                 }}
//                             >
//                                 <Text style = {selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
//                                     {ans}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </>
//                     ) : (
//                         selectedAnswer[1] === null ? null : 
//                         <View style={styles.selectedAnswerChoiceBox}> 
//                             <Text style={{color:"white", textDecorationLine: 'underline'}}>{selectedAnswer[1]}</Text>
//                         </View>
//                     )
//                 }
//             </TouchableOpacity>
//         </View>
//     )
// }


const DrodownAnswers = ({prompt_index, question, answers}) => {
    const [selectedAnswer, setSelectedAnswer] = useState([null, null]);
    const [selectedRow, setSelectedRow] = useState([null, null]);
    const [openDropdown, setOpenDropdown] = useState(false)
    return (
        // <View style = {(selectedRow[0] === prompt_index) ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}>

            <TouchableOpacity 
                // style={styles.answerChoiceBox}
                style = {(selectedRow[0] === prompt_index) ? styles.dropdownPromptAnswered : styles.dropDownPrompt}
                onPress={() => {
                    setOpenDropdown(true)
                }}
            >
            <Text>{question}</Text>
                {openDropdown ? (
                    <>
                        {/* <Text>{selectedAnswer[1]}</Text> */}
                        {/* <Text>{selectedAnswer?.[1] ?? ""}</Text> */}
                        {answers.map((ans, i) => (
                            <TouchableOpacity
                                key={`${ans}-${i}`}
                                style= {
                                    selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox
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
                        selectedAnswer[1] === null ? null : 
                        <View style={styles.selectedAnswerChoiceBox}> 
                            <Text style={{color:"white", textDecorationLine: 'underline'}}>{selectedAnswer[1]}</Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        // </View>
    )
}

const QuestionList = ({questionJSON}) => {
    const [selectedByQuestion, setSelectedByQuestion] = useState({});
    return (
        <FlatList 
            style={styles.questionList}
            data={questionJSON}
            keyExtractor={(_, index) => String(index)}
            renderItem={({index, item }) => (
                <>
                <NoDropdownAnswers
                    prompt_index={index}
                    question = {item.prompt.question}
                    answers={item.prompt.answers}/>
                <DrodownAnswers
                    prompt_index={index}
                    question = {item.prompt.question}
                    answers={item.prompt.answers}
                />
                {/* <ImportedDropdown
                //     prompt_index={index}
                //     question = {item.Prompt.Question}
                //     answers={item.Prompt.Answers}
                // /> */}
                </>
            )}
        >
        </FlatList>
    )
}

const SubmitButton = () => {
    const [allowSubmission, setAllowSubmission] = useState(false);
    return (
        <TouchableOpacity
        style={[(allowSubmission ? {backgroundColor:"orange"} : {backgroundColor:"gray"}), {width:"70%", alignSelf:"center", alignItems:"center", padding:4, marginTop:4, borderRadius:20}]}
            onPress={() => {
                setAllowSubmission(!allowSubmission)
            }}
        >
            <Text>Submit</Text>
        </TouchableOpacity>
    )
}

const ProjectScreen = () => {
    let ProjectParams = useLocalSearchParams();
    let parsedPrompts: Prompt[] = JSON.parse(String(ProjectParams.prompts))
    console.log(parsedPrompts)
    return (
        <View style={styles.projectScreenLayout}>
            
            <Button 
            title="show message"
                onPress={() => console.log(ProjectParams)}
            ></Button>
            <View style={styles.content}>
                <Text style={styles.title}> Title: {data[0].title} </Text>
                <Text style={styles.admin}> Admin: {data[0].admin} </Text>
                <View
                    style={styles.imageBackground}>
                </View>
                <QuestionList questionJSON={data[0].prompts}/>
            </View>
            <SubmitButton/>
            {/* <Button title="Submit"></Button> */}
        </View>
        
        )
}

const styles = StyleSheet.create({
    projectScreenLayout: {
        // width:"100%",
        backgroundColor: 'lightblue',
        flex: 1,
        // justifyContent: "center",
        alignItems: "center"
    },
    content: {
        alignSelf: 'stretch',    // override parent centering and STRETCH
        // or width: '100%'
        paddingHorizontal: 16,
    },
    imageBackground: {
        backgroundColor: 'lightpink',
        width: 150,
        height: 150,
        marginBottom:10,
        alignSelf:"center"
    },
    NonDropdownPrompt: {
        backgroundColor: 'gray',
        padding: 4,
        marginBottom: 10,
        marginHorizontal: 0,
    }, 
    NonDropdownPromptAnswered: {
        backgroundColor: '#f9c2ff',
        borderWidth: 3,
        borderColor:'black',
        padding: 2,
        marginBottom: 10,
        marginHorizontal: 0,
    },
    dropDownPrompt: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        marginBottom: 10,
        marginHorizontal: 0,
    },
    dropdownPromptAnswered: {
        backgroundColor: '#f9c2ff',
        borderWidth: 3,
        borderColor:'black',
        padding: 2,
        marginBottom:10,
        marginHorizontal: 0,
    },
    title: {
        fontSize: 24,
        textAlign:"center",
        alignSelf:"center"
    },
    admin: {
        fontSize: 18,
        textAlign:"center",
        alignSelf:"center"
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
        // margin:10

        // flexWrap: 'wrap',        // <-- uncomment if you want wrapping to the next line
        // gap: 8,                  // RN ≥0.71; otherwise use marginRight on child
    },
    answerChoiceBox: {
        backgroundColor: 'white',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,            // spacing if you don't use `gap`
        marginTop: 4,              // nice when wrapping
        marginBottom: 10, 
        alignSelf: 'flex-start',   // prevents stretching
    },
    selectedAnswerChoiceBox: {
        backgroundColor: 'black',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,            // spacing if you don't use `gap`
        marginTop: 4,              // nice when wrapping
        alignSelf: 'flex-start',   // prevents stretching
    },
    answerChoiceText: {
        color: "black",
    },
    selectedAnswerChoiceText: {
        color:"white",
        textDecorationLine: 'underline'
    }, 
    dropdown: {
        backgroundColor: "purple",
        // width:"100%",
        alignSelf: 'stretch',
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    questionList: {
        // margin:30,
        alignSelf: 'stretch',
        backgroundColor:"lightblue"
    }

})
export default ProjectScreen
