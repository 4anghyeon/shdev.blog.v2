import { describe, expect, it } from "vitest";
import { xmlHelper } from "./xml";

describe("xmlHelper.escape", () => {
  it("escapes XML special characters", () => {
    expect(xmlHelper.escape(`Tom & "Jerry" <'cat'>`)).toBe(
      "Tom &amp; &quot;Jerry&quot; &lt;&apos;cat&apos;&gt;",
    );
  });

  it("keeps text without special characters", () => {
    expect(xmlHelper.escape("나를 게으르게 만드는 AI")).toBe(
      "나를 게으르게 만드는 AI",
    );
  });
});
