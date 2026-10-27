import type { BookBinding, BookItem } from "#/shared/constant/book-items";

const PAGE_THICKNESS = 0.0058;

export interface BookDimensions {
  thickness: number;
  height: number;
  depth: number;
  board: number;
  overhang: number;
  spineBulge: number;
}

const BINDING_SPEC = {
  hardcover: { board: 0.24, overhang: 0.3, spineBulge: 0.38 },
  paperback: { board: 0.045, overhang: 0, spineBulge: 0.1 },
} satisfies Record<
  BookBinding,
  Pick<BookDimensions, "board" | "overhang" | "spineBulge">
>;

/** 판형, 쪽수, 제본 방식으로 책의 실제 치수(cm)를 계산한다. */
export const getBookDimensions = (book: BookItem): BookDimensions => {
  const spec = BINDING_SPEC[book.binding];

  return {
    thickness: book.pages * PAGE_THICKNESS + spec.board * 2,
    height: book.size.height,
    depth: book.size.width,
    board: spec.board,
    overhang: spec.overhang,
    spineBulge: spec.spineBulge,
  };
};
