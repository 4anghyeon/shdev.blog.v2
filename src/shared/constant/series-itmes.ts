export const SERIES_ITEMS = [
  {
    id: "laws-of-ux",
    title: "UX의 법칙",
    desc: "여러가지 UX 법칙을 분석하고, 실제 프로덕트에 어떻게 적용하여 사용성을 개선할 수 있을지 고민한 글들을 묶은 시리즈입니다.",
    image: "/images/series/laws-of-ux.webp",
  },
  {
    id: "multiparadigm-programming",
    title: "멀티패러다임 프로그래밍",
    desc: "멀티패러다임 프로그래밍 (유인동 저)을 읽고 개인적으로 정리한 글들을 묶은 시리즈입니다.",
    image: "/images/series/multiparadigm-programming.webp",
  },
] as const;

export type SeriesKey = (typeof SERIES_ITEMS)[number]["id"];
