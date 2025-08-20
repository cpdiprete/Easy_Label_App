// lib/projectsData.ts
import { ImageSourcePropType } from "react-native";

export type Prompt = { question: string; answers: string[] };
export type PromptWrapper = { prompt: Prompt };

export type Project = {
    id: string;
    title: string;
    admin: string;
    organization: string;
    protocolpdf: string;
    images: ImageSourcePropType[];   // works with require(...) or URIs
    description: string;
    prompts: PromptWrapper[];        // matches your current shape
};

// Adjust the require() paths based on THIS file's location.
// If this file is in lib/ and assets/ is at project root, "../assets/..." is correct.
export const projectsData: Project[] = [
{
    id: "0",
    title: "Testing",
    admin: "Calvin",
    organization: "Sigma Nu",
    protocolpdf: "www.boom",
    images: [require("../assets/tubule_for_Calvin/1.png")],
    description:
    "This project is about blah blah and mor eblh and some other blah and blah and duuuude b;ah blah",
    prompts: [
    {
        prompt: {
        question: "What is the technical adequacy of the image?",
        answers: ["Adequate", "Artifact", "Unreadable"],
        },
    },
    {
        prompt: {
        question: "What type of tubule is this?",
        answers: ["Proximal", "Distal", "Other"],
        },
    },
    {
        prompt: {
        question: "What type of tubule is this?",
        answers: ["Proximal", "Distal", "Other"],
        },
    },
    ],
},
{
    id: "1",
    title: "Project2",
    admin: "fanfan@emory.edu",
    organization: "Emory",
    protocolpdf: "www.boom",
    images: [require("../assets/tubule_for_Calvin/2.png")],
    description:
    "This is the 2nd project I want to test and see if this renders or not",
    prompts: [
    {
        prompt: {
        question: "What is the technical adequacy of the image?",
        answers: ["Adequate", "Artifact", "Unreadable"],
        },
    },
    {
        prompt: {
        question: "What type of tubule is this?",
        answers: ["Proximal", "Distal", "Other"],
        },
    },
    {
        prompt: {
        question: "What type of tubule is this?",
        answers: ["Proximal", "Distal", "Other"],
        },
    },
    ],
},
];

// Handy helpers
export const getProjectById = (id: string) => projectsData.find(p => p.id === id);

// If you want the original nested shape for a quick drop-in:
export const data = [{ projects: projectsData }];
