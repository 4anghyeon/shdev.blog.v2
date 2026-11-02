import { delay } from "es-toolkit";
import { z } from "zod";
import { EMBEDDING } from "../config.ts";
import type { Vector } from "../utils/vector.ts";

const embeddingResponseSchema = z.object({
  data: z.array(
    z.object({ index: z.number(), embedding: z.array(z.number()) }),
  ),
});

let lastRequestAt = 0;

// 요청 간격과 재시도를 지키면서 NVIDIA 임베딩 API를 호출한다.
export const requestEmbeddings = async (
  apiKey: string,
  inputs: Array<string>,
): Promise<Array<Vector>> => {
  for (let attempt = 0; ; attempt++) {
    const wait = lastRequestAt + EMBEDDING.requestIntervalMs - Date.now();
    if (wait > 0) await delay(wait);
    lastRequestAt = Date.now();

    const response = await fetch(EMBEDDING.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: EMBEDDING.model,
        input: inputs,
        input_type: "passage",
        encoding_format: "float",
        truncate: "END",
      }),
    });

    if (response.ok) {
      const json = embeddingResponseSchema.parse(await response.json());
      return json.data
        .sort((a, b) => a.index - b.index)
        .map((item) => item.embedding);
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= EMBEDDING.maxRetries) {
      throw new Error(
        `임베딩 요청 실패 (${response.status}): ${await response.text()}`,
      );
    }

    const backoff = 2 ** attempt * 5_000;
    console.warn(`  ${response.status} 응답, ${backoff / 1000}초 후 재시도`);
    await delay(backoff);
  }
};
