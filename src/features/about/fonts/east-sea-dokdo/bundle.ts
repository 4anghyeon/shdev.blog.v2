// tegaki-generator로 생성한 번들 (about 본문에 쓰인 글자만 서브셋)
// 본문을 수정하면 새 글자에 맞춰 다시 생성해야 합니다.

import fontUrl from "./east-sea-dokdo-ac1dac3a.ttf?url";
import glyphData from "./glyphData.json";

const family = "East Sea Dokdo Tegaki ac1dac3a";

const bundle = {
  version: 0,
  family,
  lineCap: "round",
  fontUrl,
  fontFaceCSS: `@font-face { font-family: '${family}'; src: url(${fontUrl}); }`,
  unitsPerEm: 1000,
  ascender: 706,
  descender: -294,
  glyphData,
} as const;

export default bundle;
