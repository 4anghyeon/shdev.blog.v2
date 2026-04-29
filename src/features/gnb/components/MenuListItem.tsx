import type * as React from "react";
import { Link, type LinkProps } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface MenuListItemProps extends Omit<LinkProps, "ref"> {
  index: number;
  isActive: boolean;
  ref?: React.Ref<HTMLLIElement>;
  children?: React.ReactNode;
}

export function MenuListItem({ to, children, index, isActive, ref }: MenuListItemProps) {

  return (
    <li
      ref={ref}
      className={cn("glass-item px-2 py-1", {
        "glass-item-active": isActive,
      })}
      data-index={index}
    >
      <Link to={to}>{children}</Link>
    </li>
  );
}
