import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getProject } from "../../../lib/projectsRepo";

type LegacyPrompt = { prompt: { question: string; answers: string[] } };

const NoDropdownAnswers = ({
prompt_index,
question,
answers,
onAnswer,
}: {
prompt_index: number;
question: string;
answers: string[];
onAnswer: (index: number, answer: string) => void;
}) => {
const [selectedAnswer, setSelectedAnswer] = useState<[number | null, string | null]>([null, null]);
const [selectedRow, setSelectedRow] = useState<[number | null, string | null]>([null, null]);

return (
    <View style={selectedRow[0] === prompt_index ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}>
    <Text style={styles.questionText}>{question}</Text>
    <View style={styles.choicesRow}>
        {answers.map((ans, i) => (
        <TouchableOpacity
            key={`${ans}-${i}`}
            style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox}
            onPress={() => {
            setSelectedAnswer([i, ans]);
            setSelectedRow([prompt_index, ans]);
            onAnswer(prompt_index, ans);
            }}
        >
            <Text style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
            {ans}
            </Text>
        </TouchableOpacity>
        ))}
    </View>
    </View>
);
};

const DrodownAnswers = ({
prompt_index,
question,
answers,
onAnswer,
}: {
prompt_index: number;
question: string;
answers: string[];
onAnswer: (index: number, answer: string) => void;
}) => {
const [selectedAnswer, setSelectedAnswer] = useState<[number | null, string | null]>([null, null]);
const [selectedRow, setSelectedRow] = useState<[number | null, string | null]>([null, null]);
const [openDropdown, setOpenDropdown] = useState(false);

return (
    <TouchableOpacity
    style={selectedRow[0] === prompt_index ? styles.dropdownPromptAnswered : styles.dropDownPrompt}
    onPress={() => setOpenDropdown(true)}
    >
    <Text>{question}</Text>
    {openDropdown ? (
        <>
        {answers.map((ans, i) => (
            <TouchableOpacity
            key={`${ans}-${i}`}
            style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox}
            onPress={() => {
                setSelectedAnswer([i, ans]);
                setSelectedRow([prompt_index, ans]);
                setOpenDropdown(false);
                onAnswer(prompt_index, ans);
            }}
            >
            <Text style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
                {ans}
            </Text>
            </TouchableOpacity>
        ))}
        </>
    ) : selectedAnswer[1] === null ? null : (
        <View style={styles.selectedAnswerChoiceBox}>
        <Text style={{ color: "white", textDecorationLine: "underline" }}>{selectedAnswer[1]}</Text>
        </View>
    )}
    </TouchableOpacity>
);
};

const QuestionList = ({
questionJSON,
onAnswer,
}: {
questionJSON: LegacyPrompt[];
onAnswer: (index: number, answer: string) => void;
}) => {
return (
    <FlatList
    style={styles.questionList}
    data={questionJSON}
    keyExtractor={(_, index) => String(index)}
    renderItem={({ index, item }) => (
        <View>
        {/* <NoDropdownAnswers
            prompt_index={index}
            question={item.prompt.question}
            answers={item.prompt.answers}
            onAnswer={onAnswer}
        /> */}
        <DrodownAnswers
            prompt_index={index}
            question={item.prompt.question}
            answers={item.prompt.answers}
            onAnswer={onAnswer}
        />
        </View>
    )}
    />
);
};

const SubmitButton = ({ enabled, onSubmit }: { enabled: boolean; onSubmit: () => void }) => {
return (
    <TouchableOpacity
    style={[
        { width: "70%", alignSelf: "center", alignItems: "center", padding: 4, marginTop: 4, borderRadius: 20 },
        enabled ? { backgroundColor: "orange" } : { backgroundColor: "gray" },
    ]}
    disabled={!enabled}
    onPress={onSubmit}
    >
    <Text style={{ color: "white", fontWeight: "600" }}>Submit</Text>
    </TouchableOpacity>
);
};

// ---------- SCREEN ----------
const ProjectScreen = () => {
const { id } = useLocalSearchParams<{ id?: string }>();
const [title, setTitle] = useState<string>("");
const [admin, setAdmin] = useState<string>("");
const [legacyPrompts, setLegacyPrompts] = useState<LegacyPrompt[] | null>(null);

// Parent owns answers: answers[i] is the selected answer or null
const [answers, setAnswers] = useState<(string | null)[]>([]);

const load = useCallback(() => {
    if (!id) {
    return;
    }
    const p = getProject(String(id));
    if (!p) {
    setLegacyPrompts([]);
    setAnswers([]);
    return;
    }

    const adapted: LegacyPrompt[] = p.prompts.map((pr: any) => ({
    prompt: {
        question: pr.question,
        answers: (pr.options || []).map((o: any) => o.text),
    },
    }));

    setTitle(p.title);
    setAdmin(p.admin);
    setLegacyPrompts(adapted);
    setAnswers(new Array(adapted.length).fill(null));
}, [id]);

useFocusEffect(
    useCallback(() => {
    load();
    }, [load])
);

const onAnswer = useCallback((index: number, answer: string) => {
    setAnswers(prev => {
    const next = [...prev];
    next[index] = answer;
    return next;
    });
}, []);

const allowSubmission =
    (legacyPrompts?.length ?? 0) > 0 &&
    answers.length === (legacyPrompts?.length ?? 0) &&
    answers.every(a => a !== null);

if (!legacyPrompts) {
    return (
    <View style={[styles.projectScreenLayout, { justifyContent: "center" }]}>
        <Text>Loading…</Text>
    </View>
    );
}

return (
    <View style={styles.projectScreenLayout}>
    <View style={styles.content}>
        <Text style={styles.title}>Title: {title}</Text>
        <Text style={styles.admin}>Admin: {admin}</Text>
        <QuestionList questionJSON={legacyPrompts} onAnswer={onAnswer} />
    </View>

    <SubmitButton
        enabled={allowSubmission}
        onSubmit={() => {
        if (!allowSubmission) return;
        console.log("SUBMISSION", { answers });
        // TODO: persist answers to your repo/service here
        }}
    />
    </View>
);
};

const styles = StyleSheet.create({
  projectScreenLayout: {
    backgroundColor: "lightblue",
    flex: 1,
    alignItems: "center",
  },
  content: {
    alignSelf: "stretch",
    paddingHorizontal: 16,
  },
  imageBackground: {
    backgroundColor: "lightpink",
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
  },
  NonDropdownPrompt: {
    backgroundColor: "gray",
    padding: 4,
    marginBottom: 10,
    marginHorizontal: 0,
  },
  NonDropdownPromptAnswered: {
    backgroundColor: "#f9c2ff",
    borderWidth: 3,
    borderColor: "black",
    padding: 2,
    marginBottom: 10,
    marginHorizontal: 0,
  },
  dropDownPrompt: {
    backgroundColor: "gray",
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 0,
  },
  dropdownPromptAnswered: {
    backgroundColor: "#f9c2ff",
    borderWidth: 3,
    borderColor: "black",
    padding: 2,
    marginBottom: 10,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    alignSelf: "center",
  },
  admin: {
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
  },
  questionText: {
    fontSize: 16,
  },
  choicesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  answerChoiceBox: {
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  selectedAnswerChoiceBox: {
    backgroundColor: "black",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  answerChoiceText: {
    color: "black",
  },
  selectedAnswerChoiceText: {
    color: "white",
    textDecorationLine: "underline",
  },
  dropdown: {
    backgroundColor: "purple",
    alignSelf: "stretch",
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
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
    alignSelf: "stretch",
    backgroundColor: "lightblue",
  },
});

export default ProjectScreen;
