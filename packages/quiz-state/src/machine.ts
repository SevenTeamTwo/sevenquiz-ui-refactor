import { setup } from "xstate";

export const quizMachine = setup({
  types: {},
}).createMachine({
  id: "@seven/quiz",
  initial: "disconnected",
  states: {
    disconnected: {},
  },
});
