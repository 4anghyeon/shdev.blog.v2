import "./glass-effect/glass-effect.css";
import { GlassWrapper } from "#/features/gnb/glass-effect/GlassWrapper.tsx";
import { MenuListItem } from "#/features/gnb/MenuListItem.tsx";

export function MenuList() {
  return (
    <GlassWrapper className="max-md:fixed max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2">
      <ul className="flex gap-x-1 px-2 py-1.5 font-semibold text-sm">
        <MenuListItem to="/" subPath="/ko/post">
          Posts
        </MenuListItem>
        <MenuListItem to="/about">About</MenuListItem>
      </ul>
    </GlassWrapper>
  );
}
