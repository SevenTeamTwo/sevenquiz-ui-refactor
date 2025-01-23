import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Next question start schema
 */
export const nextQuestionEventSchema = z.object({
  type: z.literal("nextQuestion"),
  data: z.object({
    question: z.discriminatedUnion("type", [
      z.object({ type: z.literal("text"), id: z.number(), title: z.string(), time: z.number() }),
    ]),
  }),
});

/**
 * Type of a next question event
 */
export type NextQuestionEvent = z.infer<typeof nextQuestionEventSchema>;

/**
 * Handle a next question event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleNextQuestionEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: NextQuestionEvent) {
  switch (event.data.question.type) {
    case "text":
      actor.send({
        type: "eventNextQuestion",
        question: {
          id: event.data.question.id,
          type: "text",
          title: event.data.question.title,
          duration: event.data.question.time / 1000000000,
        },
      });
      break;
    default:
      console.error("Unknown question type");
  }
}
