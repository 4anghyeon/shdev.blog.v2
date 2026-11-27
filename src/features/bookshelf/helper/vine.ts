import { clamp, range } from "es-toolkit";
import {
  CatmullRomCurve3,
  Color,
  Euler,
  MathUtils,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import {
  FACE_LIP,
  FRAME_SIDE,
  SHELF_DEPTH,
  type ShelfLayout,
} from "#/features/bookshelf/helper/shelf-layout";

/** 줄기를 따라 잎이 달리는 간격(cm) */
const LEAF_SPACING = 2.8;
/** 잎이 제자리에서 줄기를 따라 앞뒤로 어긋나는 최대 거리 */
const LEAF_JITTER = 0.9;
/** 번갈아 달리지 않고 앞 잎과 같은 쪽으로 나는 확률 */
const SAME_SIDE_CHANCE = 0.25;
/** 머리판 위에 얹혀 있다가 앞으로 넘어오는 구간에는 잎을 달지 않는다 */
const LEAFLESS_START = 6;
/** 늘어진 줄기를 몇 cm마다 굽힐지 */
const STEM_STEP = 5;
/** 줄기가 틀 앞면에서 떨어져 있는 거리 */
const STEM_OFFSET = 0.8;
/** 잎 텍스처에 곱하는 색. 잎마다 초록빛과 노란빛이 조금씩 다르게 돈다 */
const LEAF_TINTS = ["#ffffff", "#e6f0d6", "#f7f0cf"];

/** 머리판 위에서 앞으로 넘어와 늘어지는 덩굴 한 줄기의 모양. */
interface VineSeed {
  key: string;
  /** 줄기가 늘어지는 가로 위치. -1이면 왼쪽 측판, 1이면 오른쪽 측판 */
  side: -1 | 1;
  /** 책장 높이 중 어디까지 내려오는지(비율) */
  drop: number;
  seed: number;
}

const VINE_SEEDS: readonly VineSeed[] = [
  { key: "left", side: -1, drop: 0.68, seed: 21 },
  { key: "right", side: 1, drop: 0.9, seed: 37 },
];

export interface VineSpec {
  key: string;
  curve: CatmullRomCurve3;
  /** 잎 하나하나의 변환 행렬과 색 */
  leaves: { matrix: Matrix4; color: Color }[];
}

const randomBetween = (min: number, max: number) =>
  min + MathUtils.seededRandom() * (max - min);

/**
 * 머리판 위에서 시작해 앞 모서리를 넘어 측판 앞으로 흔들리며 늘어지는 줄기 경로.
 * 측판 쪽에서 책장 안쪽으로 조금씩 흘러들어 책등을 살짝 가린다.
 */
const createStemCurve = (layout: ShelfLayout, { side, drop }: VineSeed) => {
  const x = side * (layout.innerWidth / 2 + FRAME_SIDE / 2);
  const inward = -side;
  const topY = layout.height / 2;
  const frontZ = SHELF_DEPTH / 2 + FACE_LIP;
  const phase = randomBetween(0, Math.PI * 2);
  const steps = Math.max(2, Math.round((layout.height * drop) / STEM_STEP));

  const hanging = range(1, steps + 1).map(
    (step) =>
      new Vector3(
        x +
          Math.sin(step * 0.9 + phase) * 1.2 +
          inward * Math.min(step * 0.25, 2),
        topY - 1 - step * STEM_STEP,
        frontZ + STEM_OFFSET + Math.sin(step * 1.3 + phase) * 0.4,
      ),
  );

  return new CatmullRomCurve3([
    new Vector3(x + inward * 4, topY + 0.4, frontZ - 7),
    new Vector3(x + inward * 2, topY + 0.6, frontZ - 1.5),
    new Vector3(x, topY - 1, frontZ + STEM_OFFSET),
    ...hanging,
  ]);
};

const leafEuler = new Euler();
const leafQuaternion = new Quaternion();
const leafScale = new Vector3();

/**
 * 줄기를 따라 대체로 좌우를 번갈아 잎을 단다.
 * 간격, 방향, 크기를 조금씩 흐트러뜨려 사다리처럼 고르게 보이지 않게 한다.
 * 잎 끝이 아래를 향해 늘어지되 앞으로 살짝 들려서 틀 앞면을 파고들지 않게 한다.
 */
const createLeaves = (curve: CatmullRomCurve3) => {
  const length = curve.getLength();
  const count = Math.floor((length - LEAFLESS_START) / LEAF_SPACING);

  return range(count).map((index) => {
    const distance =
      LEAFLESS_START +
      (index + 0.5) * LEAF_SPACING +
      randomBetween(-LEAF_JITTER, LEAF_JITTER);
    const point = curve.getPointAt(clamp(distance / length, 0, 1));
    const alternate = index % 2 === 0 ? 1 : -1;
    const direction =
      MathUtils.seededRandom() < SAME_SIDE_CHANCE ? -alternate : alternate;
    const sizeGrowth = 0.6 + 0.3 * (distance / length);

    leafEuler.set(
      randomBetween(-0.7, -0.1),
      randomBetween(-0.7, 0.7),
      direction * randomBetween(0.15, 1),
    );
    leafQuaternion.setFromEuler(leafEuler);
    leafScale.setScalar(sizeGrowth * randomBetween(0.8, 1.2));

    const tint =
      LEAF_TINTS[Math.floor(MathUtils.seededRandom() * LEAF_TINTS.length)];
    const color = new Color(tint).offsetHSL(0, 0, randomBetween(-0.08, 0));

    return {
      matrix: new Matrix4().compose(point, leafQuaternion, leafScale),
      color,
    };
  });
};

/** 책장 크기에 맞춰 덩굴 줄기들의 경로와 잎 배치를 만든다. 같은 레이아웃이면 항상 같은 모양이 나온다. */
export const createVineSpecs = (layout: ShelfLayout): VineSpec[] =>
  VINE_SEEDS.map((seed) => {
    MathUtils.seededRandom(seed.seed);
    const curve = createStemCurve(layout, seed);
    return { key: seed.key, curve, leaves: createLeaves(curve) };
  });
