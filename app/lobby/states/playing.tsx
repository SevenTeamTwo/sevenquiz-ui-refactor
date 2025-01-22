import { useState } from "react";

import { PlayingChoices } from "./playing-choices";
import { PlayingText } from "./playing-text";

type Question =
  | {
      kind: "choices";
      question: string;
      choices: string[];
      duration: number;
    }
  | {
      kind: "text";
      question: string;
      duration: number;
    };

const questions = [
  {
    kind: "text",
    question: "Quelle est la capitale de la Belgique ?",
    duration: 10,
  },
  {
    kind: "choices",
    question: "Quelle est la capitale de la France ?",
    choices: ["Paris", "Lyon", "Marseille", "Toulouse"],
    duration: 10,
  },
  {
    kind: "choices",
    question: "Quelle est la capitale de l'Espagne ?",
    choices: ["Madrid", "Barcelone", "Valence", "Séville"],
    duration: 10,
  },
  {
    kind: "choices",
    question: "Quelle est la capitale de l'Italie ?",
    choices: ["Rome", "Milan", "Naples", "Turin"],
    duration: 10,
  },
  {
    kind: "choices",
    question: "Quelle est la capitale de l'Allemagne ?",
    choices: ["Berlin", "Hambourg", "Munich", "Cologne"],
    duration: 10,
  },
  {
    kind: "choices",
    question: "Quelle est la capitale du Royaume-Uni ?",
    choices: ["Londres", "Manchester", "Birmingham", "Glasgow"],
    duration: 10,
  },
] as const satisfies Question[];

export function Playing() {
  const [current, setCurrent] = useState(0);
  const question = questions[current];

  console.log(current);

  if (question.kind === "choices") {
    return (
      <PlayingChoices
        key={question.question}
        question={question.question}
        choices={question.choices}
        duration={question.duration}
        onTimeout={() => setCurrent((current) => Math.min(current + 1, questions.length - 1))}
      />
    );
  }

  return (
    <PlayingText
      key={question.question}
      question={question.question}
      duration={question.duration}
      onTimeout={() => setCurrent((current) => Math.min(current + 1, questions.length - 1))}
    />
  );
}
