export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
}

const MAX_HTML_BYTES = 256 * 1024;
const REQUEST_TIMEOUT_MS = 4_000;
const MAX_CONCURRENT_REQUESTS = 5;
const cache = new Map<string, Promise<OpenGraphData | undefined>>();
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

// HTML 엔티티를 실제 문자로 변환한다.
const decodeEntities = (value: string): string => {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
};

// 메타데이터 문자열의 태그와 불필요한 공백을 정리한다.
const clean = (value: string | undefined): string | undefined => {
  const result = value
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return result || undefined;
};

// HTML 문서에서 제목, 설명, 이미지를 추출한다.
export const parseOpenGraph = (
  html: string,
  pageUrl: string,
): OpenGraphData | undefined => {
  const head =
    html
      .slice(0, MAX_HTML_BYTES)
      .match(/<head\b[^>]*>([\s\S]*?)(?:<\/head\s*>|$)/i)?.[1] ??
    html.slice(0, MAX_HTML_BYTES);
  const meta = new Map<string, string>();

  for (const tag of head.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = new Map<string, string>();
    for (const attr of tag[0].matchAll(
      /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g,
    )) {
      attrs.set(
        attr[1].toLowerCase(),
        decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? ""),
      );
    }
    const key =
      attrs.get("property")?.toLowerCase() ?? attrs.get("name")?.toLowerCase();
    const content = attrs.get("content");
    if (key && content) meta.set(key, content);
  }

  const titleTag = head.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1];
  const title = clean(meta.get("og:title") ?? titleTag);
  const description = clean(
    meta.get("og:description") ?? meta.get("description"),
  );
  const rawImage =
    meta.get("og:image") ??
    meta.get("og:image:url") ??
    meta.get("twitter:image");
  let image: string | undefined;
  if (rawImage) {
    try {
      const parsed = new URL(rawImage, pageUrl);
      if (parsed.protocol === "https:" || parsed.protocol === "http:")
        image = parsed.href;
    } catch {
      // Invalid image URLs are omitted from the preview.
    }
  }

  if (!title && !description && !image) return undefined;
  return {
    title: title ?? "",
    description: description ?? "",
    image: image ?? "",
  };
};

// 동시 외부 요청 수를 제한하고 빈 슬롯을 기다린다.
const acquireSlot = async (): Promise<void> => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    await new Promise<void>((resolve) => requestQueue.push(resolve));
  }
  activeRequests++;
};

// 사용한 요청 슬롯을 반환하고 대기 중인 요청을 깨운다.
const releaseSlot = (): void => {
  activeRequests--;
  requestQueue.shift()?.();
};

// 응답 HTML을 지정된 최대 크기까지만 읽는다.
const readLimitedHtml = async (response: Response): Promise<string> => {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = "";
  let bytes = 0;
  while (bytes < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    const remaining = MAX_HTML_BYTES - bytes;
    const chunk = value.subarray(0, remaining);
    html += decoder.decode(chunk, { stream: true });
    bytes += chunk.byteLength;
    if (chunk.byteLength < value.byteLength) {
      await reader.cancel();
      break;
    }
  }
  html += decoder.decode();
  return html;
};

// URL의 HTML 메타데이터를 제한 시간 안에 가져온다.
const requestOpenGraph = async (
  url: string,
): Promise<OpenGraphData | undefined> => {
  const parsed = new URL(url);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    return undefined;

  await acquireSlot();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(parsed.href, {
        headers: { accept: "text/html,application/xhtml+xml" },
        redirect: "follow",
        signal: controller.signal,
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("text/html")
      )
        return undefined;
      return parseOpenGraph(
        await readLimitedHtml(response),
        response.url || parsed.href,
      );
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return undefined;
  } finally {
    releaseSlot();
  }
};

// 같은 URL의 메타데이터 요청을 캐시해 중복 호출을 막는다.
export const fetchOpenGraph = (
  url: string,
): Promise<OpenGraphData | undefined> => {
  let request = cache.get(url);
  if (!request) {
    request = requestOpenGraph(url);
    cache.set(url, request);
  }
  return request;
};
