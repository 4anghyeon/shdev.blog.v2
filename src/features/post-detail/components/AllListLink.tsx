import { List } from "iconoir-react";
import { Link } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface AllListLinkProps {
  className?: string;
  viewTransition?: boolean;
}

export function AllListLink({ className, viewTransition }: AllListLinkProps) {
  return (
    <Link
      className={cn(
        "flex w-fit gap-x-1 text-gray-600 text-sm hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
        className,
      )}
      to="/"
      viewTransition={viewTransition}
    >
      <List />
      전체 글 보기
    </Link>
  );
}
