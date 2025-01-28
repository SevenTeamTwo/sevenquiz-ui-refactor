import type { Question } from "./question.ts";

/**
 * Represent a review of a question in the quiz
 */
export type Review = {
  question: Question & {
    answer: string;
  };
  player: string;
  answer: string;
};
