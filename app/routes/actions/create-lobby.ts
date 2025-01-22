import { redirect } from "react-router";

import type { Route } from "./+types/create-lobby";
import { createLobby } from "~/api/create-lobby";
import { saveUsername } from "~/lobby/utils";

export async function clientAction({ request }: Route.ClientLoaderArgs) {
  const data = await request.formData();
  const username = data.get("username")?.toString();

  if (username === undefined) {
    return redirect(`/?${new URLSearchParams({ error: "Username is required" })}`);
  }

  return (await createLobby()).match(
    ({ id }) => {
      saveUsername(id, username);
      return redirect(`/lobby/${id}`);
    },
    ({ message }) => redirect(`/?${new URLSearchParams({ error: message })}`),
  );
}
