import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Configure event schema
 */
export const configureEventSchema = z.object({
  type: z.literal("configure"),
  data: z
    .object({
      quiz: z.string(),
    })
    .optional(),
});

/**
 * Type of a configure event
 */
export type ConfigureEvent = z.infer<typeof configureEventSchema>;

/**
 * Handle a quiz event
 *
 * @param configure the actor
 * @param event the event
 */
export function handleConfigureEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: ConfigureEvent) {
  if (event.data !== undefined) {
    actor.send({
      type: "eventConfigure",
      quiz: event.data.quiz,
    });
  }
}
