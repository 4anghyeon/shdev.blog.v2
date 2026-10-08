# 참고 링크 카드 컴포넌트 계획

## 결론

**빌드 시점에 rehype 플러그인으로 `**참고**` 섹션을 `references` 데이터로 추출하고, 본문 markup에서는 제거한 뒤 라우트에서 전용 컴포넌트로 렌더링한다.**

`renderMarkdown`이 이미 `headings`를 같은 방식으로 수집해 TOC에 넘기고 있으므로, 그 패턴을 그대로 따른다.

## 현재 상황

- 전체 47개 글 중 **19개**에 `**참고**` 섹션이 있다.
- 구조는 모두 동일하다: `---` → `**참고**` → `- [제목](url)` 목록
- `참고 자료`, `## 참고`, `References` 등 다른 표기는 없다. `**참고**` 하나만 감지하면 된다.
- 빈 줄 유무와 관계없이 AST(마크다운 파싱 트리)에서는 `<p><strong>참고</strong></p>` + `<ul>`로 동일하게 나온다.

### 처리해야 할 엣지 케이스

| 케이스 | 예시 |
|---|---|
| 제목이 URL 그대로인 항목 (9개 글) | `[https://vercel.com/docs/functions](https://vercel.com/docs/functions)` |
| 링크가 없는 항목 | `typescript-typeof.mdx`의 `- 우아한 타입스크립트` (책) |
| 목록 앞 공백 | `reduce-badge-overuse.mdx`의 `-  [https://...` |
| 콘텐츠 자체 문제 | `aesthetic-usability-effect.mdx`의 `Bad title - Wikipedia` → 글에서 직접 수정 |

## 구현 단계

### 1단계: 추출 플러그인 — `src/features/markdown/utils/render-markdown.ts`

blockquote의 `data-cite` 처리처럼 inline 플러그인을 추가한다. 위치는 `rehypeRaw` 뒤, headings 수집 앞.

```ts
export type MarkdownReference = {
  title: string;
  url?: string; // 링크 없는 항목(책 등) 대응
  hostname?: string;
};

export type MarkdownResult = {
  markup: string;
  headings: Array<MarkdownHeading>;
  references: Array<MarkdownReference>;
};
```

```ts
// <p><strong>참고</strong></p> 다음의 <ul>을 references로 추출하고 트리에서 제거
.use(() => (tree: Root) => {
  const children = tree.children;
  const labelIndex = children.findIndex(
    (n) =>
      n.type === "element" &&
      n.tagName === "p" &&
      hastToString(n).trim() === "참고",
  );
  if (labelIndex === -1) return;

  const listIndex = children.findIndex(
    (n, i) => i > labelIndex && n.type === "element" && n.tagName === "ul",
  );
  // 각 li → 첫 <a>의 href / text, 없으면 li 텍스트만
  // 바로 앞의 <hr>도 함께 제거 (컴포넌트가 자체 구분선을 가짐)
  ...
})
```

- 제목이 URL과 같으면 `hostname + pathname`으로 다듬는다. 예: `vercel.com/docs/functions`
- 참고 섹션이 없으면 빈 배열을 반환한다.

### 2단계: 컬렉션 연결 — `content-collections.ts`

```ts
const { markup, headings, references } = await renderMarkdown(frontMatter.body);

return {
  ...post,
  markup,
  headings,
  references,
  // ...
};
```

### 3단계: 컴포넌트 — `src/features/post-detail/components/References.tsx`

- `PostEndSeal`과 같은 post-detail feature에 둔다.
- 블로그의 기존 톤(`hanji`, `bg-paper`, `border-line-subtle`, `text-ink-muted`, hover 시 `text-seal`)을 따른다.
- 카드 한 줄 구성: **hostname 칩** + **제목** + `ArrowUpRight` 아이콘
- 링크 없는 항목은 클릭되지 않는 카드로 표시하고 책 아이콘을 붙인다.
- 검색 인덱스에서 빠지도록 `data-pagefind-ignore="all"`을 넣는다.
- 상단에 `BrushDivider`를 두어 기존 `---` 역할을 대신한다.

### 4단계: 라우트 배치 — `src/routes/$lang/post/$slug.tsx`

```tsx
<Markdown markup={markup} slug={slug} className="prose" />
{post.references.length > 0 && <References items={post.references} />}
<PostEndSeal key={slug} />
```

### 5단계: 검증

- **단위 테스트**: `src/features/markdown/utils/render-markdown.test.ts` (vitest)
  - `**참고**`와 목록 사이 빈 줄 있음 / 없음
  - 제목이 URL과 같은 항목
  - 링크 없는 항목
  - 앞쪽 `<hr>` 제거
  - 참고 섹션이 없는 글 → `references: []`, markup 변화 없음
- **화면 확인** (dev 서버 30005, 라이트/다크 모드)
  - `javascript-interpreter-vs-compiler` — 항목 8개
  - `typescript-typeof` — 링크 없는 항목
  - `vercel-server-action-issue` — URL 제목
  - `git-cherry-pick` — 참고 섹션 없음

## 방식 비교

| 방식 | 장점 | 단점 |
|---|---|---|
| **데이터 추출 + 라우트에서 렌더 (채택)** | `headings` 패턴과 같음, 타입 있는 데이터, 배치 자유 | 파일 3~4개 수정 |
| `Markdown.tsx`의 `replace`에서 `<ul>` 감지 | 수정 범위가 작음 | 형제 노드(`<p>참고</p>`)를 봐야 해서 parser 콜백 안에서 다루기 번거로움 |
| MDX에 `<References>` 태그 직접 작성 | 파싱 불필요 | 19개 글 수정, 작성 방식 변경 |

## 미정 사항

1. **파비콘 표시 여부**: Google s2 같은 외부 파비콘 서비스는 보기엔 좋지만 외부 요청이 생긴다. 기본안은 hostname 텍스트 칩만 쓰는 것.
2. **앞쪽 `---` 처리**: 제거하고 컴포넌트에 `BrushDivider`를 두는 쪽을 추천.
3. **OG 이미지/설명 미리보기 카드**: 빌드 시 네트워크 요청이 필요하고 결과가 불안정해서 제외.
