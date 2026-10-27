export type BookBinding = "hardcover" | "paperback";

export interface BookLink {
  label: string;
  href: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  /** YYYY-MM 형식의 완독 시기 */
  readAt: string;
  binding: BookBinding;
  /** 표지 바탕색 */
  color: string;
  /** 표지 글자색 */
  ink: string;
  /** 판형 (cm) */
  size: { height: number; width: number };
  pages: number;
  summary: string;
  postUrl?: string;
  links?: BookLink[];
}

export const BOOK_ITEMS: readonly BookItem[] = [
  {
    id: "multiparadigm-programming",
    title: "멀티패러다임 프로그래밍",
    author: "유인동",
    readAt: "2025-04",
    binding: "paperback",
    color: "#1f2a44",
    ink: "#f2e6c9",
    size: { height: 24, width: 18.3 },
    pages: 532,
    summary:
      "객체지향, 함수형, 명령형 패러다임을 하나의 코드베이스 안에서 조합하는 방법을 이터레이터 프로토콜 중심으로 풀어낸 책.",
    postUrl: "/ko/post/multi-paradigm-extends-modern-languages",
  },
  {
    id: "laws-of-ux",
    title: "UX/UI의 10가지 심리학 법칙",
    author: "존 야블론스키",
    readAt: "2024-11",
    binding: "paperback",
    color: "#e9ddc6",
    ink: "#3a2f28",
    size: { height: 22.5, width: 15.2 },
    pages: 196,
    summary:
      "제이콥의 법칙, 힉의 법칙 등 사용자 경험 설계에 쓰이는 심리학 원칙을 사례와 함께 정리한 책.",
    postUrl: "/ko/post/jakobs-law-ux",
  },
  {
    id: "object",
    title: "오브젝트",
    author: "조영호",
    readAt: "2024-06",
    binding: "hardcover",
    color: "#6b2a2a",
    ink: "#d9b86a",
    size: { height: 24, width: 17.5 },
    pages: 692,
    summary:
      "역할, 책임, 협력을 중심으로 객체지향 설계를 코드 예제와 함께 단계적으로 설명하는 책.",
  },
  {
    id: "refactoring-2nd",
    title: "리팩터링 2판",
    author: "마틴 파울러",
    readAt: "2024-02",
    binding: "hardcover",
    color: "#2f4a3a",
    ink: "#d9b86a",
    size: { height: 24, width: 18.3 },
    pages: 552,
    summary:
      "코드의 동작은 유지하면서 구조를 개선하는 리팩터링 기법들을 자바스크립트 예제로 소개하는 카탈로그.",
  },
  {
    id: "pragmatic-programmer",
    title: "실용주의 프로그래머",
    author: "데이비드 토머스, 앤드류 헌트",
    readAt: "2023-09",
    binding: "paperback",
    color: "#b88a2c",
    ink: "#1f1a14",
    size: { height: 22.5, width: 15.2 },
    pages: 452,
    summary:
      "도구, 설계, 협업, 커리어에 걸쳐 실용적인 개발자로 성장하기 위한 습관과 원칙을 다룬 책.",
  },
  {
    id: "growing-together",
    title: "함께 자라기",
    author: "김창준",
    readAt: "2023-05",
    binding: "paperback",
    color: "#f3efe6",
    ink: "#2d5d62",
    size: { height: 21, width: 14.8 },
    pages: 220,
    summary:
      "개인의 실력 향상과 팀 협업을 애자일 관점에서 연구 결과와 경험을 바탕으로 풀어낸 책.",
  },
  {
    id: "clean-code",
    title: "클린 코드",
    author: "로버트 C. 마틴",
    readAt: "2022-12",
    binding: "hardcover",
    color: "#2f2f33",
    ink: "#cfd3d6",
    size: { height: 24, width: 17.5 },
    pages: 584,
    summary:
      "읽기 좋은 코드를 위한 이름 짓기, 함수, 주석, 오류 처리 등의 원칙을 사례 중심으로 다룬 책.",
  },
  {
    id: "modern-javascript-deep-dive",
    title: "모던 자바스크립트 Deep Dive",
    author: "이웅모",
    readAt: "2022-03",
    binding: "paperback",
    color: "#2d5d62",
    ink: "#f5f0e4",
    size: { height: 24, width: 18.3 },
    pages: 960,
    summary:
      "자바스크립트의 기본 개념부터 실행 컨텍스트, 클로저, 비동기 처리까지 동작 원리를 깊이 있게 설명하는 책.",
  },
];
