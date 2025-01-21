import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/shadcn/components/alert";

export interface ErrorCardProps {
  error: unknown;
}

export function ErrorCard({ error }: ErrorCardProps) {
  let message: string | undefined;

  if (error instanceof Error) {
    message = error.message;
  } else {
    try {
      message = JSON.stringify(error);
    } catch {
      message = "Erreur inconnue";
    }
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Alert className="max-w-xl" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold mt-1 mb-2">Oups! Une erreur est malencontreusement survenue...</AlertTitle>
        <AlertDescription>
          <p className="max-h-20 overflow-auto">{message}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
