import { once } from "es-toolkit";
import {
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  MathUtils,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  createCanvas,
  toTexture,
} from "#/features/bookshelf/helper/procedural-textures";

const ROWS = 16;
const COLUMNS = 10;
/** 잎자루가 붙는 곳보다 위로 둥글게 올라온 잎 밑동 길이 */
const BLADE_TOP = 0.6;
const BLADE_LENGTH = 5;
const BLADE_HALF_WIDTH = 1.9;
/** 잎 가장자리가 잎맥을 따라 뒤로 접히는 정도 */
const FOLD = 0.22;
/** 잎 끝이 뒤로 말리는 정도 */
const CURL = 0.7;
/** 잎 가장자리가 물결치는 높이 */
const WAVE = 0.05;
const PETIOLE_LENGTH = 1.3;
/** 잎자루는 줄기에서 아래 앞쪽으로 뻗어 잎을 틀 앞면에서 띄운다 */
const PETIOLE_DIRECTION = new Vector3(0, -0.45, 0.9).normalize();
/** 잎자루 끝이 원점에서 잎 앞면 방향으로 나온 거리. 잎을 엎어 놓으면 잎몸이 원점보다 이만큼 아래에 놓인다 */
export const PETIOLE_REACH = PETIOLE_DIRECTION.z * PETIOLE_LENGTH;

/**
 * 밑동이 둥글고 끝이 뾰족한 포토스 잎의 반폭.
 * t는 밑동(0)에서 잎 끝(1)까지의 위치이고, 밑동에서 3분의 1쯤 내려온 곳이 가장 넓다.
 */
const getHalfWidth = (t: number) =>
  BLADE_HALF_WIDTH * Math.sin(Math.PI * t ** 0.55) ** 0.8;

/** 잎자루가 붙는 점을 원점으로, 잎 끝이 -y를 향하고 앞면이 +z를 보는 잎몸. */
const createBladeGeometry = () => {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= ROWS; row++) {
    const t = row / ROWS;
    const y = BLADE_TOP - t * (BLADE_TOP + BLADE_LENGTH);
    const halfWidth = getHalfWidth(t);
    for (let column = 0; column <= COLUMNS; column++) {
      const u = (column / COLUMNS) * 2 - 1;
      const across = Math.abs(u);
      const z =
        -(across ** 1.5) * halfWidth * FOLD -
        t * t * CURL +
        Math.sin(t * 14 + u * 2) * WAVE * across;
      positions.push(u * halfWidth, y, z);
      uvs.push((u + 1) / 2, 1 - t);
    }
  }

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const a = row * (COLUMNS + 1) + column;
      const b = a + 1;
      const c = a + COLUMNS + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const createPetioleGeometry = () => {
  const geometry = new CylinderGeometry(0.06, 0.08, PETIOLE_LENGTH, 5);
  geometry.translate(0, PETIOLE_LENGTH / 2, 0);
  geometry.applyQuaternion(
    new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      PETIOLE_DIRECTION,
    ),
  );
  // 잎자루 전체가 텍스처의 잎맥 밑동 색을 쓰게 한다
  const uv = geometry.attributes.uv;
  for (let index = 0; index < uv.count; index++) uv.setXY(index, 0.5, 0.97);
  return geometry;
};

/**
 * 원점에서 줄기에 붙는 잎자루와 그 끝에 달린 잎몸.
 * 잎몸은 잎맥을 따라 접히고 끝이 말리며 가장자리가 살짝 물결친다.
 */
export const createLeafGeometry = () => {
  const blade = createBladeGeometry();
  const petiole = createPetioleGeometry();
  const attachment = PETIOLE_DIRECTION.clone().multiplyScalar(PETIOLE_LENGTH);
  blade.translate(attachment.x, attachment.y, attachment.z);
  const geometry = mergeGeometries([blade, petiole]);
  blade.dispose();
  petiole.dispose();
  return geometry;
};

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 512;
const VEINS_PER_SIDE = 7;

/**
 * 잎 텍스처 공간(가로는 잎 폭, 세로는 밑동에서 끝까지)에 가운데 잎맥과 끝을 향해 휘는 곁맥을 그린다.
 */
const paintVeins = (context: CanvasRenderingContext2D, lineWidth: number) => {
  const centerX = TEXTURE_WIDTH / 2;
  context.lineCap = "round";
  context.lineWidth = lineWidth * 2;
  context.beginPath();
  context.moveTo(centerX, TEXTURE_HEIGHT * 0.02);
  context.lineTo(centerX, TEXTURE_HEIGHT * 0.97);
  context.stroke();

  context.lineWidth = lineWidth;
  for (let index = 0; index < VEINS_PER_SIDE; index++) {
    const startY = TEXTURE_HEIGHT * (0.08 + index * 0.11);
    for (const side of [-1, 1]) {
      const edgeX = centerX + side * TEXTURE_WIDTH * 0.46;
      context.beginPath();
      context.moveTo(centerX, startY);
      context.quadraticCurveTo(
        centerX + side * TEXTURE_WIDTH * 0.3,
        startY + TEXTURE_HEIGHT * 0.04,
        edgeX,
        startY + TEXTURE_HEIGHT * 0.17,
      );
      context.stroke();
    }
  }
};

/** 골든 포토스처럼 곁맥 방향을 따라 흐르는 연노랑 줄무늬. */
const paintVariegation = (context: CanvasRenderingContext2D) => {
  MathUtils.seededRandom(5);
  context.lineCap = "round";
  for (let index = 0; index < 14; index++) {
    const side = index % 2 === 0 ? -1 : 1;
    const startX = TEXTURE_WIDTH / 2 + side * MathUtils.seededRandom() * 20;
    const startY = TEXTURE_HEIGHT * (0.05 + MathUtils.seededRandom() * 0.75);
    context.strokeStyle = `rgba(232, 222, 140, ${0.15 + MathUtils.seededRandom() * 0.25})`;
    context.lineWidth = 2 + MathUtils.seededRandom() * 6;
    context.beginPath();
    context.moveTo(startX, startY);
    context.quadraticCurveTo(
      startX + side * TEXTURE_WIDTH * 0.25,
      startY + TEXTURE_HEIGHT * 0.05,
      startX + side * TEXTURE_WIDTH * (0.2 + MathUtils.seededRandom() * 0.25),
      startY + TEXTURE_HEIGHT * (0.1 + MathUtils.seededRandom() * 0.1),
    );
    context.stroke();
  }
};

/**
 * 포토스 잎의 색 텍스처와 범프 텍스처.
 * 색은 짙은 초록에 밝은 잎맥과 노란 무늬를 얹고, 범프는 잎맥이 살짝 파여 보이게 한다.
 */
export const getLeafTextures = once(() => {
  const color = createCanvas(TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const gradient = color.context.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT);
  gradient.addColorStop(0, "#3a7126");
  gradient.addColorStop(1, "#4f8c31");
  color.context.fillStyle = gradient;
  color.context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  paintVariegation(color.context);
  color.context.strokeStyle = "rgba(160, 200, 110, 0.7)";
  paintVeins(color.context, 2);

  const bump = createCanvas(TEXTURE_WIDTH, TEXTURE_HEIGHT);
  bump.context.fillStyle = "#808080";
  bump.context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  bump.context.strokeStyle = "rgba(40, 40, 40, 0.35)";
  paintVeins(bump.context, 6);
  bump.context.strokeStyle = "#404040";
  paintVeins(bump.context, 2);

  return {
    map: toTexture(color.canvas, true),
    bumpMap: toTexture(bump.canvas, false),
  };
});
