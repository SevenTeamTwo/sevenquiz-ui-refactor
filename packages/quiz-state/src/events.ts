import type { QuizLobby } from "./context.ts";
import type { Question } from "./question.ts";
import type { Review } from "./review.ts";

/**
 * Event when the lobby is updated
 */
export interface QuizEventUpdateLobby extends QuizLobby {
  type: "updateLobby";
}

/**
 * Event when registered
 */
export interface QuizEventRegistered {
  type: "registered";
}

/**
 * Event when a player has joined
 */
export interface QuizEventPlayerJoined {
  type: "playerJoined";
  name: string;
}

/**
 * Event when a player has left
 */
export interface QuizEventPlayerLeft {
  type: "playerLeft";
  name: string;
}

/**
 * Event when the owner has changed
 */
export interface QuizEventOwnerChanged {
  type: "ownerChanged";
  name: string | null;
}

/**
 * Event when the quiz is configured
 */
export interface QuizEventConfigure {
  type: "configure";
  quiz: string;
}

/**
 * Event when the quiz is started
 */
export interface QuizEventStart {
  type: "start";
}

/**
 * Event when a question is asked
 */
export interface QuizEventQuestion {
  type: "question";
  question: Question;
}

/**
 * Event when a review is requested
 */
export interface QuizEventReview {
  type: "review";
  review: Review;
}

/**
 * Event when the results are shown
 */
export interface QuizEventResults {
  type: "results";
  results: Record<string, number>;
}

/**
 * Union of all events
 */
export type QuizEvent =
  | QuizEventUpdateLobby
  | QuizEventRegistered
  | QuizEventPlayerJoined
  | QuizEventPlayerLeft
  | QuizEventOwnerChanged
  | QuizEventConfigure
  | QuizEventStart
  | QuizEventQuestion
  | QuizEventReview
  | QuizEventResults;
