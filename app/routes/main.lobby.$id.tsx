import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type { Route } from "./+types/main.lobby.$id";
import { Lobby } from "~/lobby/components/lobby";
import { connectAtom, initialLobbyAtom, statusAtom } from "~/lobby/websocket";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `SevenQuiz - ${params.id}` }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function ({ params }: Route.ComponentProps) {
  const state = useAtomValue(statusAtom);
  const initialLobby = useAtomValue(initialLobbyAtom);
  const connect = useSetAtom(connectAtom);

  useEffect(() => {
    connect({ id: params.id });
  }, [connect, params.id]);

  if (state === "connected" && initialLobby !== null) {
    return <Lobby initialLobby={initialLobby} id={params.id} />;
  }

  return <div>{state}</div>;
}
