import { describe, expect, it } from "vitest";
import { cosineSimilarity, normalize, weightedSum } from "./vector.ts";

describe("vector", () => {
  it("returns cosine similarity of normalized vectors", () => {
    expect(cosineSimilarity(normalize([1, 0]), normalize([1, 0]))).toBeCloseTo(
      1,
    );
    expect(cosineSimilarity(normalize([1, 0]), normalize([0, 1]))).toBeCloseTo(
      0,
    );
  });

  it("sums vectors by weight", () => {
    expect(
      weightedSum([
        { vector: [1, 0], weight: 3 },
        { vector: [0, 1], weight: 1 },
      ]),
    ).toEqual([3, 1]);
  });
});
