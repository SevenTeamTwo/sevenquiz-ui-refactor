import { useSelector } from "@xstate/react";
import { useLobbyActor } from "~/lobby/hooks/actor";
import { ReviewingText } from "./reviewing-text";

export function Reviewing() {
  const actor = useLobbyActor();
  const created = useSelector(actor, (state) => state.context.created);
  const username = useSelector(actor, (state) => state.context.username);
  const owner = useSelector(actor, (state) => state.context.owner);
  const review = useSelector(actor, (state) => state.context.currentReview);

  if (review === null) {
    return <>Waiting for a review</>;
  }

  return <ReviewingText key={review.question.id} created={created} review={review} canReview={owner === username} />;
}
