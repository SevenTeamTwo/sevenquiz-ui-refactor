import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Register event schema
 */
export const registerEventSchema = z.object({
  type: z.literal("register"),
});

/**
 * Type of a register event
 */
export type RegisterEvent = z.infer<typeof registerEventSchema>;

/**
 * Handle a register event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleRegisterEvent(actor: ActorRefFrom<typeof lobbyMachine>, _event: RegisterEvent) {
  actor.send({ type: "registered" });
}
