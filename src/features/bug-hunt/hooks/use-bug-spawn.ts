import { random } from "es-toolkit";
import { useEffect, useState } from "react";

const SPAWN_COUNT_KEY = "bug-hunt:spawned";
const MAX_SPAWNS_PER_SESSION = import.meta.env.DEV
  ? Number.POSITIVE_INFINITY
  : 3;
const SPAWN_DELAY_RANGE_MS: [number, number] = import.meta.env.DEV
  ? [3_000, 5_000]
  : [20_000, 90_000];
const SPAWN_PROBABILITY = import.meta.env.DEV ? 1 : 0.5;
const FIRST_SPAWN_DELAY_RANGE_MS: [number, number] = import.meta.env.DEV
  ? [3_000, 5_000]
  : [10_000, 30_000];

const getSpawnCount = () => {
  try {
    return Number(sessionStorage.getItem(SPAWN_COUNT_KEY)) || 0;
  } catch {
    return 0;
  }
};

const increaseSpawnCount = () => {
  try {
    sessionStorage.setItem(SPAWN_COUNT_KEY, String(getSpawnCount() + 1));
  } catch {}
};

/** 세션의 첫 벌레는 짧은 대기 뒤 반드시 나오고, 그 뒤로는 더 긴 간격마다 확률적으로 나온다. */
const getSpawnRule = (spawnCount: number) => {
  if (spawnCount === 0) {
    return { delayRange: FIRST_SPAWN_DELAY_RANGE_MS, probability: 1 };
  }
  return { delayRange: SPAWN_DELAY_RANGE_MS, probability: SPAWN_PROBABILITY };
};

/**
 * 탭이 보이는 동안 무작위 간격마다 확률적으로 날벌레를 등장시킨다.
 * 한 세션에 최대 등장 횟수가 정해져 있고, 움직임 줄이기 설정을 켠 사용자에게는 나타나지 않는다.
 */
export const useBugSpawn = () => {
  const [isBugVisible, setIsBugVisible] = useState(false);

  const dismissBug = () => setIsBugVisible(false);

  useEffect(() => {
    if (isBugVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      clearTimeout(timer);
      const spawnCount = getSpawnCount();
      if (document.hidden || spawnCount >= MAX_SPAWNS_PER_SESSION) return;

      const { delayRange, probability } = getSpawnRule(spawnCount);
      timer = setTimeout(
        () => {
          if (Math.random() < probability) {
            increaseSpawnCount();
            setIsBugVisible(true);
          } else {
            schedule();
          }
        },
        random(...delayRange),
      );
    };

    schedule();
    document.addEventListener("visibilitychange", schedule);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [isBugVisible]);

  return { isBugVisible, dismissBug };
};
