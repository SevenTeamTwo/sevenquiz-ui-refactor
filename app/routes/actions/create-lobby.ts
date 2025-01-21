import { redirect } from "react-router";

import type { Route } from "./+types/create-lobby";
import { createLobby } from "~/api/create-lobby";

export async function clientAction({ request }: Route.ClientLoaderArgs) {
  const data = await request.formData();
  const username = data.get("username")?.toString();

  if (username === undefined) {
    return redirect(`/?${new URLSearchParams({ error: "Username is required" })}`);
  }

  localStorage.setItem("username", username);

  return (await createLobby()).match(
    ({ id }) => redirect(`/lobby/${id}`),
    ({ message }) => redirect(`/?${new URLSearchParams({ error: message })}`),
  );
}
