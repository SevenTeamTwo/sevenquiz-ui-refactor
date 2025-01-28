import type { QuizEventPlayerJoined, QuizEventPlayerLeft, QuizEventOwnerChanged } from "./events.ts";

/**
 * Union of all emitted events
 */
export type QuizEmitted = QuizEventPlayerJoined | QuizEventPlayerLeft | QuizEventOwnerChanged;
