import { useSelector } from "@xstate/react";

import { useLobbyActor } from "~/lobby/hooks/actor";
import { PlayingChoices } from "./playing-choices";
import { PlayingText } from "./playing-text";

export function Playing() {
  const actor = useLobbyActor();
  const question = useSelector(actor, (state) => state.context.currentQuestion);

  if (question === null) {
    return <>Waiting for the question...</>;
  }

  if (question.type === "choices") {
    return <PlayingChoices key={question.id} {...question} />;
  }

  if (question.type === "text") {
    return <PlayingText key={question.id} {...question} />;
  }

  return <>Unsupported question type</>;
}
