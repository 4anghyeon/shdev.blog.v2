import "./glass-item.css";
import { useLocation } from "@tanstack/react-router";
import type * as React from "react";
import { Link, type LinkProps } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface MenuListItemProps extends LinkProps {
  children?: React.ReactNode;
  subPath?: LinkProps["to"];
}

export function MenuListItem({ to, children, subPath }: MenuListItemProps) {
  const { pathname } = useLocation();
  const isActive = (() => {
    if (subPath && pathname.startsWith(String(subPath))) return true;
    if (!to) return false;
    return to === "/" ? pathname === "/" : pathname.startsWith(String(to));
  })();

  return (
    <li
      className={cn("glass-item px-2 py-1", {
        "glass-item-active": isActive,
      })}
    >
      <Link to={to}>{children}</Link>
    </li>
  );
}
