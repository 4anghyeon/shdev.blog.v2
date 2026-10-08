import type { Element, Root, RootContent } from "hast";
import { toString as hastToString } from "hast-util-to-string";
import type { Plugin } from "unified";
import { EXIT, visit } from "unist-util-visit";

export type MarkdownReference = {
  title: string;
  url?: string;
  hostname?: string;
};

type RehypeReferencesOptions = {
  references: Array<MarkdownReference>;
};

const REFERENCE_LABEL = "참고";

// hast 노드가 element인지 확인하는 타입 가드
const isElement = (node: RootContent | undefined): node is Element =>
  node?.type === "element";

// 요소 사이의 줄바꿈 같은 공백 텍스트 노드인지 확인한다
const isBlankText = (node: RootContent) =>
  node.type === "text" && /^\s*$/.test(node.value);

// 본문의 **참고** 라벨 문단인지 판별한다
const isReferenceLabel = (node: RootContent) => {
  if (!isElement(node) || node.tagName !== "p") return false;

  const children = node.children.filter((n) => !isBlankText(n));
  return (
    children.length === 1 &&
    isElement(children[0]) &&
    children[0].tagName === "strong" &&
    hastToString(node).trim() === REFERENCE_LABEL
  );
};

// URL에서 www.를 뗀 hostname을 꺼낸다
const toHostname = (url: URL) => url.hostname.replace(/^www\./, "");

// 제목이 URL 그대로면 hostname + 경로로 줄여 보여준다
const formatUrlTitle = (url: URL) => {
  const path = `${url.pathname}${url.hash}`.replace(/\/$/, "");
  try {
    return `${toHostname(url)}${decodeURI(path)}`;
  } catch {
    return `${toHostname(url)}${path}`;
  }
};

// <li> 하나를 참고 항목으로 변환한다. 링크가 없으면 텍스트만 제목으로 쓴다
const toReference = (li: Element): MarkdownReference => {
  let anchor: Element | undefined;
  visit(li, "element", (node: Element) => {
    if (node.tagName !== "a") return;
    anchor = node;
    return EXIT;
  });

  const href = anchor ? String(anchor.properties.href ?? "") : "";
  if (!anchor || !href) return { title: hastToString(li).trim() };

  const title = hastToString(anchor).trim();
  try {
    const url = new URL(href);
    return {
      title: !title || title === href ? formatUrlTitle(url) : title,
      url: href,
      hostname: toHostname(url),
    };
  } catch {
    return { title: title || href, url: href };
  }
};

// **참고** 라벨 다음의 목록을 references로 추출하고 본문에서 제거한다
export const rehypeReferences: Plugin<[RehypeReferencesOptions], Root> =
  ({ references }) =>
  (tree) => {
    const children = tree.children;
    const labelIndex = children.findIndex(isReferenceLabel);
    if (labelIndex === -1) return;

    const listIndex = children.findIndex(
      (n, i) => i > labelIndex && !isBlankText(n),
    );
    const list = children[listIndex];
    if (!isElement(list) || list.tagName !== "ul") return;

    for (const li of list.children) {
      if (isElement(li) && li.tagName === "li") {
        references.push(toReference(li));
      }
    }

    // 라벨 바로 앞의 구분선(---)도 함께 제거한다
    let startIndex = labelIndex;
    for (let i = labelIndex - 1; i >= 0; i--) {
      const node = children[i];
      if (isBlankText(node)) continue;
      if (isElement(node) && node.tagName === "hr") startIndex = i;
      break;
    }

    children.splice(startIndex, listIndex - startIndex + 1);
  };
