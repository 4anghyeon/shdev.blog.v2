import { clamp, range, sumBy } from "es-toolkit";
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
/** 책장 둘레에 남기는 여백 비율 */
export const FIT_MARGIN = 1.12;
/** 책등 글자를 알아볼 수 있는 최소 배율(1cm당 화면 px). 이보다 작아지면 한 화면에 다 넣지 않고 스크롤한다 */
const MIN_PIXELS_PER_CM = 8;

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
  /** 최소 배율로도 화면에 다 들어가지 않아 세로로 스크롤해야 하는지 */
  isScrollable: boolean;
  placements: BookPlacement[];
}

interface PixelArea {
  width: number;
  height: number;
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

const measureShelf = (
  rows: number[][],
  innerWidth: number,
  compartmentHeight: number,
) => ({
  width: innerWidth + SHELF_BOARD * 2,
  height: rows.length * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD,
});

/**
 * 책장 전체가 최소 배율 이상으로 화면에 들어오는 폭 중에서 화면 비율과 가장 비슷한 폭을 고른다.
 * 그런 폭이 없을 만큼 책이 많으면 최소 배율로 화면 폭을 채우고 세로로 스크롤하게 한다.
 */
export const computeShelfLayout = (
  books: readonly BookItem[],
  area: PixelArea,
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

  const viewAspect = area.width / area.height;
  let best: { innerWidth: number; rows: number[][] } | undefined;
  let bestScore = Number.POSITIVE_INFINITY;

  // 간격 단위로만 훑으면 한 단에 모두 꽂히는 최대 폭을 건너뛸 수 있어서 따로 넣는다
  const candidateWidths = [...range(minWidth, maxWidth, WIDTH_STEP), maxWidth];

  for (const innerWidth of candidateWidths) {
    const rows = packRows(dimensions, innerWidth);
    const size = measureShelf(rows, innerWidth, compartmentHeight);
    const fitScale =
      Math.min(area.width / size.width, area.height / size.height) / FIT_MARGIN;
    if (fitScale < MIN_PIXELS_PER_CM) continue;
    const score = Math.abs(Math.log(size.width / size.height / viewAspect));
    if (score < bestScore) {
      bestScore = score;
      best = { innerWidth, rows };
    }
  }

  const isScrollable = best === undefined;
  const scrollWidth = clamp(
    area.width / (MIN_PIXELS_PER_CM * FIT_MARGIN) - SHELF_BOARD * 2,
    minWidth,
    maxWidth,
  );
  const chosen = best ?? {
    innerWidth: scrollWidth,
    rows: packRows(dimensions, scrollWidth),
  };

  const rowCount = chosen.rows.length;
  const { width, height } = measureShelf(
    chosen.rows,
    chosen.innerWidth,
    compartmentHeight,
  );

  const placements = chosen.rows.flatMap((row, rowIndex) => {
    const boardIndex = rowCount - 1 - rowIndex;
    const floorY =
      boardIndex * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD - height / 2;
    let x = -chosen.innerWidth / 2 + SIDE_PADDING;

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
    innerWidth: chosen.innerWidth,
    compartmentHeight,
    rows: rowCount,
    width,
    height,
    isScrollable,
    placements,
  };
};
