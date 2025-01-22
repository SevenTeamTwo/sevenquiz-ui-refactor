import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Send } from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "~/shadcn/components/popover";
import { lobbyIdAtom, addCallbackAtom, removeCallbackAtom, receiveAtom } from "~/lobby/websocket";
import { ScrollArea } from "~/shadcn/components/scroll-area";
import { Separator } from "~/shadcn/components/separator";
import { Button } from "~/shadcn/components/button";
import { Input } from "~/shadcn/components/input";

type HistoryItem = {
  message: unknown;
  timestamp: number;
};

export function WebSocketIndicator() {
  const lobbyId = useAtomValue(lobbyIdAtom);
  const addCallback = useSetAtom(addCallbackAtom);
  const removeCallback = useSetAtom(removeCallbackAtom);
  const receive = useSetAtom(receiveAtom);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!lobbyId) {
      return;
    }

    const cb = (message: unknown) => setHistory((prev) => [{ message, timestamp: Date.now() }, ...prev]);
    addCallback(cb);
    return () => {
      removeCallback(cb);
      if (lobbyId === null) {
        setHistory([]);
      }
    };
  }, [lobbyId, addCallback, removeCallback]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      receive(JSON.parse(inputValue));
    } catch (error) {
      console.error(error);
    }
    setInputValue("");
  };

  return (
    lobbyId && (
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button variant="outline">{lobbyId}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <ScrollArea className="h-[500px] w-full rounded-md  p-4">
            {history.map(({ message, timestamp }, i) => (
              <div key={i}>
                <div className="text-xs text-gray-400 mb-1">{formatTimestamp(timestamp)}</div>
                <Highlight theme={themes.gruvboxMaterialDark} code={JSON.stringify(message, null, 2)} language="json">
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={`${className} mb-2 text-sm whitespace-pre-wrap break-all p-1 rounded-sm`}
                      style={style}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
                {i < history.length - 1 && <Separator className="my-2 bg-gray-700" />}
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex items-center p-3 border-t border-border">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow mr-2 text-foreground"
            />
            <Button type="submit" size="icon" className="w-10">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    )
  );
}
