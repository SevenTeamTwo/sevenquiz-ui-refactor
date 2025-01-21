import { createThemeSessionResolver } from "remix-themes";
import { createCookieSessionStorage } from "react-router";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET environment variable must be set");

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__remix-themes",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined,
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
