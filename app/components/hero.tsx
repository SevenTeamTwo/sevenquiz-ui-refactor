import { Badge } from "~/shadcn/components/badge";

export function Hero() {
  return (
    <>
      <div className="relative">
        <Badge className="bg-gradient-to-br from-blue-600 to-green-500 text-white shadow-xl mb-4 lg:absolute lg:-top-10 rounded-xl border-small border-white/50">
          Nouveau
        </Badge>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            Amusez-vous
          </span>{" "}
          avec vos amis
        </h2>
      </div>
      <p className="mt-6 text-muted-foreground font-medium">
        Le meilleur site de quiz pour tester vos connaissances et défier vos amis !
      </p>
    </>
  );
}
