import { z } from "zod";

const usernamesCache = z.record(z.string(), z.string());

export function retrieveUsername(lobby: string) {
  const cache = localStorage.getItem("usernames");
  if (!cache) {
    return null;
  }

  try {
    const parsed = usernamesCache.parse(JSON.parse(cache));
    return parsed[lobby] ?? null;
  } catch {
    return null;
  }
}

export function saveUsername(lobby: string, username: string) {
  const cache = localStorage.getItem("usernames");
  if (cache) {
    try {
      const data = usernamesCache.parse(JSON.parse(cache));
      data[lobby] = username;
      localStorage.setItem("usernames", JSON.stringify(data));
    } catch {
      localStorage.setItem("usernames", JSON.stringify({ [lobby]: username }));
    }
  } else {
    localStorage.setItem("usernames", JSON.stringify({ [lobby]: username }));
  }
}

export function removeUsername(lobby: string) {
  const cache = localStorage.getItem("usernames");
  if (cache) {
    try {
      const data = usernamesCache.parse(JSON.parse(cache));
      delete data[lobby];
      localStorage.setItem("usernames", JSON.stringify(data));
    } catch {
      localStorage.setItem("usernames", JSON.stringify({}));
    }
  }
}
