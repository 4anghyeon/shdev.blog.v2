import { BookInfo } from "#/features/markdown/components/custom-components/BookInfo.tsx";
import { DiffExample } from "#/features/markdown/components/custom-components/css-font-variant-numeric-guide/DiffExample.tsx";
import { YoutubeIframe } from "#/features/markdown/components/custom-components/YoutubeIframe.tsx";
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
};
