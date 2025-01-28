import { type QuizActionRegister, getActionRegisterPayload } from "./actions/register.ts";

/**
 * Map of action name to their type
 */
interface QuizActionMap {
  register: QuizActionRegister;
}

/**
 * Union of all actions
 */
export type QuizAction = QuizActionMap[keyof QuizActionMap];

/**
 * Type of action payload getters
 */
type QuizActionPayloadGetters = {
  [K in keyof QuizActionMap]: (action: QuizActionMap[K]) => Record<PropertyKey, unknown>;
};

/**
 * Payload getters for each action
 */
const handlers = {
  register: getActionRegisterPayload,
} as const satisfies QuizActionPayloadGetters;

/**
 * Get the payload for the action
 *
 * @param action the action
 */
export function getActionPayload(action: QuizAction) {
  return handlers[action.type](action);
}
