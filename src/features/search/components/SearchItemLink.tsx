import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Link } from "#/shared/components/Link";

const searchItemLinkStyles = cva(
  "group flex flex-col rounded-xs px-3 no-underline transition-all duration-100 ease-in-out hover:bg-paper-hover focus-visible:bg-paper-hover focus-visible:outline-none active:scale-[0.97]",
  {
    variants: {
      size: {
        default: "gap-y-2 py-5",
        compact: "gap-y-1 py-3",
      },
    },
    defaultVariants: { size: "default" },
  },
);

interface SearchItemLinkProps
  extends VariantProps<typeof searchItemLinkStyles> {
  to: string;
  title: string;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children?: ReactNode;
}

export function SearchItemLink({
  to,
  title,
  size,
  onSelect,
  onKeyDown,
  children,
}: SearchItemLinkProps) {
  return (
    <Link
      to={to}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={searchItemLinkStyles({ size })}
    >
      <span className="font-semibold text-ink-strong transition-colors group-hover:text-seal group-focus-visible:text-seal">
        {title}
      </span>
      {children}
    </Link>
  );
}
