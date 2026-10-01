import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { getPageSlideViewTransition } from "#/features/gnb/page-slide";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: getPageSlideViewTransition(),
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
