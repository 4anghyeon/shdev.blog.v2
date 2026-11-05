import { sample } from "es-toolkit";
import { useState } from "react";
import { Bug } from "#/features/bug-hunt/components/Bug";
import { Splat } from "#/features/bug-hunt/components/Splat";
import { ThanksToast } from "#/features/bug-hunt/components/ThanksToast";
import { recordCatch } from "#/features/bug-hunt/helper/bug-record";
import type { Point } from "#/features/bug-hunt/helper/flight-path";
import { useBugSpawn } from "#/features/bug-hunt/hooks/use-bug-spawn";

const THANKS_MESSAGES = [
  "버그 잡아줘서 고마워요!",
  "QA팀 합류를 제안합니다",
  "이 버그는 배포되지 않았습니다",
  "fix: 날벌레 제거",
  "디버깅 실력이 대단하시네요",
  "오늘도 프로덕션을 지켜냈어요",
];

interface Catch {
  id: number;
  point: Point;
  message: string;
}

/** 사이트를 둘러보는 동안 가끔 나타나는 날벌레를 잡는 이스터에그. 루트 레이아웃에 한 번만 둔다. */
export function BugHunt() {
  const { isBugVisible, dismissBug } = useBugSpawn();
  const [catches, setCatches] = useState<Catch[]>([]);

  const handleCatch = (point: Point) => {
    recordCatch();
    setCatches((prev) => [
      ...prev,
      { id: Date.now(), point, message: sample(THANKS_MESSAGES) },
    ]);
  };

  const removeCatch = (id: number) => {
    setCatches((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-45 overflow-hidden">
      {isBugVisible && <Bug onCatch={handleCatch} onDone={dismissBug} />}
      {catches.map(({ id, point, message }) => (
        <div key={id}>
          <Splat point={point} />
          <ThanksToast
            point={point}
            message={message}
            onDone={() => removeCatch(id)}
          />
        </div>
      ))}
    </div>
  );
}
