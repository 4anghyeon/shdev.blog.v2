import { Journal } from "iconoir-react/regular";
import { SeriesPostList } from "#/features/series/components/SeriesPostList";
import { Badge } from "#/shared/components/Badge";
import type { BlogPost } from "#/shared/schema/blog-post";

interface SeriesListItemProps {
  title: string;
  description: string;
  imageUrl: string;
  posts: BlogPost[];
}

export function SeriesListItem({
  title,
  description,
  imageUrl,
  posts,
}: SeriesListItemProps) {
  return (
    <div className="grid divide-line-subtle rounded-xs border border-line bg-paper p-4 max-md:divide-y md:grid-cols-2 md:divide-x">
      <div className="flex items-center gap-x-5 max-md:pb-5 md:pr-5">
        <img
          className="size-24 shrink-0 rounded-full border border-line object-cover"
          src={imageUrl}
          alt={`${title} cover`}
        />
        <div className="flex flex-col items-start gap-y-2">
          <h2 className="font-semibold text-ink-strong text-lg">{title}</h2>
          <p className="text-ink-muted text-sm">{description}</p>
          <Badge>
            <Journal />
            {posts.length}개의 글
          </Badge>
        </div>
      </div>
      <SeriesPostList
        posts={posts}
        className="h-30 overflow-y-auto max-md:pt-5 md:pl-5"
      />
    </div>
  );
}
