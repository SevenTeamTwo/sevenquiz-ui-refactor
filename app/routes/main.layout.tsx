import { Outlet, useRouteError } from "react-router";
import { Provider } from "jotai";

import { ErrorCard } from "~/components/error-card";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { store } from "~/lobby/websocket";

export default function () {
  return (
    <Provider store={store}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-4 flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <ErrorCard error={error} />
    </div>
  );
}
