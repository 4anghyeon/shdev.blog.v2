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
        <div className="pointer-events-auto z-10 mr-auto ml-auto flex h-16 w-full items-center justify-between px-5 lg:px-20">
          <div className="relative font-dokdo">
            {/* 풍경(소나무 가지) 위에서도 읽히도록 배경색으로 은은한 번짐을 준다 */}
            <Link
              className="inline-block text-3xl text-primary [text-shadow:0_0_4px_var(--background),0_0_10px_var(--background),0_0_18px_var(--background)]"
              to="/"
            >
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
