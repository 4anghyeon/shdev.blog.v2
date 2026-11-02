import { describe, expect, it } from "vitest";
import { combineVectors } from "./embed-post.ts";

describe("combineVectors", () => {
  it("combines meta and length-weighted chunk vectors", () => {
    const vector = combineVectors(
      [0, 1],
      [
        { vector: [1, 0], weight: 3 },
        { vector: [0, 1], weight: 1 },
      ],
    );

    expect(Math.hypot(...vector)).toBeCloseTo(1);
    expect(vector[0]).toBeGreaterThan(vector[1]);
  });
});
