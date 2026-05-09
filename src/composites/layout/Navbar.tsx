import { Suspense } from "react";
import { MenuList } from "#/features/gnb/components/MenuList";
import { SkyHeader } from "#/features/header/SkyHeader";
import { SearchButton } from "#/features/search/components/SearchButton";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton";
import { Link } from "#/shared/components/Link";

export function Navbar() {
  return (
    <nav id="nav" className="sticky top-0 z-5 w-full">
      <div className="z-10 mr-auto ml-auto flex h-16 w-full items-center justify-between bg-linear-to-b from-cyan-200/80 via-cyan-200/60 to-cyan-100/60 px-4 lg:px-20 dark:from-stone-950 dark:via-stone-950/60 dark:to-stone-950/40">
        <div className="relative font-minecraft">
          <Link className="inline-block font-bold text-primary" to="/">
            shdev.blog
          </Link>
        </div>
        <Suspense>
          <MenuList />
        </Suspense>
        <SearchButton />
      </div>
      <ThemeToggleButton />
      <SkyHeader />
    </nav>
  );
}
