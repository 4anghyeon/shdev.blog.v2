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
/** 책이 기대거나 비어 보이도록 단마다 채우지 않고 남겨 두는 폭 */
const ROW_SLACK = 6;
/** 단마다 돌려 쓰는, 마지막 책이 옆 책에 기대는 각도(rad). 0이면 세워 두고 자리를 비운다 */
const LEAN_ANGLES = [0.14, 0.2, 0, 0.11];
const FLAT_TILT = Math.PI / 2;
const STACK_SIZE = 3;
/** 책이 이보다 적으면 눕혀 쌓은 더미가 책장의 대부분을 차지해서 쌓지 않는다 */
const MIN_BOOKS_FOR_STACK = 6;
/** 더미의 책을 아래부터 좌우로 어긋나게 놓는 거리 */
const STACK_OFFSETS = [0, 0.7, -0.5];
const STACK_MARGIN = 0.8;

export interface BookPlacement {
  book: BookItem;
  dimensions: BookDimensions;
  position: [number, number, number];
  tilt: number;
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

/** 선반에서 한 자리를 차지하는 단위. 세워 꽂은 책 한 권이거나 눕혀 쌓은 더미다. */
interface ShelfUnit {
  bookIndexes: number[];
  width: number;
  isStack: boolean;
}

/** 가장 최근에 추가된 책들은 눕혀 쌓고, 나머지는 한 권씩 세운다. */
const createUnits = (dimensions: BookDimensions[]): ShelfUnit[] => {
  const stackStart =
    dimensions.length >= MIN_BOOKS_FOR_STACK
      ? dimensions.length - STACK_SIZE
      : dimensions.length;
  const upright = dimensions.slice(0, stackStart).map(
    (d, index): ShelfUnit => ({
      bookIndexes: [index],
      width: d.thickness,
      isStack: false,
    }),
  );
  if (stackStart === dimensions.length) return upright;

  const stacked = range(stackStart, dimensions.length);
  return [
    ...upright,
    {
      bookIndexes: stacked,
      width:
        Math.max(...stacked.map((index) => dimensions[index].height)) +
        STACK_MARGIN * 2,
      isStack: true,
    },
  ];
};

const packRows = (units: ShelfUnit[], innerWidth: number) => {
  const rows: ShelfUnit[][] = [[]];
  let rowWidth = SIDE_PADDING;

  units.forEach((unit) => {
    const needed = unit.width + BOOK_GAP;
    const current = rows[rows.length - 1];
    if (
      current.length > 0 &&
      rowWidth + needed > innerWidth - SIDE_PADDING - ROW_SLACK
    ) {
      rows.push([unit]);
      rowWidth = SIDE_PADDING + needed;
      return;
    }
    current.push(unit);
    rowWidth += needed;
  });

  return rows;
};

const measureShelf = (
  rows: ShelfUnit[][],
  innerWidth: number,
  compartmentHeight: number,
) => ({
  width: innerWidth + SHELF_BOARD * 2,
  height: rows.length * (compartmentHeight + SHELF_BOARD) + SHELF_BOARD,
});

const getSlotZ = (d: BookDimensions) => SHELF_DEPTH / 2 - 1.2 - d.depth / 2;

/**
 * 왼쪽 아래 모서리로 바닥을 딛고 왼쪽 책에 기댄 책의 자세.
 * 기준점은 받쳐 주는 책의 오른쪽 면과 바닥이 만나는 곳이다.
 */
const getLeanPose = (
  d: BookDimensions,
  support: BookDimensions,
  angle: number,
) => {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  // 받쳐 주는 책이 낮으면 그 책의 윗모서리에 걸친다
  const contactHeight = Math.min(d.height * cos, support.height);
  const footX = contactHeight * Math.tan(angle);
  return {
    footprint: footX + d.thickness * cos,
    centerX: footX + (d.thickness / 2) * cos - (d.height / 2) * sin,
    centerY: (d.thickness / 2) * sin + (d.height / 2) * cos,
  };
};

interface RowContext {
  books: readonly BookItem[];
  dimensions: BookDimensions[];
  innerWidth: number;
}

/**
 * 한 단의 책을 왼쪽부터 세우고, 더미가 있으면 오른쪽 끝에 쌓는다.
 * 세운 책 오른쪽에 자리가 남으면 마지막 책을 옆 책에 기대 놓는다.
 */
const placeRow = (
  row: ShelfUnit[],
  rowIndex: number,
  floorY: number,
  { books, dimensions, innerWidth }: RowContext,
): BookPlacement[] => {
  const left = -innerWidth / 2 + SIDE_PADDING;
  const right = innerWidth / 2 - SIDE_PADDING;
  const stack = row.find((unit) => unit.isStack);
  const uprights = row
    .filter((unit) => !unit.isStack)
    .map((unit) => unit.bookIndexes[0]);
  const uprightEnd = stack ? right - stack.width - BOOK_GAP : right;
  const leanAngle = LEAN_ANGLES[rowIndex % LEAN_ANGLES.length];
  let x = left;

  const placements = uprights.map((bookIndex, order): BookPlacement => {
    const d = dimensions[bookIndex];
    const book = books[bookIndex];
    const isLast = order === uprights.length - 1;
    if (isLast && order > 0 && leanAngle > 0) {
      const supportEdge = x - BOOK_GAP;
      const lean = getLeanPose(d, dimensions[uprights[order - 1]], leanAngle);
      if (supportEdge + lean.footprint <= uprightEnd) {
        return {
          book,
          dimensions: d,
          position: [
            supportEdge + lean.centerX,
            floorY + lean.centerY,
            getSlotZ(d),
          ],
          tilt: leanAngle,
        };
      }
    }
    const position: [number, number, number] = [
      x + d.thickness / 2,
      floorY + d.height / 2,
      getSlotZ(d),
    ];
    x += d.thickness + BOOK_GAP;
    return { book, dimensions: d, position, tilt: 0 };
  });
  if (!stack) return placements;

  const stackLeft = uprights.length > 0 ? right - stack.width : left;
  const centerX = stackLeft + stack.width / 2;
  let y = floorY;
  const stacked = stack.bookIndexes.map((bookIndex, order): BookPlacement => {
    const d = dimensions[bookIndex];
    const position: [number, number, number] = [
      centerX + STACK_OFFSETS[order % STACK_OFFSETS.length],
      y + d.thickness / 2,
      getSlotZ(d),
    ];
    y += d.thickness;
    return { book: books[bookIndex], dimensions: d, position, tilt: FLAT_TILT };
  });

  return [...placements, ...stacked];
};

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
  const units = createUnits(dimensions);
  const singleRowWidth =
    sumBy(units, (unit) => unit.width + BOOK_GAP) +
    SIDE_PADDING * 2 +
    ROW_SLACK;
  const widestUnit = Math.max(...units.map((unit) => unit.width));
  const minWidth = Math.max(
    MIN_INNER_WIDTH,
    widestUnit + SIDE_PADDING * 2 + BOOK_GAP + ROW_SLACK,
  );
  const maxWidth = Math.max(minWidth, singleRowWidth);

  const viewAspect = area.width / area.height;
  let best: { innerWidth: number; rows: ShelfUnit[][] } | undefined;
  let bestScore = Number.POSITIVE_INFINITY;

  // 간격 단위로만 훑으면 한 단에 모두 꽂히는 최대 폭을 건너뛸 수 있어서 따로 넣는다
  const candidateWidths = [...range(minWidth, maxWidth, WIDTH_STEP), maxWidth];

  for (const innerWidth of candidateWidths) {
    const rows = packRows(units, innerWidth);
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
    rows: packRows(units, scrollWidth),
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

    return placeRow(row, rowIndex, floorY, {
      books,
      dimensions,
      innerWidth: chosen.innerWidth,
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
