import { sumBy } from "es-toolkit";

export type Vector = Array<number>;

export const normalize = (vector: Vector): Vector => {
  const length = Math.hypot(...vector);
  return length === 0 ? vector : vector.map((value) => value / length);
};

// 두 벡터가 정규화되어 있다고 가정하고 내적으로 코사인 유사도를 구한다.
export const cosineSimilarity = (a: Vector, b: Vector): number => {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
};

export const weightedSum = (
  items: Array<{ vector: Vector; weight: number }>,
): Vector => {
  if (items.length === 0) return [];
  return items[0].vector.map((_, i) =>
    sumBy(items, ({ vector, weight }) => vector[i] * weight),
  );
};

export const meanVector = (vectors: Array<Vector>): Vector => {
  return weightedSum(
    vectors.map((vector) => ({ vector, weight: 1 / vectors.length })),
  );
};

export const subtract = (a: Vector, b: Vector): Vector => {
  return a.map((value, i) => value - b[i]);
};

export const roundVector = (vector: Vector, precision: number): Vector => {
  return vector.map((value) => Number(value.toFixed(precision)));
};
