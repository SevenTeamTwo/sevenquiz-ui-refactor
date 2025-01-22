import { useEffect } from "react";
import type { ActorRefFrom } from "xstate";

import type { lobbyMachine } from "~/lobby/machine";
import { useToast } from "~/shadcn/hooks/use-toast";

export function useLobbyNotification(actor: ActorRefFrom<typeof lobbyMachine>) {
  const { toast } = useToast();

  useEffect(() => {
    const subscriptions = [
      actor.on("playerJoined", (event) => {
        toast({
          variant: "default",
          title: `${event.username} a rejoint la partie`,
        });
      }),
      actor.on("newOwner", (event) => {
        if (event.username === null) {
          toast({
            variant: "default",
            title: "Il n'y a plus de propriétaire de la partie",
          });
        } else {
          toast({
            variant: "default",
            title: `${event.username} est le nouveau propriétaire de la partie`,
          });
        }
      }),
      actor.on("playerLeft", (event) => {
        toast({
          variant: "destructive",
          title: `${event.username} a quitté la partie`,
        });
      }),
    ];

    return () => {
      for (const sub of subscriptions) {
        sub.unsubscribe();
      }
    };
  }, [actor, toast]);
}
