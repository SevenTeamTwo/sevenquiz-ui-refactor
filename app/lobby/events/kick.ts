import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";

/**
 * Kick event schema
 */
export const kickEventSchema = z.object({
  type: z.literal("kick"),
});

/**
 * Type of a kick event
 */
export type KickEvent = z.infer<typeof kickEventSchema>;

/**
 * Handle a register event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleKickEvent(_actor: ActorRefFrom<typeof lobbyMachine>, _event: KickEvent) {}
