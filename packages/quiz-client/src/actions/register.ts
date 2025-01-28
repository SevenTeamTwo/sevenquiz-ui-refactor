/**
 * Action to register
 */
export interface QuizActionRegister {
  type: "register";
  name: string;
}

/**
 * Get the payload for the register action
 *
 * @param action the action
 * @returns the response to send
 */
export function getActionRegisterPayload(action: QuizActionRegister) {
  return {
    type: "register",
    data: {
      username: action.name,
    },
  };
}
