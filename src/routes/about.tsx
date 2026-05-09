import { createFileRoute } from "@tanstack/react-router";
import { WorkInProgress } from "#/features/wip-404/WorkInProgress";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-1 flex-col">
      <WorkInProgress />
    </div>
  );
}
