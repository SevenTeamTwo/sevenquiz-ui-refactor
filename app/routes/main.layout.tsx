import { Outlet, useRouteError } from "react-router";

import { ErrorCard } from "~/components/error-card";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";

export default function () {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-4 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
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
