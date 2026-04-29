import "./glass-item.css";
import { useLocation } from "@tanstack/react-router";
import type * as React from "react";
import { Link, type LinkProps } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface MenuListItemProps extends LinkProps {
  children?: React.ReactNode;
}

export function MenuListItem({ to, children }: MenuListItemProps) {
  const { pathname } = useLocation();
  const isActive = to
    ? to === "/"
      ? pathname === "/"
      : pathname.startsWith(String(to))
    : false;

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
