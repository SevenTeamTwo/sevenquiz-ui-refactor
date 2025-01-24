import type { Route } from "./+types/main.lobby.$id";
import { Lobby } from "~/lobby/components/lobby";
import { useLobbyConnection } from "~/lobby/hooks/connection";
import { StatusCard } from "~/lobby/components/status-card";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `SevenQuiz - ${params.id}` }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function ({ params }: Route.ComponentProps) {
  const { status, initialLobby, gameState } = useLobbyConnection(params.id);

  if (initialLobby !== null && !(gameState !== "results" && status === "disconnected")) {
    return <Lobby initialLobby={initialLobby} id={params.id} />;
  }

  return <StatusCard status={status} id={params.id} />;
}
