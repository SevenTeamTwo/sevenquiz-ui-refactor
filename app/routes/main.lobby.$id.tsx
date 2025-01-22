import type { Route } from "./+types/main.lobby.$id";
import { Lobby } from "~/lobby/components/lobby";
import { useLobbyConnection } from "~/lobby/hooks/connection";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `SevenQuiz - ${params.id}` }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function ({ params }: Route.ComponentProps) {
  const { status, initialLobby } = useLobbyConnection(params.id);

  if (initialLobby !== null) {
    return <Lobby initialLobby={initialLobby} id={params.id} />;
  }
  return <div>{status}</div>;
}
