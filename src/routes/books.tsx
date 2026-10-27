import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { lazy, Suspense, useEffect } from "react";
import { z } from "zod";
import { PageContainer } from "#/composites/layout/PageContainer";
import { BookDetailPanel } from "#/features/bookshelf/components/BookDetailPanel";
import { BrushBorder } from "#/shared/components/BrushBorder";
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
    <PageContainer
      width="wide"
      className="flex min-h-[calc(100svh-4rem)] flex-col lg:min-h-[calc(100svh-7.5rem)]"
    >
      <BrushBorder side="bottom" className="mb-10 flex flex-col gap-y-4 pb-5">
        <h1 className="font-bold text-4xl text-ink-strong">읽은 책</h1>
        <p className="text-ink">
          읽은 책들을 한 권씩 꽂아 둔 책장입니다. 눌러서 꺼내 볼 수 있어요.
        </p>
      </BrushBorder>
      <ul className="sr-only">
        {BOOK_ITEMS.map((book) => (
          <li key={book.id}>
            <button type="button" onClick={() => selectBook(book.id)}>
              {book.title} - {book.author}
            </button>
          </li>
        ))}
      </ul>
      <div className="relative min-h-80 flex-1">
        <div className="absolute inset-0">
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
        </div>
        <AnimatePresence>
          {selectedBook && (
            <BookDetailPanel
              key={selectedBook.id}
              book={selectedBook}
              onClose={closeBook}
            />
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
