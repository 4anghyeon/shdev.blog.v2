import { ArrowUpRight, BookOpen, Link2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MarkdownReference } from "#/features/markdown/utils/rehype-references";
import { BrushDivider } from "#/shared/components/BrushDivider";

interface ReferencesProps {
  items: Array<MarkdownReference>;
}

export function References({ items }: ReferencesProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="mt-14"
      data-pagefind-ignore="all"
      aria-label="참고 자료"
    >
      <BrushDivider className="mb-5" />
      <h2 className="mb-2 font-semibold text-ink-strong text-sm">참고 자료</h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => {
          const title = item.ogTitle || item.title;
          const description = item.ogDescription;
          const details = (
            <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-2.5 py-1.5">
              <span className="flex min-w-0 items-center gap-1 font-semibold text-ink-strong text-xs leading-snug sm:text-sm">
                <span className="line-clamp-1">{title}</span>
                {item.url && (
                  <ArrowUpRight
                    className="size-3 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
              </span>
              {description && (
                <span className="line-clamp-1 text-[11px] text-ink-muted leading-snug">
                  {description}
                </span>
              )}
              <span className="truncate font-mono text-[9px] text-ink-faint">
                {item.hostname ?? "도서"}
              </span>
            </span>
          );

          const className =
            "hanji group flex min-h-16 overflow-hidden rounded-xs border border-line-subtle bg-paper transition-colors hover:border-line hover:bg-paper-hover";

          return (
            <li key={`${item.url ?? "book"}-${item.title}`}>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow external"
                  className={className}
                >
                  <ReferenceThumbnail src={item.ogImage} />
                  {details}
                </a>
              ) : (
                <div className={className}>
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-paper-hover text-ink-faint">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </div>
                  {details}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** 참고 링크의 OG 이미지를 보여주고, 없거나 불러오지 못하면 링크 아이콘으로 대신한다. */
function ReferenceThumbnail({ src }: { src?: string }) {
  const [isBroken, setIsBroken] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // 하이드레이션 전에 실패한 이미지는 onError가 호출되지 않으므로 마운트 시점에 한 번 더 확인한다
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setIsBroken(true);
  }, []);

  if (!src || isBroken) {
    return (
      <div className="flex h-16 w-24 shrink-0 items-center justify-center bg-paper-hover text-ink-faint">
        <Link2 className="size-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      ref={imageRef}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setIsBroken(true)}
      className="h-16 w-24 shrink-0 object-cover"
    />
  );
}
