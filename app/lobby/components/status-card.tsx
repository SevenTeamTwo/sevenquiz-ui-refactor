import { AlertCircle, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/shadcn/components/alert";
import { connectAtom, type SocketStatus } from "~/lobby/websocket";
import { useSetAtom } from "jotai";
import { Button } from "~/shadcn/components/button";

export interface StatusCardProps {
  status: SocketStatus;
  id: string;
}

const statusVariants: Record<SocketStatus, "default" | "destructive"> = {
  unconnected: "default",
  connecting: "default",
  connected: "default",
  disconnected: "destructive",
};

const statusIcons: Record<SocketStatus, React.ReactNode> = {
  unconnected: <Info className="h-4 w-4" />,
  connecting: <Info className="h-4 w-4" />,
  connected: <Info className="h-4 w-4" />,
  disconnected: <AlertCircle className="h-4 w-4" />,
};

const statusTitles: Record<SocketStatus, string> = {
  unconnected: "Unconnected",
  connecting: "Connecting to the server...",
  connected: "Successfully connected to the server",
  disconnected: "Disconnected from the server",
};

const statusDescriptions: Record<SocketStatus, string> = {
  unconnected: "You are not connected to the server.",
  connecting: "Attempting to connect to the server...",
  connected: "Waiting for the initial lobby state...",
  disconnected: "The connection to the server has been lost.",
};

export function StatusCard(props: StatusCardProps) {
  const connect = useSetAtom(connectAtom);

  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <Alert className="max-w-xl" variant={statusVariants[props.status]}>
        {statusIcons[props.status]}
        <AlertTitle className="font-bold mt-1 mb-2">{statusTitles[props.status]}</AlertTitle>
        <AlertDescription className="relative">
          <p className="max-h-20 overflow-auto">{statusDescriptions[props.status]}</p>
          {props.status === "disconnected" && (
            <Button
              variant="destructive"
              className="absolute right-0 bottom-0"
              onClick={() => connect({ id: props.id })}
            >
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
