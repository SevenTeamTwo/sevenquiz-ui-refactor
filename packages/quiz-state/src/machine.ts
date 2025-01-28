import { setup } from "xstate";

import type { QuizContext, QuizLobby } from "./context.ts";
import type { QuizEvent } from "./events.ts";
import type { QuizEmitted } from "./emitted.ts";

export const quizMachine = setup({
  types: {
    input: {} as QuizLobby,
    context: {} as QuizContext,
    events: {} as QuizEvent,
    emitted: {} as QuizEmitted,
  },
}).createMachine({
  id: "@seven/quiz",
  context: ({ input }) => ({
    name: "",
    created: input.created,
    owner: input.owner,
    players: input.players,
    maxPlayers: input.maxPlayers,
    quizzes: input.quizzes,
    currentQuizz: input.currentQuizz,
    currentQuestion: null,
    currentReview: null,
    results: null,
  }),
  initial: "disconnected",
  states: {
    disconnected: {},
  },
});
