import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "#/features/about/components/AboutHero";
import { AboutIntro } from "#/features/about/components/AboutIntro";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <AboutHero />
      <section className="mx-auto w-full max-w-3xl px-6 py-8 md:py-5">
        <AboutIntro />
      </section>
    </main>
  );
}
