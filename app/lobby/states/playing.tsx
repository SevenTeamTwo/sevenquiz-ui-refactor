import { useState } from "react";

import { PlayingChoices } from "./playing-choices";

interface Question {
  question: string;
  choices: string[];
  duration: number;
}

const questions = [
  {
    question: "Quelle est la capitale de la France ?",
    choices: ["Paris", "Lyon", "Marseille", "Toulouse"],
    duration: 10,
  },
  {
    question: "Quelle est la capitale de l'Espagne ?",
    choices: ["Madrid", "Barcelone", "Valence", "Séville"],
    duration: 10,
  },
  {
    question: "Quelle est la capitale de l'Italie ?",
    choices: ["Rome", "Milan", "Naples", "Turin"],
    duration: 10,
  },
  {
    question: "Quelle est la capitale de l'Allemagne ?",
    choices: ["Berlin", "Hambourg", "Munich", "Cologne"],
    duration: 10,
  },
  {
    question: "Quelle est la capitale du Royaume-Uni ?",
    choices: ["Londres", "Manchester", "Birmingham", "Glasgow"],
    duration: 10,
  },
] as const satisfies Question[];

export function Playing() {
  const [current, setCurrent] = useState(0);

  return (
    <PlayingChoices
      key={questions[current].question}
      question={questions[current].question}
      choices={questions[current].choices}
      duration={questions[current].duration}
      onTimeout={() => setCurrent((current) => Math.min(current + 1, questions.length - 1))}
    />
  );
}
