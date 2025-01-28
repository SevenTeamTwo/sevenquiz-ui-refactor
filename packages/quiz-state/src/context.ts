import type { Question } from "./question.ts";
import type { Review } from "./review.ts";

/**
 * Represent the context of the quiz
 */
export interface QuizContext {
  name: string;
  created: Date;
  owner: string | null;
  players: string[];
  maxPlayers: number;
  quizzes: string[];
  currentQuiz: string;
  currentQuestion: Question | null;
  currentReview: Review | null;
  results: Record<string, number> | null;
}

/**
 * Represent the lobby of the quiz
 */
export type QuizLobby = Pick<QuizContext, "created" | "owner" | "players" | "maxPlayers" | "quizzes" | "currentQuiz">;
