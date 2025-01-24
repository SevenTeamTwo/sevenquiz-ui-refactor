import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Review schema
 */
export const reviewEventSchema = z.object({
  type: z.literal("review"),
  data: z.object({
    question: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("text"),
        id: z.number(),
        title: z.string(),
        time: z.number(),
        answer: z.object({
          text: z.string(),
        }),
      }),
    ]),
    player: z.string(),
    answer: z.object({
      text: z.string(),
    }),
  }),
});

/**
 * Type of a review event
 */
export type ReviewEvent = z.infer<typeof reviewEventSchema>;

/**
 * Handle a review event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleReviewEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: ReviewEvent) {
  switch (event.data.question.type) {
    case "text":
      actor.send({
        type: "eventReview",
        review: {
          question: {
            id: event.data.question.id,
            type: "text",
            title: event.data.question.title,
            duration: event.data.question.time / 1000000000,
            answer: event.data.question.answer.text,
          },
          player: event.data.player,
          answer: event.data.answer.text,
        },
      });
      break;
    default:
      console.error("Unknown question type");
  }
}
