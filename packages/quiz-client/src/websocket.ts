import { atom } from "jotai";

import type { QuizLobby } from "@seven/quiz-state/context";

import { lobbyEventSchema } from "./events/lobby.ts";
import { getActionPayload, type QuizAction } from "./actions.ts";

/**
 * The status of the websocket connection
 */
export type QuizSocketStatus = "unconnected" | "connecting" | "connected" | "disconnected";

/**
 * The context for the websocket connection
 */
interface QuizSocketContext {
  socket: WebSocket;
  abortController: AbortController;
  status: Exclude<QuizSocketStatus, "unconnected">;
  callbacks: ((message: unknown) => void)[];
  lobbyId: string;
  initialLobby: QuizLobby | null;
  lastError: unknown | null;
}

/**
 * Atom storing the websocket context
 */
const quizSocketContextAtom = atom<QuizSocketContext | null>(null);

/**
 * Utility atom to update the websocket context if it exists
 */
const updateQuizSocketContextAtom = atom(
  null,
  (_, set, update: (ctx: QuizSocketContext) => Partial<QuizSocketContext>) => {
    set(quizSocketContextAtom, (prev) => (prev === null ? null : { ...prev, ...update(prev) }));
  },
);

/**
 * Atom to get the current status of the websocket
 */
export const statusFromQuizSocketAtom = atom<QuizSocketStatus>((get) => {
  const current = get(quizSocketContextAtom);
  return current === null ? "unconnected" : current.status;
});

/**
 * Atom to get the current lobby id
 */
export const lobbyIdFromQuizSocketAtom = atom((get) => {
  const current = get(quizSocketContextAtom);
  return current === null ? null : current.lobbyId;
});

/**
 * Atom to get the initial lobby data
 */
export const initialLobbyQuizFromSocketAtom = atom((get) => {
  const current = get(quizSocketContextAtom);
  return current === null ? null : current.initialLobby;
});

/**
 * Atom to get the last error that occurred
 */
export const lastErrorFromQuizSocketAtom = atom((get) => {
  const current = get(quizSocketContextAtom);
  return current === null ? null : current.lastError;
});

/**
 * Atom to add a callback to the websocket
 */
export const addQuizSocketCallbackAtom = atom(null, (_, set, callback: (message: unknown) => void) => {
  set(updateQuizSocketContextAtom, (prev) => ({
    callbacks: [...prev.callbacks, callback],
  }));
});

/**
 * Atom to remove a callback from the websocket
 */
export const removeQuizSocketCallbackAtom = atom(null, (_, set, callback: (message: unknown) => void) => {
  set(updateQuizSocketContextAtom, (prev) => ({
    callbacks: prev.callbacks.filter((cb) => cb !== callback),
  }));
});

/**
 * Atom to send data to the websocket
 */
export const sendToQuizSocketAtom = atom(null, (get, _, data: Record<PropertyKey, unknown>) => {
  const current = get(quizSocketContextAtom);

  if (current !== null && current.status === "connected") {
    current.socket.send(JSON.stringify(data));
  }
});

/**
 * Atom to receive data from the websocket and call the callbacks
 */
export const receiveFromQuizSocketAtom = atom(null, (get, _, data: unknown) => {
  const current = get(quizSocketContextAtom);

  if (current !== null && current.status === "connected") {
    for (const cb of current.callbacks) {
      cb(data);
    }
  }
});

/**
 * Atom to disconnect the websocket
 */
export const disconnectQuizSocketAtom = atom(null, (get, set) => {
  const current = get(quizSocketContextAtom);

  if (current !== null) {
    current.abortController.abort();

    if (current.status === "connected") {
      current.socket.close();
    }
  }

  set(quizSocketContextAtom, null);
});

/**
 * Atom to connect to the websocket to the given lobby
 */
export const connectQuizSocketAtom = atom(null, (get, set, update: { url: string; lobbyId: string }) => {
  const current = get(quizSocketContextAtom);

  if (current !== null) {
    if (current.lobbyId === update.lobbyId && current.status !== "disconnected") {
      return;
    }

    set(disconnectQuizSocketAtom);
  }

  const socket = new WebSocket(`${update.url}/${update.lobbyId}`);
  const abortController = new AbortController();
  let receivedInitialLobby = false;

  socket.addEventListener("open", () => set(updateQuizSocketContextAtom, () => ({ status: "connected" })), {
    signal: abortController.signal,
  });

  socket.addEventListener("close", () => set(updateQuizSocketContextAtom, () => ({ status: "disconnected" })), {
    signal: abortController.signal,
  });

  socket.addEventListener(
    "message",
    (event) => {
      try {
        const json = JSON.parse(event.data);
        set(receiveFromQuizSocketAtom, json);

        if (!receivedInitialLobby) {
          const lobby = lobbyEventSchema.parse(json);
          set(updateQuizSocketContextAtom, () => ({
            initialLobby: {
              created: lobby.data.created,
              owner: lobby.data.owner,
              players: lobby.data.playerList,
              maxPlayers: lobby.data.maxPlayers,
              quizzes: lobby.data.quizzes,
              currentQuiz: lobby.data.currentQuiz,
            },
          }));
          receivedInitialLobby = true;
        }
      } catch (error) {
        set(updateQuizSocketContextAtom, () => ({ lastError: error }));
      }
    },
    { signal: abortController.signal },
  );

  set(quizSocketContextAtom, {
    socket,
    abortController,
    lobbyId: update.lobbyId,
    status: "connecting",
    initialLobby: null,
    callbacks: [],
    lastError: null,
  });
});

/**
 * Atom to send an action to the websocket
 */
export const sendActionToQuizSocketAtom = atom(null, (_, set, action: QuizAction) => {
  set(sendToQuizSocketAtom, getActionPayload(action));
});
