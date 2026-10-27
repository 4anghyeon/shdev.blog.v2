import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useEffect } from "react";
import { z } from "zod";
import { BookDetailPanel } from "#/features/bookshelf/components/BookDetailPanel";
import { BOOK_ITEMS } from "#/shared/constant/book-items";

const BookshelfScene = lazy(() =>
  import("#/features/bookshelf/components/BookshelfScene").then((module) => ({
    default: module.BookshelfScene,
  })),
);

export const Route = createFileRoute("/books")({
  validateSearch: z.object({ book: z.string().optional() }),
  component: RouteComponent,
});

function RouteComponent() {
  const { book: selectedId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const selectedBook = BOOK_ITEMS.find((book) => book.id === selectedId);

  const selectBook = (id: string) => navigate({ search: { book: id } });
  const closeBook = () => {
    if (selectedId) navigate({ search: {} });
  };

  useEffect(() => {
    if (!selectedId) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate({ search: {} });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, navigate]);

  return (
    <main className="relative h-[calc(100svh-4rem)] w-full lg:h-[calc(100svh-7.5rem)]">
      <div className="pointer-events-none absolute top-2 left-5 z-10 lg:left-20">
        <h1 className="font-bold text-2xl text-ink-strong">읽은 책</h1>
        <p className="mt-1 text-ink-muted text-sm">
          {BOOK_ITEMS.length}권 · 책을 눌러 꺼내 보세요
        </p>
      </div>
      <ul className="sr-only">
        {BOOK_ITEMS.map((book) => (
          <li key={book.id}>
            <button type="button" onClick={() => selectBook(book.id)}>
              {book.title} - {book.author}
            </button>
          </li>
        ))}
      </ul>
      <ClientOnly>
        <Suspense>
          <BookshelfScene
            books={BOOK_ITEMS}
            selectedId={selectedBook?.id}
            onSelect={selectBook}
            onDeselect={closeBook}
          />
        </Suspense>
      </ClientOnly>
      <AnimatePresence>
        {selectedBook && (
          <BookDetailPanel
            key={selectedBook.id}
            book={selectedBook}
            onClose={closeBook}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
