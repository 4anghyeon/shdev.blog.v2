import { ArrowUpRight, X } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "#/shared/components/Link";
import type { BookItem } from "#/shared/constant/book-items";

interface BookDetailPanelProps {
  book: BookItem;
  onClose: () => void;
}

/** 꺼낸 책의 정보와 관련 링크를 보여 주는 패널. 모바일에서는 하단 시트로 뜬다. */
export function BookDetailPanel({ book, onClose }: BookDetailPanelProps) {
  const links = [
    ...(book.postUrl ? [{ label: "관련 글 읽기", href: book.postUrl }] : []),
    ...(book.links ?? []),
  ];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-end p-4 pb-16 md:items-center md:justify-end md:p-6">
      <motion.aside
        aria-label={`${book.title} 정보`}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.35, duration: 0.3 },
        }}
        exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
        className="hanji pointer-events-auto relative max-h-[45%] w-full overflow-y-auto rounded-2xl border border-line bg-paper-solid p-5 shadow-lg md:max-h-[80%] md:w-80"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-3 right-3 rounded-full p-1.5 text-ink-muted hover:bg-paper-hover hover:text-ink-strong"
        >
          <X className="size-4" />
        </button>
        <h2 className="pr-6 font-bold text-ink-strong text-xl leading-snug">
          {book.title}
        </h2>
        <p className="mt-1 text-ink text-sm">{book.author}</p>
        <p className="mt-4 text-ink text-sm leading-relaxed">{book.summary}</p>
        {links.length > 0 && (
          <ul className="mt-5 flex flex-col gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="inline-flex items-center gap-x-1 text-seal text-sm underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.aside>
    </div>
  );
}
