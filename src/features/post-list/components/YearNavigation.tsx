import { LandscapeCover } from "#/features/header/LandscapeCover";
import { Link } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";

interface YearNavigationProps {
  years: number[];
}

/** 글 목록 상단에 고정되어, 클릭한 연도 섹션으로 스크롤하고 보고 있는 연도를 강조하는 연도 목록. */
export function YearNavigation({ years }: YearNavigationProps) {
  return (
    <nav
      aria-label="연도별 게시글"
      className="sticky top-16 z-3 mb-6 lg:top-30"
    >
      <LandscapeCover reveal="partial" className="-z-1 h-28 lg:h-42" />
      <ul className="flex gap-x-1 overflow-x-auto pb-2">
        {years.map((year, index) => (
          <li key={year} className="shrink-0">
            <Link
              to="/"
              hash={`year-${year}`}
              hashScrollIntoView={{ behavior: "auto", block: "start" }}
              style={{ animationTimeline: `--year-${year}` }}
              className={cn(
                "inline-block animate-range-[cover_0%_cover_calc(100%+--spacing(12)-1px)] animate-year-active rounded-xs px-2.5 py-1 font-dokdo text-2xl text-ink-muted leading-6 transition-colors hover:text-ink-strong focus-visible:text-ink-strong focus-visible:outline-none",
                { "animate-fill-mode-backwards": index === 0 },
              )}
            >
              {year}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
