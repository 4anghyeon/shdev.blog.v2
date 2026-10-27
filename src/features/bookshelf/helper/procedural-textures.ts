import { clamp, once } from "es-toolkit";
import {
  CanvasTexture,
  MathUtils,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas context is not available");
  return { canvas, context };
};

const perlin = new ImprovedNoise();

/** 0~1 범위의 Perlin 노이즈를 여러 옥타브 합친다. seed는 3D 노이즈의 z 단면으로 쓴다. */
const fbm = (x: number, y: number, seed: number, octaves = 4) => {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    const noise = perlin.noise(x * frequency, y * frequency, seed + i * 1.618);
    value += (noise * 0.5 + 0.5) * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
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

/** 오크 계열의 나뭇결 텍스처. */
export const getWoodTexture = once(() => {
  const width = 1024;
  const height = 256;
  const { canvas, context } = createCanvas(width, height);
  const image = context.createImageData(width, height);
  const light = [196, 154, 108];
  const dark = [138, 95, 58];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const warp = fbm(x / 220, y / 60, 11) * 7;
      const ring = Math.sin((y / height) * 26 * Math.PI + warp * Math.PI);
      const grain = Math.abs(ring) ** 0.35;
      const pores = fbm(x / 3, y / 40, 23, 2) * 0.35;
      const t = clamp(grain * 0.75 + pores, 0, 1);
      const offset = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        image.data[offset + channel] =
          dark[channel] + (light[channel] - dark[channel]) * t;
      }
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
