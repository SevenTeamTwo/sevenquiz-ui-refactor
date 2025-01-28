import type { Route } from "./+types/home.ts";

export function meta({}: Route.MetaArgs) {
  return [{ title: "SevenQuiz" }, { name: "description", content: "Welcome to SevenQuiz!" }];
}

export default function Home() {
  return <div>Hello, world!</div>;
}
