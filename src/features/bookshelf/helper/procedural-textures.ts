import { once, range } from "es-toolkit";
import {
  CanvasTexture,
  MathUtils,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas context is not available");
  return { canvas, context };
};

const toTexture = (canvas: HTMLCanvasElement, isColor: boolean) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = isColor ? SRGBColorSpace : NoColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
};

/** 높이맵을 탄젠트 공간 노멀맵 텍스처로 변환한다. */
const heightToNormalTexture = (
  heights: Float32Array,
  size: number,
  strength: number,
) => {
  const { canvas, context } = createCanvas(size, size);
  const image = context.createImageData(size, size);
  const at = (x: number, y: number) =>
    heights[((y + size) % size) * size + ((x + size) % size)];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 캔버스 y축은 텍스처 v축과 방향이 반대라 y 기울기의 부호를 뒤집는다
      const nx = -(at(x + 1, y) - at(x - 1, y)) * strength;
      const ny = (at(x, y + 1) - at(x, y - 1)) * strength;
      const length = Math.hypot(nx, ny, 1);
      const offset = (y * size + x) * 4;
      image.data[offset] = (nx / length) * 127.5 + 127.5;
      image.data[offset + 1] = (ny / length) * 127.5 + 127.5;
      image.data[offset + 2] = (1 / length) * 127.5 + 127.5;
      image.data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return toTexture(canvas, false);
};

/** 씨실과 날실이 교차하는 북클로스 직조 노멀맵. */
export const getClothNormalTexture = once(() => {
  const size = 128;
  const threads = 16;
  const cell = size / threads;
  const heights = new Float32Array(size * size);
  MathUtils.seededRandom(7);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      const isWarpOnTop = (cx + cy) % 2 === 0;
      const across = isWarpOnTop ? (x % cell) / cell : (y % cell) / cell;
      const along = isWarpOnTop ? (y % cell) / cell : (x % cell) / cell;
      const profile = Math.sin(across * Math.PI);
      const crimp = 0.75 + 0.25 * Math.sin(along * Math.PI);
      const fuzz = MathUtils.seededRandom() * 0.18;
      heights[y * size + x] = profile * crimp + fuzz;
    }
  }

  return heightToNormalTexture(heights, size, 2.2);
});

/** 종이 단면에 보이는 촘촘한 낱장 줄무늬. 색상과 범프에 같이 쓴다. */
export const getPaperEdgeTexture = once(() => {
  const { canvas, context } = createCanvas(512, 8);
  MathUtils.seededRandom(3);

  for (let x = 0; x < canvas.width; x++) {
    const shade = 228 + MathUtils.seededRandom() * 22 - (x % 3 === 0 ? 14 : 0);
    context.fillStyle = `rgb(${shade}, ${shade - 6}, ${shade - 20})`;
    context.fillRect(x, 0, 1, canvas.height);
  }

  return toTexture(canvas, true);
});

/** 나뭇결 텍스처 한 장이 덮는 실제 크기(cm) */
export const WOOD_TILE_SIZE = 60;

/** 가로로 결이 흐르는 밝은 오크 무늬. 상하좌우가 이어지게 그려서 반복해 붙여도 이음매가 보이지 않는다. */
export const getWoodTexture = once(() => {
  const size = 512;
  const rings = 26;
  const { canvas, context } = createCanvas(size, size);
  const image = context.createImageData(size, size);
  MathUtils.seededRandom(11);
  const rowShade = range(size).map(() => MathUtils.seededRandom() * 0.035);
  const phases = range(4).map(() => MathUtils.seededRandom() * Math.PI * 2);

  for (let y = 0; y < size; y++) {
    const v = (y / size) * Math.PI * 2;
    // 나이테 간격이 고르면 줄무늬처럼 보여서 세로 위치에 따라 촘촘함을 바꾼다
    const spacing = Math.sin(v * 2 + phases[3]) * 6;
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2;
      // 정수 주기의 사인만 더해야 가로로 반복해도 결이 끊기지 않는다
      const wobble =
        Math.sin(u + phases[0]) * 3.5 +
        Math.sin(u * 3 + phases[1]) * 1.2 +
        Math.sin(u * 7 + phases[2]) * 0.5;
      const ring = (((((y + wobble + spacing) / size) * rings) % 1) + 1) % 1;
      const late = Math.max(0, 1 - Math.abs(ring - 0.5) * 5) * 0.09;
      const fiber = MathUtils.seededRandom() * 0.035;
      const shade = 1 - late - rowShade[y] - fiber;
      const offset = (y * size + x) * 4;
      image.data[offset] = 210 * shade;
      image.data[offset + 1] = 184 * shade;
      image.data[offset + 2] = 150 * shade;
      image.data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return toTexture(canvas, true);
});

/** 같은 이미지를 공유하면서 반복 횟수와 회전만 다른 텍스처를 만든다. */
export const cloneTexture = (
  texture: Texture,
  repeatX: number,
  repeatY: number,
  rotation = 0,
) => {
  const cloned = texture.clone();
  cloned.repeat.set(repeatX, repeatY);
  cloned.rotation = rotation;
  cloned.center.set(0.5, 0.5);
  cloned.needsUpdate = true;
  return cloned;
};

export { createCanvas, toTexture };
