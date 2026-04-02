import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return <main className="px-4 pt-14 pb-8"></main>;
}
