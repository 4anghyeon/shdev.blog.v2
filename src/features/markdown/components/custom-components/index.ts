import { BookInfo } from "#/features/markdown/components/custom-components/BookInfo";
import { DiffExample } from "#/features/markdown/components/custom-components/css-font-variant-numeric-guide/DiffExample";
import { PromiseRaceRenderingQuiz } from "#/features/markdown/components/custom-components/multiparadigm-async-programming-guide/PromiseRaceRenderingQuiz";
import { YoutubeIframe } from "#/features/markdown/components/custom-components/YoutubeIframe";
import * as CssContainerQueries from "./css-container-queries";
import * as Tabindex from "./tabindex";
import * as ThreeJSAboutLights from "./threejs-about-lights";
import * as ThreeJSGeometryMaterialsMesh from "./threejs-geometry-materials-mesh";
import * as WhatIsOklch from "./what-is-oklch";

export const ExampleComponents = {
  ...ThreeJSGeometryMaterialsMesh,
  ...ThreeJSAboutLights,
  ...Tabindex,
  ...WhatIsOklch,
  ...CssContainerQueries,
  BookInfo,
  DiffExample,
  YoutubeIframe,
  PromiseRaceRenderingQuiz,
};
