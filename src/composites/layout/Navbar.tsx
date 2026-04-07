import { SkyHeader } from "#/features/header/SkyHeader.tsx";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton.tsx";
import { Link } from "#/shared/components/Link.tsx";

export function Navbar() {
  return (
    <nav id="nav" className="sticky top-0 z-5 w-full">
      <div className="z-10 mr-auto ml-auto flex h-16 w-full items-center justify-between bg-linear-to-b from-cyan-200/80 via-cyan-200/60 to-cyan-100/60 px-10 lg:px-20 dark:from-gray-300 dark:via-gray-300/60 dark:to-gray-200/60">
        <div className="relative font-minecraft">
          <Link className="inline-block font-bold text-primary" to="/">
            shdev.blog
          </Link>
        </div>
      </div>
      <ThemeToggleButton />
      <SkyHeader />
    </nav>
  );
}
