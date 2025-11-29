// import React, { useState, useCallback } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useFocusEffect } from "@react-navigation/native";
// // import { checkImageAnswers, getProject, storeImageAnswers } from "../../../lib/projectsRepo";
// import { checkImageAnswers, getProject, storeImageAnswers, getPromptOptions, getPromptAnswerChoices } from "../../../lib/mvp_projectsRepo";

// type LegacyPrompt = { prompt: { question: string; answers: string[] } };

// const NoDropdownAnswers = ({
//   prompt_index,
//   question,
//   answers,
//   onAnswer,
// }: {
//   prompt_index: number;
//   question: string;
//   answers: string[];
//   onAnswer: (index: number, answer: string) => void;
// }) => {
//   const [selectedAnswer, setSelectedAnswer] = useState<[number | null, string | null]>([null, null]);
//   const [selectedRow, setSelectedRow] = useState<[number | null, string | null]>([null, null]);

//   return (
//       <View style={selectedRow[0] === prompt_index ? styles.NonDropdownPromptAnswered : styles.NonDropdownPrompt}>
//       <Text style={styles.questionText}>{question}</Text>
//       <View style={styles.choicesRow}>
//           {answers.map((ans, i) => (
//           <TouchableOpacity
//               key={`${ans}-${i}`}
//               style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox}
//               onPress={() => {
//               setSelectedAnswer([i, ans]);
//               setSelectedRow([prompt_index, ans]);
//               onAnswer(prompt_index, ans);
//               }}
//           >
//               <Text style={selectedAnswer[0] === i ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
//               {ans}
//               </Text>
//           </TouchableOpacity>
//           ))}
//       </View>
//       </View>
//   );
// };

// const DrodownAnswers = ({prompt_index, question, answers, selected, onAnswer}: {
//   prompt_index: number;
//   question: string;
//   answers: string[];
//   selected: string | null
//   onAnswer: (index: number, answer: string) => void;
// }) => {
//   const [openDropdown, setOpenDropdown] = useState(false);

//   return (
//       <TouchableOpacity
//       style={selected ? styles.dropdownPromptAnswered : styles.dropDownPrompt}
//       onPress={() => setOpenDropdown(true)}
//       >
//       <Text>{question}</Text>
//       {openDropdown ? (
//           <>
//           {answers.map((ans, i) => (
//               <TouchableOpacity
//               key={`${ans}-${i}`}
//               style={selected === ans ? styles.selectedAnswerChoiceBox : styles.answerChoiceBox}
//               onPress={() => {
//                   setOpenDropdown(false);
//                   onAnswer(prompt_index, ans);
//               }}
//               >
//                 <Text style={selected === ans ? styles.selectedAnswerChoiceText : styles.answerChoiceText}>
//                   {ans}
//               </Text>
//               </TouchableOpacity>
//           ))}
//           </>
//         ) : !selected ? null : (
//           <View style={styles.selectedAnswerChoiceBox}>
//             <Text style={{ color: "white", textDecorationLine: "underline" }}>{selected}</Text>
//           </View>
//       )}
//       </TouchableOpacity>
//   );
// };

// const QuestionList = ({questionJSON, answers, onAnswer}: {
//   questionJSON: LegacyPrompt[];
//   answers: (string | null)[];
//   onAnswer: (index: number, answer: string) => void;
// }) => {
//   return (
//       <FlatList
//         style={styles.questionList}
//         data={questionJSON}
//         extraData={answers}
//         keyExtractor={(_, index) => String(index)}
//         renderItem={({ index, item }) => (
//             <View>
//             {/* <NoDropdownAnswers
//                 prompt_index={index}
//                 question={item.prompt.question}
//                 answers={item.prompt.answers}
//                 onAnswer={onAnswer}
//             /> */}
//             <DrodownAnswers
//                 prompt_index={index}
//                 question={item.prompt.question}
//                 answers={item.prompt.answers}
//                 selected={answers[index]}
//                 onAnswer={onAnswer}
//             />
//             </View>
//         )}
//       />
//   );
// };

// const SubmitButton = ({ enabled, onSubmit }: { enabled: boolean; onSubmit: () => void }) => {
//   return (
//       <TouchableOpacity
//       style={[
//           { width: "70%", alignSelf: "center", alignItems: "center", padding: 4, marginTop: 4, borderRadius: 20 },
//           enabled ? { backgroundColor: "orange" } : { backgroundColor: "gray" },
//       ]}
//       disabled={!enabled}
//       onPress={onSubmit}
//       >
//       <Text style={{ color: "white", fontWeight: "600" }}>Submit</Text>
//       </TouchableOpacity>
//   );
// };

// const ProjectScreen = () => {
//   const { id } = useLocalSearchParams<{ id?: string }>();
//   const projectId = Number(id)
//   const [title, setTitle] = useState<string>("");
//   const [admin, setAdmin] = useState<string>("");
//   const [legacyPrompts, setLegacyPrompts] = useState<LegacyPrompt[] | null>(null);
//   const [images, setImages] = useState<string[]>([""])
//   const [displayImageIndex, setDisplayImageIndex] = useState<number>(0)
//   const [prompts, setPrompts] = useState(null);
//   const [promptAnswerMap, setPromptAnswerMap] = useState(new Map());

//   // Parent owns answers: answers[i] is the selected answer or null
//   const [answers, setAnswers] = useState<(string | null)[]>([]);

//   const load = useCallback(() => {
//       if (!id) {
//         return;
//       }
//       const p = getProject(projectId);
//       if (!p) {
//         setLegacyPrompts([]);
//         setAnswers([]);
//         return;
//       }
//       const Questions = getPromptOptions(projectId)
//       Questions.map((prompt) => {
//         const Answer_options = getPromptAnswerChoices(prompt.id)
//       })
//       const adapted: LegacyPrompt[] = p.prompts.map((pr: any) => ({
//       prompt: {
//           question: pr.question,
//           answers: (pr.options || []).map((o: any) => o.text),
//       },
//       }));

//       setTitle(p.title);
//       setAdmin(p.admin_contact);
//       setLegacyPrompts(adapted);
//       setAnswers(new Array(adapted.length).fill(null));
//       setImages(p.images)
//       // console.log("Image stored in labeling screen: ", p.images)
//       // console.log("First image: ", p.images[0])
//   }, [id]);

//   useFocusEffect(
//       useCallback(() => {
//       load();
//       }, [load])
//   );

//   const incrementImageIndex = (legacyPrompts) => {
//     if (images[displayImageIndex + 1]) {
//       setDisplayImageIndex(displayImageIndex + 1)
//       setAnswers(new Array(legacyPrompts.length).fill(null));
//     } else {
//       console.log("end of images array, cant increment to next one")
//     }
//   }

//   const onAnswer = useCallback((index: number, answer: string) => {
//       setAnswers(prev => {
//       const next = [...prev];
//       next[index] = answer;
//       return next;
//       });
//   }, []);

//   const allowSubmission =
//       (legacyPrompts?.length ?? 0) > 0 &&
//       answers.length === (legacyPrompts?.length ?? 0) &&
//       answers.every(a => a !== null);

//   if (!legacyPrompts) {
//       return (
//       <View style={[styles.projectScreenLayout, { justifyContent: "center" }]}>
//           <Text>Loading…</Text>
//       </View>
//       );
//   }

//   return (
//       <View style={styles.projectScreenLayout}>
//           <Text style={styles.title}>Title: {title}</Text>
//           <Text style={styles.admin}>Admin: {admin}</Text>
//         <Image source={{uri: images[displayImageIndex]}} style={{ width: "100%", height: "30%", marginBottom: 10, marginTop: 10, borderRadius: 8 }}></Image>
//         <TouchableOpacity
//           onPress={() => {
//             incrementImageIndex(legacyPrompts)
//         }}>
//           <Text style={{color:"blue"}}>Next image</Text>
//         </TouchableOpacity>
//       <View style={styles.content}>
//           <QuestionList questionJSON={legacyPrompts} answers={answers} onAnswer={onAnswer} /> {/* this is what I need to change!!!!!!!!!! */}
//       </View>

//       <SubmitButton
//           enabled={allowSubmission}
//           onSubmit={() => {
//             if (!allowSubmission) {
//               console.log("Can't submit till all prompts are answered");
//               return
//             }
//             console.log("SUBMISSION", { answers });
//             // storeImageAnswers(answers);
//             // TODO: persist answers to your repo/service here
//             if (id && images[displayImageIndex] && answers) {
//               storeImageAnswers(id, images[displayImageIndex], String(answers))
//               const returnedImageAnswers = checkImageAnswers(id, images[displayImageIndex]);
//               console.log("Image label answers returned to database string", returnedImageAnswers)
//               incrementImageIndex(legacyPrompts)
//             }
//           }}
//       />
//       </View>
//   );
// };

// const styles = StyleSheet.create({
//   projectScreenLayout: {
//     backgroundColor: "lightblue",
//     flex: 1,
//     alignItems: "center",
//   },
//   content: {
//     alignSelf: "stretch",
//     paddingHorizontal: 16,
//   },
//   imageBackground: {
//     backgroundColor: "lightpink",
//     width: 150,
//     height: 150,
//     marginBottom: 10,
//     alignSelf: "center",
//   },
//   NonDropdownPrompt: {
//     backgroundColor: "gray",
//     padding: 4,
//     marginBottom: 10,
//     marginHorizontal: 0,
//   },
//   NonDropdownPromptAnswered: {
//     backgroundColor: "#f9c2ff",
//     borderWidth: 3,
//     borderColor: "black",
//     padding: 2,
//     marginBottom: 10,
//     marginHorizontal: 0,
//   },
//   dropDownPrompt: {
//     backgroundColor: "gray",
//     paddingVertical: 10,
//     marginBottom: 10,
//     marginHorizontal: 0,
//   },
//   dropdownPromptAnswered: {
//     backgroundColor: "#f9c2ff",
//     borderWidth: 3,
//     borderColor: "black",
//     padding: 2,
//     marginBottom: 10,
//     marginHorizontal: 0,
//   },
//   title: {
//     fontSize: 24,
//     textAlign: "center",
//     alignSelf: "center",
//   },
//   admin: {
//     fontSize: 18,
//     textAlign: "center",
//     alignSelf: "center",
//   },
//   questionText: {
//     fontSize: 16,
//   },
//   choicesRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   answerChoiceBox: {
//     backgroundColor: "white",
//     paddingHorizontal: 6,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginRight: 8,
//     marginTop: 4,
//     marginBottom: 10,
//     alignSelf: "flex-start",
//   },
//   selectedAnswerChoiceBox: {
//     backgroundColor: "black",
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderRadius: 8,
//     marginRight: 8,
//     marginTop: 4,
//     alignSelf: "flex-start",
//   },
//   answerChoiceText: {
//     color: "black",
//   },
//   selectedAnswerChoiceText: {
//     color: "white",
//     textDecorationLine: "underline",
//   },
//   dropdown: {
//     backgroundColor: "purple",
//     alignSelf: "stretch",
//     margin: 16,
//     height: 50,
//     borderBottomColor: "gray",
//     borderBottomWidth: 0.5,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   questionList: {
//     alignSelf: "stretch",
//     backgroundColor: "lightblue",
//   },
// });

// export default ProjectScreen;


import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import {
    getProject,
    getPromptsWithOptions,
    getImagesForProject,
    saveLabelResponses,
    getImages,
    getFirstUnlabeledImage,

} from "../../../lib/mvp_projectsRepo";


const DropdownPrompt = ({
  prompt,
  index,
  selected,
  onAnswer,
}: {
  prompt: any;
  index: number;
  selected: number | null;
  onAnswer: (promptIndex: number, optionId: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={selected ? styles.promptAnswered : styles.promptBox}
      onPress={() => setOpen(!open)}
    >
      <Text style={styles.question}>{prompt.question}</Text>

      {open && (
        <View>
          {prompt.options.map((opt: any) => (
            <TouchableOpacity
              key={opt.id}
              style={selected === opt.id ? styles.selectedChoice : styles.choice}
              onPress={() => {
                onAnswer(index, opt.id);
                setOpen(false);
              }}
            >
              <Text style={selected === opt.id ? styles.choiceSelectedText : styles.choiceText}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!open && selected && (
        <View style={styles.selectedChoice}>
          <Text style={styles.choiceSelectedText}>
            {prompt.options.find((o: any) => o.id === selected)?.text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};



const ProjectLabelingScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const projectId = Number(id);

  const [project, setProject] = useState<any>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  // answers[i] = selected prompt_option.id
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const load = useCallback(() => {
      const p = getProject(projectId);
      if (!p) return;

      const promptsData = getPromptsWithOptions(projectId);
      const imagesData = getImagesForProject(projectId);

      setProject(p);
      setPrompts(promptsData);
      setImages(imagesData);

      // Determine where to start
      const firstUnlabeledId = getFirstUnlabeledImage(projectId);

      if (firstUnlabeledId === null) {
          console.log("ALL IMAGES LABELED");
          setImageIndex(0);
      } else {
          const idx = imagesData.findIndex(img => img.id === firstUnlabeledId);
          setImageIndex(idx >= 0 ? idx : 0);
      }

      // Reset answers for the prompts of this image
      setAnswers(new Array(promptsData.length).fill(null));
  }, [projectId]);


  useFocusEffect(useCallback(() => load(), [load]));

  const onAnswer = (promptIndex: number, optionId: number) => {
    setAnswers((prev) => {
      const out = [...prev];
      out[promptIndex] = optionId;
      return out;
    });
  };

  const canSubmit = answers.every((a) => a !== null);

  const onSubmit = () => {
    if (!canSubmit) {
      console.log("Must answer all prompts.");
      return;
    }

    const currentImage = images[imageIndex];
    saveLabelResponses(projectId, currentImage.id, answers as number[]);

    // Next image
    if (images[imageIndex + 1]) {
      setImageIndex(imageIndex + 1);
      setAnswers(new Array(prompts.length).fill(null));
    } else {
      console.log("labeling.onAnswer()");
      console.log("All images labeled!");
    }
  };

  if (!project || images.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  const currentImage = images[imageIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project: {project.title}</Text>
      <Text style={styles.admin}>Admin: {project.admin_contact}</Text>

      <Image
        source={{ uri: currentImage.file_path }}
        style={styles.image}
      />

      <TouchableOpacity onPress={() => {
        if (images[imageIndex + 1]) {
          setImageIndex(imageIndex + 1);
          setAnswers(new Array(prompts.length).fill(null));
        }
      }}>
        <Text style={{ color: "blue" }}>Next Image</Text>
      </TouchableOpacity>

      <FlatList
        style={{ marginTop: 10 }}
        data={prompts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <DropdownPrompt
            prompt={item}
            index={index}
            selected={answers[index]}
            onAnswer={onAnswer}
          />
        )}
      />

      <TouchableOpacity
        disabled={!canSubmit}
        style={[styles.submitBtn, canSubmit ? styles.submitEnabled : styles.submitDisabled]}
        onPress={onSubmit}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProjectLabelingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "lightblue" },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  admin: { fontSize: 16, textAlign: "center" },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginVertical: 12,
    borderRadius: 12,
  },
  promptBox: {
    backgroundColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  promptAnswered: {
    backgroundColor: "#ffc7ff",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  question: { fontSize: 16, fontWeight: "600" },
  choice: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginTop: 6,
  },
  selectedChoice: {
    padding: 8,
    backgroundColor: "black",
    borderRadius: 6,
    marginTop: 8,
  },
  choiceText: { color: "black" },
  choiceSelectedText: { color: "white", textDecorationLine: "underline" },
  submitBtn: {
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
  },
  submitEnabled: { backgroundColor: "orange" },
  submitDisabled: { backgroundColor: "gray" },
  submitText: { color: "white", fontSize: 16, fontWeight: "600" },
});
