export type BookBinding = "hardcover" | "paperback";

export interface BookLink {
  label: string;
  href: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  binding: BookBinding;
  /** 표지 바탕색 */
  color: string;
  /** 표지 글자색 */
  ink: string;
  /** 실측 크기 (cm). 두께를 모르면 쪽수로 추정한다 */
  size: { height: number; width: number; thickness?: number };
  pages: number;
  summary: string;
  /** 앞표지 이미지 경로. 없으면 color와 ink로 표지를 그린다 */
  cover?: string;
  /** 책등 이미지 경로 (위가 이미지 위쪽이 되도록 세운 세로 이미지). 없으면 color와 ink로 책등을 그린다 */
  spine?: string;
  postUrl?: string;
  links?: BookLink[];
}

export const BOOK_ITEMS: readonly BookItem[] = [
  {
    id: "do-it-java",
    title: "Do it! 자바 완전 정복",
    author: "김동형",
    binding: "paperback",
    color: "#f4f3ef",
    ink: "#1a1a1a",
    size: { height: 25.6, width: 18.8, thickness: 3.9 },
    pages: 856,
    summary:
      "자바 프로그램이 동작하는 과정을 도해로 하나하나 보여 주며 기초 문법부터 객체지향까지 다루는 자바 입문서.",
    cover: "/images/books/do-it-java/cover.webp",
    spine: "/images/books/do-it-java/spine.webp",
  },
  {
    id: "head-first-design-patterns",
    title: "헤드 퍼스트 디자인 패턴",
    author: "에릭 프리먼, 엘리자베스 롭슨, 케이시 시에라, 버트 베이츠",
    binding: "paperback",
    color: "#f4f3ef",
    ink: "#1a1a1a",
    size: { height: 24.5, width: 20.4, thickness: 3.2 },
    pages: 656,
    summary:
      "14가지 GoF 디자인 패턴을 그림과 대화 형식으로 풀어, 유지보수하기 좋은 객체지향 설계를 익히게 하는 입문서.",
    cover: "/images/books/head-first-design-patterns/cover.webp",
    spine: "/images/books/head-first-design-patterns/spine.webp",
  },
  {
    id: "clean-code",
    title: "Clean Code 클린 코드",
    author: "로버트 C. 마틴",
    binding: "paperback",
    color: "#f4f3ef",
    ink: "#1a1a1a",
    size: { height: 25.4, width: 18.8, thickness: 3.5 },
    pages: 584,
    summary:
      "읽기 좋은 코드를 위한 이름 짓기, 함수, 주석, 오류 처리 등의 원칙을 사례 중심으로 다룬 애자일 소프트웨어 장인 정신의 고전.",
    cover: "/images/books/clean-code/cover.webp",
    spine: "/images/books/clean-code/spine.webp",
  },
  {
    id: "multiparadigm-programming",
    title: "멀티패러다임 프로그래밍",
    author: "유인동",
    binding: "paperback",
    color: "#2e2a6b",
    ink: "#f2e6c9",
    size: { height: 23.5, width: 18.4, thickness: 2.1 },
    pages: 532,
    summary:
      "객체지향, 함수형, 명령형 패러다임을 하나의 코드베이스 안에서 조합하는 방법을 이터레이터 프로토콜 중심으로 풀어낸 책.",
    cover: "/images/books/multiparadigm-programming/cover.webp",
    spine: "/images/books/multiparadigm-programming/spine.webp",
    postUrl: "/ko/post/multi-paradigm-extends-modern-languages",
  },
  {
    id: "modern-javascript-deep-dive",
    title: "모던 자바스크립트 Deep Dive",
    author: "이웅모",
    binding: "paperback",
    color: "#f4f3ef",
    ink: "#1a1a1a",
    size: { height: 24, width: 18.8, thickness: 3.9 },
    pages: 956,
    summary:
      "자바스크립트의 기본 개념부터 실행 컨텍스트, 클로저, 비동기 처리까지 동작 원리를 깊이 있게 설명하는 책.",
    cover: "/images/books/modern-javascript-deep-dive/cover.webp",
    spine: "/images/books/modern-javascript-deep-dive/spine.webp",
  },
  {
    id: "modern-react-deep-dive",
    title: "모던 리액트 Deep Dive",
    author: "김용찬",
    binding: "paperback",
    color: "#f4f3ef",
    ink: "#1a1a1a",
    size: { height: 24, width: 18.8, thickness: 4.6 },
    pages: 952,
    summary:
      "리액트의 핵심 개념과 동작 원리부터 서버 사이드 렌더링, Next.js까지 리액트 생태계 전반을 다루는 책.",
    cover: "/images/books/modern-react-deep-dive/cover.webp",
    spine: "/images/books/modern-react-deep-dive/spine.webp",
  },
  {
    id: "woowa-typescript-with-react",
    title: "우아한 타입스크립트 with 리액트",
    author: "우아한형제들 웹프론트개발그룹",
    binding: "paperback",
    color: "#1e1c1c",
    ink: "#f5f5f5",
    size: { height: 23.5, width: 18.3, thickness: 1.5 },
    pages: 380,
    summary:
      "배달의민족 개발 사례를 바탕으로 타입스크립트와 리액트를 실무에서 함께 쓰는 방법을 정리한 프론트엔드 온보딩 가이드.",
    cover: "/images/books/woowa-typescript-with-react/cover.webp",
    spine: "/images/books/woowa-typescript-with-react/spine.webp",
  },
  {
    id: "you-dont-know-js-yet",
    title: "You Don't Know JS Yet",
    author: "카일 심슨",
    binding: "paperback",
    color: "#f5dc1e",
    ink: "#111111",
    size: { height: 23.5, width: 18.3, thickness: 1.8 },
    pages: 348,
    summary:
      "자바스크립트의 모호하고 애매한 개념을 바로잡으며 스코프와 클로저의 동작 원리를 깊이 파고드는 책.",
    cover: "/images/books/you-dont-know-js-yet/cover.webp",
    spine: "/images/books/you-dont-know-js-yet/spine.webp",
  },
  {
    id: "mencius",
    title: "인생에 한 번은 읽어야 할 맹자",
    author: "맹자",
    binding: "paperback",
    color: "#d8c6ab",
    ink: "#2a2a2a",
    size: { height: 22.5, width: 15.2, thickness: 2.2 },
    pages: 404,
    summary:
      "주희의 맹자집주를 완역해, 시대를 넘어 전해지는 맹자의 사상과 삶의 지혜를 담은 책.",
    cover: "/images/books/mencius/cover.webp",
    spine: "/images/books/mencius/spine.webp",
  },
];
