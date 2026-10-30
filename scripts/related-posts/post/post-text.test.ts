import { describe, expect, it } from "vitest";
import { chunkPost } from "./post-text.ts";

describe("chunkPost", () => {
  it("splits by heading and prefixes title and heading", () => {
    const chunks = chunkPost("제목", "도입부\n\n## 사용법\n\n본문 내용");

    expect(chunks).toEqual(["제목\n도입부", "제목 / 사용법\n본문 내용"]);
  });

  it("drops code blocks and images, keeps link text", () => {
    const [chunk] = chunkPost(
      "제목",
      "![이미지](a.png)\n\n[링크](https://a.com) 설명\n\n```ts\nconst a = 1;\n```",
    );

    expect(chunk).toBe("제목\n링크 설명");
  });

  it("splits long sections within max length", () => {
    const chunks = chunkPost(
      "T",
      `${"가".repeat(30)}\n\n${"나".repeat(30)}`,
      40,
    );

    expect(chunks).toEqual([`T\n${"가".repeat(30)}`, `T\n${"나".repeat(30)}`]);
  });
});
