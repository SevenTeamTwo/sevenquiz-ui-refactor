import { fromPromise, type ResultAsync } from "neverthrow";
import { z } from "zod";

/**
 * Schema of the lobby creation data
 */
const CreateLobbyResponseSchema = z.object({
  id: z.string(),
});

/**
 * Type of the lobby creation data
 */
export type CreateLobbyResponse = z.infer<typeof CreateLobbyResponseSchema>;

/**
 * Creates a lobby
 *
 * @returns The lobby data
 */
export function createLobby(): ResultAsync<CreateLobbyResponse, Error> {
  return fromPromise(
    fetch(`${window.env.apiUrl}/lobby`, {
      method: "POST",
    }),
    (error) => {
      console.error(error);
      return new Error(`Failed to create lobby: ${error}`);
    },
  )
    .andThen((response) =>
      fromPromise(response.json(), (error) => {
        console.error(error);
        return new Error(`Failed to parse JSON: ${error}`);
      }),
    )
    .andThen((data) =>
      fromPromise(CreateLobbyResponseSchema.parseAsync(data), (error) => {
        console.error(error);
        return new Error(`Failed to parse response: ${error}`);
      }),
    );
}
