import { Suspense } from "react";
import { NavigationList } from "#/features/gnb/components/NavigationList";
import { LandscapeHeader } from "#/features/header/LandscapeHeader";
import { LandscapeStrip } from "#/features/header/LandscapeStrip";
import { SearchButton } from "#/features/search/components/SearchButton";
import { Link } from "#/shared/components/Link";

export function Navbar() {
  return (
    <>
      <LandscapeHeader />
      {/* 이미지 속 해/달 중심 좌표 (라이트/다크 이미지 모두 71.5%, 20.83%) */}
      <nav
        id="nav"
        className="@container sticky top-0 z-5 w-full [--sun-x:71.5%] [--sun-y:0.2083]"
      >
        <div className="relative isolate z-10 mr-auto ml-auto flex h-16 w-full items-center justify-between px-4 lg:px-20">
          <LandscapeStrip />
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
