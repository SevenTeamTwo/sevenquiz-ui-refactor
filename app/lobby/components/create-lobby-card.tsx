import { Form } from "react-router";

import { Button } from "~/shadcn/components/button";
import { Card, CardContent, CardFooter } from "~/shadcn/components/card";
import { Input } from "~/shadcn/components/input";
import { Label } from "~/shadcn/components/label";

export function CreateLobbyCard() {
  return (
    <Card>
      <Form method="POST" action="/actions/create-lobby">
        <CardContent className="pt-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Pseudonyme</Label>
              <Input name="username" id="username" placeholder="Sylvain du drift" />
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
