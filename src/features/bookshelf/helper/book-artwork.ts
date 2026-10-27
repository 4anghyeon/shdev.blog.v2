import { once } from "es-toolkit";
import type { BookDimensions } from "#/features/bookshelf/helper/book-dimensions";
import {
  createCanvas,
  toTexture,
} from "#/features/bookshelf/helper/procedural-textures";
import type { BookItem } from "#/shared/constant/book-items";

const PX_PER_CM = 48;
const FONT_FAMILY = '"Pretendard Variable", sans-serif';

interface ArtworkPalette {
  background: string;
  ink: string;
}

const COLOR_PALETTE = (book: BookItem): ArtworkPalette => ({
  background: book.color,
  ink: book.ink,
});

/** 박(foil) 영역만 흰색으로 그려 metalnessMap으로 쓰기 위한 팔레트. */
const FOIL_MASK_PALETTE: ArtworkPalette = {
  background: "#000000",
  ink: "#ffffff",
};

/** 캔버스에 글자를 그리기 전에 블로그 본문 폰트를 불러온다. */
export const loadBookFonts = once(() =>
  Promise.all([
    document.fonts.load(`800 40px ${FONT_FAMILY}`),
    document.fonts.load(`500 40px ${FONT_FAMILY}`),
  ]),
);

const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  const lines: string[] = [];
  let line = "";

  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }
  if (line) lines.push(line);

  return lines;
};

const fitFontSize = (
  context: CanvasRenderingContext2D,
  text: string,
  weight: number,
  initialSize: number,
  maxWidth: number,
) => {
  let size = initialSize;
  context.font = `${weight} ${size}px ${FONT_FAMILY}`;
  while (context.measureText(text).width > maxWidth && size > 8) {
    size -= 1;
    context.font = `${weight} ${size}px ${FONT_FAMILY}`;
  }
  return size;
};

const drawSpine = (
  context: CanvasRenderingContext2D,
  book: BookItem,
  width: number,
  height: number,
  palette: ArtworkPalette,
) => {
  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = palette.ink;
  context.strokeStyle = palette.ink;

  if (book.binding === "hardcover") {
    const bandWidth = Math.max(1, width * 0.025);
    for (const y of [
      height * 0.06,
      height * 0.075,
      height * 0.925,
      height * 0.94,
    ]) {
      context.fillRect(width * 0.12, y, width * 0.76, bandWidth);
    }
  }

  // 책등 글자는 위에서 아래로 읽히도록 시계 방향으로 눕힌다
  context.save();
  context.translate(width / 2, 0);
  context.rotate(Math.PI / 2);
  context.textBaseline = "middle";

  const titleSize = fitFontSize(
    context,
    book.title,
    800,
    width * 0.3,
    height * 0.5,
  );
  context.font = `800 ${titleSize}px ${FONT_FAMILY}`;
  context.fillText(book.title, height * 0.12, 0);

  const authorSize = fitFontSize(
    context,
    book.author,
    500,
    width * 0.2,
    height * 0.18,
  );
  context.font = `500 ${authorSize}px ${FONT_FAMILY}`;
  context.textAlign = "right";
  context.fillText(book.author, height * 0.88, 0);
  context.restore();
};

const drawCover = (
  context: CanvasRenderingContext2D,
  book: BookItem,
  width: number,
  height: number,
  palette: ArtworkPalette,
) => {
  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = palette.ink;
  context.strokeStyle = palette.ink;
  context.textBaseline = "alphabetic";

  const margin = width * 0.12;
  const titleSize = width * 0.105;
  context.font = `800 ${titleSize}px ${FONT_FAMILY}`;
  const lines = wrapText(context, book.title, width - margin * 2);

  if (book.binding === "hardcover") {
    context.textAlign = "center";
    context.lineWidth = Math.max(2, width * 0.006);
    context.strokeRect(
      margin * 0.6,
      margin * 0.6,
      width - margin * 1.2,
      height - margin * 1.2,
    );
    lines.forEach((line, index) => {
      context.fillText(
        line,
        width / 2,
        height * 0.34 + index * titleSize * 1.25,
      );
    });
    context.fillRect(
      width * 0.42,
      height * 0.52,
      width * 0.16,
      Math.max(2, width * 0.006),
    );
    context.font = `500 ${width * 0.05}px ${FONT_FAMILY}`;
    context.fillText(book.author, width / 2, height * 0.6);
    return;
  }

  context.globalAlpha = 0.14;
  context.fillRect(0, height * 0.62, width, height * 0.06);
  context.globalAlpha = 1;
  context.textAlign = "left";
  lines.forEach((line, index) => {
    context.fillText(line, margin, height * 0.22 + index * titleSize * 1.2);
  });
  context.font = `500 ${width * 0.048}px ${FONT_FAMILY}`;
  context.fillText(book.author, margin, height * 0.86);
};

const renderArtwork = (
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D, palette: ArtworkPalette) => void,
  palette: ArtworkPalette,
  isColor: boolean,
) => {
  const { canvas, context } = createCanvas(width, height);
  draw(context, palette);
  return toTexture(canvas, isColor);
};

/** 책등 텍스처와 (양장본이면) 박 영역 metalness 텍스처를 만든다. */
export const createSpineArtwork = (
  book: BookItem,
  dimensions: BookDimensions,
) => {
  const width = dimensions.thickness * 1.15 * PX_PER_CM;
  const height = dimensions.height * PX_PER_CM;
  const draw = (context: CanvasRenderingContext2D, palette: ArtworkPalette) =>
    drawSpine(context, book, width, height, palette);

  return {
    map: renderArtwork(width, height, draw, COLOR_PALETTE(book), true),
    metalnessMap:
      book.binding === "hardcover"
        ? renderArtwork(width, height, draw, FOIL_MASK_PALETTE, false)
        : undefined,
  };
};

/** 앞표지 텍스처와 (양장본이면) 박 영역 metalness 텍스처를 만든다. */
export const createCoverArtwork = (
  book: BookItem,
  coverWidth: number,
  coverHeight: number,
) => {
  const width = coverWidth * PX_PER_CM;
  const height = coverHeight * PX_PER_CM;
  const draw = (context: CanvasRenderingContext2D, palette: ArtworkPalette) =>
    drawCover(context, book, width, height, palette);

  return {
    map: renderArtwork(width, height, draw, COLOR_PALETTE(book), true),
    metalnessMap:
      book.binding === "hardcover"
        ? renderArtwork(width, height, draw, FOIL_MASK_PALETTE, false)
        : undefined,
  };
};
