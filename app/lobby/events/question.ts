import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Question start schema
 */
export const questionEventSchema = z.object({
  type: z.literal("question"),
  data: z.object({
    question: z.discriminatedUnion("type", [
      z.object({ type: z.literal("text"), id: z.number(), title: z.string(), time: z.number() }),
    ]),
  }),
});

/**
 * Type of a question event
 */
export type QuestionEvent = z.infer<typeof questionEventSchema>;

/**
 * Handle a question event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleQuestionEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: QuestionEvent) {
  switch (event.data.question.type) {
    case "text":
      actor.send({
        type: "eventQuestion",
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
