import { Suspense } from "react";
import { NavigationList } from "#/features/gnb/components/NavigationList";
import { LandscapeHeader } from "#/features/header/LandscapeHeader";
import { SearchButton } from "#/features/search/components/SearchButton";
import { Link } from "#/shared/components/Link";

export function Navbar() {
  return (
    <>
      <LandscapeHeader />
      <nav
        id="nav"
        className="pointer-events-none sticky top-0 z-5 h-16 w-full lg:h-30"
      >
        <div className="pointer-events-auto z-10 mr-auto ml-auto flex h-16 w-full items-center justify-between px-4 lg:px-20">
          <div className="relative font-minecraft">
            <Link className="inline-block font-bold text-primary" to="/">
              shdev.blog
            </Link>
          </div>
          <Suspense>
            <NavigationList />
          </Suspense>
          <SearchButton />
        </div>
      </nav>
    </>
  );
}
