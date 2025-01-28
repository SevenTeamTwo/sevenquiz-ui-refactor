import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider, useTheme, PreventFlashOnWrongTheme, type Theme } from "remix-themes";
import { clsx } from "clsx";
import invariant from "tiny-invariant";

import type { Route } from "./+types/root.ts";
import { themeSessionResolver } from "./session.server.ts";
import "./app.css";

export const links: Route.LinksFunction = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);

  invariant(process.env.API_URL, "API_URL environment variable must be set");
  invariant(process.env.WEBSOCKET_URL, "WEBSOCKET_URL environment variable must be set");

  return {
    specifiedTheme: getTheme(),
    env: {
      apiUrl: process.env.API_URL,
      websocketUrl: process.env.WEBSOCKET_URL,
    },
  };
}

function App(props: { specifiedTheme: Theme | null; env: Record<string, string> }) {
  const [theme] = useTheme();

  return (
    <html lang="en" suppressHydrationWarning={true} className={clsx("bg-background", theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(props.specifiedTheme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: setting the window.env variable
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(props.env)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function ({ loaderData }: Route.ComponentProps) {
  return (
    <ThemeProvider specifiedTheme={loaderData.specifiedTheme} themeAction="/actions/set-theme">
      <App {...loaderData} />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
