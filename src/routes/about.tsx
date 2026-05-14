import { createFileRoute } from "@tanstack/react-router";
import { RouteContainer } from "#/composites/about/RouteContainer.tsx";
import aboutCss from "#/styles/about.css?url";

export const Route = createFileRoute("/about")({
  component: RouteContainer,
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: aboutCss,
        fetchPriority: "high",
      },
    ],
  }),
});
