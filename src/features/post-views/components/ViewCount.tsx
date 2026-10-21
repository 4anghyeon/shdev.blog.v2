import { usePostViews } from "#/features/post-views/hooks/use-post-views";

interface ViewCountProps {
  slug: string;
}

/** 글의 조회수를 올리고 표시한다. */
export function ViewCount({ slug }: ViewCountProps) {
  const views = usePostViews(slug) ?? 0;

  return (
    <div className="flex items-center gap-x-1 text-ink-muted text-sm">
      <span>조회수:</span>
      <span className="tabular-nums">{views.toLocaleString("ko-KR")}</span>
    </div>
  );
}
