import { sumBy } from "es-toolkit";
import {
  type BookDimensions,
  getBookDimensions,
} from "#/features/bookshelf/helper/book-dimensions";
import type { BookItem } from "#/shared/constant/book-items";

export const SHELF_BOARD = 2;
export const SHELF_DEPTH = 26;
const BOOK_GAP = 0.12;
const SIDE_PADDING = 1.2;
const TOP_CLEARANCE = 5;
const MIN_INNER_WIDTH = 30;
const WIDTH_STEP = 2;

export interface BookPlacement {
  book: BookItem;
  dimensions: BookDimensions;
  position: [number, number, number];
}

export interface ShelfLayout {
  innerWidth: number;
  compartmentHeight: number;
  rows: number;
  width: number;
  height: number;
  placements: BookPlacement[];
}

const packRows = (items: BookDimensions[], innerWidth: number) => {
  const rows: number[][] = [[]];
  let rowWidth = SIDE_PADDING;

  items.forEach((dimensions, index) => {
    const needed = dimensions.thickness + BOOK_GAP;
    const current = rows[rows.length - 1];
    if (current.length > 0 && rowWidth + needed > innerWidth - SIDE_PADDING) {
      rows.push([index]);
      rowWidth = SIDE_PADDING + needed;
      return;
    }
    current.push(index);
    rowWidth += needed;
  });

  return rows;
};

/**
 * 화면 비율과 가장 비슷한 비율이 되도록 선반 폭을 골라 책을 배치한다.
 * 좁은 화면에서는 여러 단으로, 넓은 화면에서는 한 단으로 길게 꽂힌다.
 */
export const computeShelfLayout = (
  books: readonly BookItem[],
  viewAspect: number,
): ShelfLayout => {
  const dimensions = books.map(getBookDimensions);
  const compartmentHeight =
    Math.max(...dimensions.map((d) => d.height)) + TOP_CLEARANCE;
  const singleRowWidth =
    sumBy(dimensions, (d) => d.thickness + BOOK_GAP) + SIDE_PADDING * 2;
  const widestBook = Math.max(...dimensions.map((d) => d.thickness));
  const minWidth = Math.max(
    MIN_INNER_WIDTH,
    widestBook + SIDE_PADDING * 2 + BOOK_GAP,
  );
  const maxWidth = Math.max(minWidth, singleRowWidth);

  let best = { innerWidth: maxWidth, rows: packRows(dimensions, maxWidth) };
  let bestScore = Number.POSITIVE_INFINITY;

  for (
    let innerWidth = minWidth;
    innerWidth <= maxWidth;
    innerWidth += WIDTH_STEP
  ) {
    const rows = packRows(dimensions, innerWidth);
    const width = innerWidth + SHELF_BOARD * 2;
    const height =
      rows.length * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD;
    const score = Math.abs(Math.log(width / height / viewAspect));
    if (score < bestScore) {
      bestScore = score;
      best = { innerWidth, rows };
    }
  }

  const rowCount = best.rows.length;
  const width = best.innerWidth + SHELF_BOARD * 2;
  const height = rowCount * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD;

  const placements = best.rows.flatMap((row, rowIndex) => {
    const boardIndex = rowCount - 1 - rowIndex;
    const floorY =
      boardIndex * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD - height / 2;
    let x = -best.innerWidth / 2 + SIDE_PADDING;

    return row.map((bookIndex) => {
      const d = dimensions[bookIndex];
      const position: [number, number, number] = [
        x + d.thickness / 2,
        floorY + d.height / 2,
        SHELF_DEPTH / 2 - 1.2 - d.depth / 2,
      ];
      x += d.thickness + BOOK_GAP;
      return { book: books[bookIndex], dimensions: d, position };
    });
  });

  return {
    innerWidth: best.innerWidth,
    compartmentHeight,
    rows: rowCount,
    width,
    height,
    placements,
  };
};
