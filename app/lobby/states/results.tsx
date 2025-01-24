import { useSelector } from "@xstate/react";

import { useLobbyActor } from "~/lobby/hooks/actor";
import { PlayerScores } from "~/lobby/components/player-scores";

export function Results() {
  const actor = useLobbyActor();
  const results = useSelector(actor, (state) => state.context.results);
  const created = useSelector(actor, (state) => state.context.created);

  if (results === null) {
    return null;
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <PlayerScores results={results} created={created} />
    </div>
  );
}
