import type { ActorRefFrom } from "xstate";
import { z } from "zod";

import type { lobbyMachine } from "~/lobby/machine";
import { playerUpdateEventSchema, handlePlayerUpdateEvent } from "./events/playerUpdate";
import { lobbyEventSchema, handleLobbyEvent } from "./events/lobby";
import { registerEventSchema, handleRegisterEvent } from "./events/register";
import { errorEventSchema, handleErrorEvent } from "./events/error";
import { handleKickEvent, kickEventSchema } from "./events/kick";
import { configureEventSchema, handleConfigureEvent } from "./events/configure";
import { handleStartEvent, startEventSchema } from "./events/start";
import { handleNextQuestionEvent, nextQuestionEventSchema } from "./events/nextQuestion";

/**
 * List of event types
 */
const eventTypes = [
  "lobby",
  "playerUpdate",
  "register",
  "kick",
  "configure",
  "start",
  "nextQuestion",
  "error",
] as const;

/**
 * Base event schema
 */
const eventSchema = z.object({
  type: z.enum(eventTypes),
});

/**
 * Type of event handlers
 */
type EventHandlers = {
  [K in (typeof eventTypes)[number]]: (actor: ActorRefFrom<typeof lobbyMachine>, event: unknown) => void;
};

/**
 * Event handlers
 */
const eventHandlers = {
  playerUpdate: (actor, event) => handlePlayerUpdateEvent(actor, playerUpdateEventSchema.parse(event)),
  lobby: (actor, event) => handleLobbyEvent(actor, lobbyEventSchema.parse(event)),
  register: (actor, event) => handleRegisterEvent(actor, registerEventSchema.parse(event)),
  kick: (actor, event) => handleKickEvent(actor, kickEventSchema.parse(event)),
  error: (actor, event) => handleErrorEvent(actor, errorEventSchema.parse(event)),
  configure: (actor, event) => handleConfigureEvent(actor, configureEventSchema.parse(event)),
  start: (actor, event) => handleStartEvent(actor, startEventSchema.parse(event)),
  nextQuestion: (actor, event) => handleNextQuestionEvent(actor, nextQuestionEventSchema.parse(event)),
} as const satisfies EventHandlers;

/**
 * Handle an event
 *
 * @param actor the actor
 * @param event the event
 */
export function handleEvent(actor: ActorRefFrom<typeof lobbyMachine>, event: unknown) {
  try {
    const { type } = eventSchema.parse(event);
    try {
      eventHandlers[type](actor, event);
    } catch (error) {
      console.error(`Failed to handle event of type ${type}`, error);
    }
  } catch (error) {
    console.error("Invalid event", error);
    return;
  }
}
