import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Register start schema
 */
export const startEventSchema = z.object({
  type: z.literal("start"),
  data: z.object({
    token: z.string().jwt(),
  }),
});

/**
 * Type of a start event
 */
export type StartEvent = z.infer<typeof startEventSchema>;

/**
 * Handle a start event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleStartEvent(actor: ActorRefFrom<typeof lobbyMachine>, _event: StartEvent) {
  actor.send({ type: "eventStart" });
}
