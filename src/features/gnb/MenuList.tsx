import "./glass-effect.css";
import { GlassWrapper } from "#/features/gnb/GlassWrapper.tsx";
import { MenuListItem } from "#/features/gnb/MenuListItem.tsx";

export function MenuList() {
  return (
    <GlassWrapper>
      <ul className="flex gap-x-1 px-2 py-1.5 font-semibold text-sm">
        <MenuListItem to="/">Posts</MenuListItem>
        <MenuListItem to="/about">About</MenuListItem>
      </ul>
    </GlassWrapper>
  );
}
