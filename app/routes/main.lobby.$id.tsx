import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import type { Route } from "./+types/main.lobby.$id";
import { Lobby } from "~/components/lobby";
import { lobbyEventSchema, type LobbyEvent } from "~/events/lobby";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `SevenQuiz - ${params.id}` }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

function Page({ id }: { id: string }) {
  const { readyState, getWebSocket, sendJsonMessage } = useWebSocket(`${window.env.websocketUrl}/lobby/${id}`);
  const [lobby, setLobby] = useState<LobbyEvent | null>(null);
  const socket = getWebSocket();

  useEffect(() => {
    const ws = getWebSocket();
    if (ws === null || readyState !== ReadyState.OPEN) {
      return;
    }

    ws.onmessage = (event) => {
      try {
        setLobby(lobbyEventSchema.parse(JSON.parse(event.data)));
        ws.onmessage = null;
      } catch (error) {
        console.error(error);
      }
    };
  }, [getWebSocket, readyState]);

  if (readyState === ReadyState.OPEN && socket !== null && lobby !== null) {
    return <Lobby socket={socket} id={id} lobby={lobby} sendJsonMessage={sendJsonMessage} />;
  }

  return <div>Connecting...</div>;
}

export default function ({ params }: Route.ComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return <>{isMounted && <Page id={params.id} />}</>;
}
