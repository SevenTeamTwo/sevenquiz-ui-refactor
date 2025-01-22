import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import { playerUpdateEventSchema, handlePlayerUpdateEvent } from "./events/playerUpdate";
import { lobbyEventSchema, handleLobbyEvent } from "./events/lobby";
import { registerEventSchema, handleRegisterEvent } from "./events/register";
import { errorEventSchema, handleErrorEvent } from "./events/error";
import type { lobbyMachine } from "~/lobby/machine";

const types = ["lobby", "playerUpdate", "register", "error"] as const;

const eventSchema = z.object({
  type: z.enum(types),
});

type EventHandlers = {
  [K in (typeof types)[number]]: (actorRef: ActorRefFrom<typeof lobbyMachine>, event: unknown) => void;
};

const eventHandlers = {
  playerUpdate: (actorRef, event) => handlePlayerUpdateEvent(actorRef, playerUpdateEventSchema.parse(event)),
  lobby: (actorRef, event) => handleLobbyEvent(actorRef, lobbyEventSchema.parse(event)),
  register: (actorRef, event) => handleRegisterEvent(actorRef, registerEventSchema.parse(event)),
  error: (actorRef, event) => handleErrorEvent(actorRef, errorEventSchema.parse(event)),
} as const satisfies EventHandlers;

/**
 * Handle an event
 *
 * @param actorRef the actor reference
 * @param event the event
 */
export function handleEvent(actorRef: ActorRefFrom<typeof lobbyMachine>, event: unknown) {
  console.log("Handling event", event);

  try {
    const { type } = eventSchema.parse(event);
    try {
      eventHandlers[type](actorRef, event);
    } catch (error) {
      console.error(`Failed to handle event of type ${type}`, error);
    }
  } catch (error) {
    console.error("Invalid event", error);
    return;
  }
}
