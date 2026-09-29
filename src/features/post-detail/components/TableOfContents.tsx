import { useLocation } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { MarkdownHeading } from "#/features/markdown/utils/render-markdown.ts";
import { Link } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";

interface TableOfContentsProps {
  headings: MarkdownHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const location = useLocation();
  const [activeId, setActiveId] = useState(
    location.hash.slice(1) || headings[0]?.id || "",
  );
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // 초기 active 설정
    // 현재 화면에 보이는 첫 번째 헤딩 찾기
    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (!el) continue;
      const { top } = el.getBoundingClientRect();
      if (top >= 0 && top < window.innerHeight) {
        setActiveId(id);
        break;
      }
    }
  }, [headings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const newId = visible[0].target.id;
          setActiveId(newId);
          const ul = listRef.current;
          const li = document.getElementById(`list-${newId}`);
          if (ul && li) {
            ul.scrollTo({
              top: li.offsetTop - ul.clientHeight / 2 + li.clientHeight / 2,
              behavior: "smooth",
            });
          }
        }
      },
      {
        // 목차는 xl 이상에서만 보이므로 데스크톱 헤더 높이(120px) 아래부터 판단한다
        rootMargin: "-120px 0px -80% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 스크롤 끝에 도달하면 마지막 헤딩 active
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 170;
      if (isBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="absolute top-21 -right-64 hidden w-56 max-w-56 xl:block">
      <motion.div
        className="fixed w-56"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <div className="mb-2 border-line-subtle border-b pb-1 font-semibold text-ink-muted text-sm">
          목차
        </div>
        <ul ref={listRef} className="max-h-100 space-y-1 overflow-y-auto">
          {headings.map((heading) => (
            <li
              id={`list-${heading.id}`}
              key={heading.id}
              style={{ paddingLeft: `${heading.level - 2}rem` }}
            >
              <Link
                to="."
                hash={heading.id}
                className={cn(
                  "block border-transparent border-l-2 py-1 pl-2 text-ink-muted text-xs transition-colors hover:text-ink-strong",
                  {
                    "border-seal text-seal hover:text-seal":
                      mounted && activeId === heading.id,
                  },
                )}
                hashScrollIntoView={{ behavior: "smooth", block: "start" }}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </nav>
  );
}
