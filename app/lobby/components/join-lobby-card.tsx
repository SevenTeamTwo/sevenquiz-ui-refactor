import { Form } from "react-router";
import clsx from "clsx";

import { Button } from "~/shadcn/components/button";
import { Card, CardContent, CardFooter } from "~/shadcn/components/card";
import { Input } from "~/shadcn/components/input";
import { Label } from "~/shadcn/components/label";

interface JoinLobbyCardProps {
  code?: string | null;
  onSubmit?: (code: string, username: string) => void;
}

export function JoinLobbyCard({ code, onSubmit }: JoinLobbyCardProps) {
  return (
    <Card>
      <Form
        onSubmit={
          code
            ? (event) => {
                event.preventDefault();
                onSubmit?.(
                  code ?? (event.currentTarget.code.value as string),
                  event.currentTarget.username.value as string,
                );
              }
            : undefined
        }
        method="POST"
        action="/actions/join-lobby"
      >
        <CardContent className="pt-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Pseudonyme</Label>
              <Input name="username" id="username" placeholder="Sylvain du drift" />
            </div>
            <div className={clsx("flex flex-col space-y-1.5", code && "hidden")}>
              <Label htmlFor="username">Code</Label>
              <Input name="code" id="code" placeholder="XFCE5" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            C'est parti
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
