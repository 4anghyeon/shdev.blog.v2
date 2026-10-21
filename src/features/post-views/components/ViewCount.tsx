import { Eye } from "iconoir-react/regular";
import { usePostViews } from "#/features/post-views/hooks/use-post-views";
import { cn } from "#/shared/lib/tailwind";

interface ViewCountProps {
  slug: string;
}

/** 글의 조회수를 올리고 표시한다. 조회수를 불러오기 전에는 숫자를 숨긴다. */
export function ViewCount({ slug }: ViewCountProps) {
  const views = usePostViews(slug);
  const isLoaded = views !== null;

  return (
    <div className="flex items-center gap-x-1 text-ink-muted text-sm">
      <Eye aria-hidden className="size-4 shrink-0" />
      <span className="sr-only">조회수</span>
      <span
        aria-hidden={!isLoaded}
        className={cn(
          "tabular-nums transition-opacity duration-300",
          !isLoaded && "opacity-0",
        )}
      >
        {(views ?? 0).toLocaleString("ko-KR")}
      </span>
    </div>
  );
}
