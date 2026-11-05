import { recordBugCatch } from "#/features/bug-hunt/server";

const PERSONAL_CAUGHT_KEY = "bug-hunt:caught";

const incrementPersonalCount = () => {
  try {
    const count = Number(localStorage.getItem(PERSONAL_CAUGHT_KEY)) || 0;
    localStorage.setItem(PERSONAL_CAUGHT_KEY, String(count + 1));
  } catch {}
};

/** 잡은 날벌레를 이 브라우저의 개인 기록과 방문자 전체 기록에 1씩 더한다. */
export const recordCatch = () => {
  incrementPersonalCount();
  recordBugCatch().catch(() => null);
};
