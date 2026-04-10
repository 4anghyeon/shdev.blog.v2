import { useLocation } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";
import { useCopy } from "#/shared/hooks/use-copy.ts";
import { cn } from "#/shared/lib/tailwind.ts";

type HeadingLinkProps = {
  anchor: string;
};

export function AnchorCopyButton({ anchor }: HeadingLinkProps) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const { copy } = useCopy();

  return (
    <button
      className={cn(
        "hidden animate-duration-100 cursor-pointer focus:animate-jelly group-hover:flex hover:[&>svg]:text-blue-800 dark:hover:[&>svg]:text-blue-400",
      )}
      type="button"
      onClick={() => copy(`${window.location.origin}${pathname}${anchor}`)}
    >
      <LinkIcon width={16} height={16} />
    </button>
  );
}
