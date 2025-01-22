import { redirect } from "react-router";

import type { Route } from "./+types/create-lobby";
import { saveUsername } from "~/lobby/utils";

export async function clientAction({ request }: Route.ClientLoaderArgs) {
  const data = await request.formData();

  const code = data.get("code")?.toString();
  const username = data.get("username")?.toString();

  if (code === undefined) {
    return redirect(`/?${new URLSearchParams({ error: "Code is required" })}`);
  }

  if (username === undefined) {
    return redirect(`/?${new URLSearchParams({ error: "Username is required" })}`);
  }

  saveUsername(code, username);
  return redirect(`/lobby/${code}`);
}
