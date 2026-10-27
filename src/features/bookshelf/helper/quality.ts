export type QualityTier = "high" | "low";

export interface QualitySettings {
  dpr: number | [number, number];
  shadowMapSize: number;
  environmentResolution: number;
  /** 바닥 그림자를 다시 그리는 프레임 수. Infinity면 매 프레임 갱신한다 */
  contactShadowFrames: number;
}

export const QUALITY_SETTINGS = {
  high: {
    dpr: [1, 2],
    shadowMapSize: 2048,
    environmentResolution: 256,
    contactShadowFrames: Number.POSITIVE_INFINITY,
  },
  low: {
    dpr: 1,
    shadowMapSize: 1024,
    environmentResolution: 64,
    contactShadowFrames: 1,
  },
} satisfies Record<QualityTier, QualitySettings>;

/** 이보다 낮은 프레임레이트가 이어지면 낮은 품질 단계로 내린다 */
export const MIN_ACCEPTABLE_FPS = 40;

const LOW_END_CORES = 4;
const LOW_END_MEMORY_GB = 4;

/**
 * 코어 수와 메모리로 첫 품질 단계를 고른다.
 * 기기 정보만으로는 정확하지 않아서, 실제 프레임레이트를 보고 다시 낮출 수 있다.
 */
export const detectInitialQualityTier = (): QualityTier => {
  const cores = navigator.hardwareConcurrency;
  if (cores > 0 && cores <= LOW_END_CORES) return "low";
  // deviceMemory는 Chromium 계열에서만 제공된다
  if (
    "deviceMemory" in navigator &&
    typeof navigator.deviceMemory === "number" &&
    navigator.deviceMemory <= LOW_END_MEMORY_GB
  ) {
    return "low";
  }
  return "high";
};
