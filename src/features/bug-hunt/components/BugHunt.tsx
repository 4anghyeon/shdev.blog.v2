import { sample } from "es-toolkit";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { Bug } from "#/features/bug-hunt/components/Bug";
import { HelpRequest } from "#/features/bug-hunt/components/HelpRequest";
import { Splat } from "#/features/bug-hunt/components/Splat";
import { ThanksToast } from "#/features/bug-hunt/components/ThanksToast";
import { recordCatch } from "#/features/bug-hunt/helper/bug-record";
import type { Point } from "#/features/bug-hunt/helper/flight-path";
import { useBugSpawn } from "#/features/bug-hunt/hooks/use-bug-spawn";

const THANKS_MESSAGES = [
  "버그 잡아줘서 고마워요!",
  "당신이 진정한 QA입니다",
  "어제 배포 때 들어왔나 봐요",
  "fix: 날벌레 제거",
  "TODO 하나 줄었어요",
  "이건 기능이었는데…",
];

interface Catch {
  id: number;
  point: Point;
  message: string;
}

/** 사이트를 둘러보는 동안 가끔 나타나는 날벌레를 잡는 이스터에그. 루트 레이아웃에 한 번만 둔다. */
export function BugHunt() {
  const [catches, setCatches] = useState<Catch[]>([]);
  const [isHelpHidden, setIsHelpHidden] = useState(false);
  const { isBugVisible, dismissBug } = useBugSpawn();

  const handleCatch = (point: Point) => {
    setIsHelpHidden(true);
    recordCatch();
    setCatches((prev) => [
      ...prev,
      { id: Date.now(), point, message: sample(THANKS_MESSAGES) },
    ]);
  };

  const handleBugDone = () => {
    setIsHelpHidden(false);
    dismissBug();
  };

  const removeCatch = (id: number) => {
    setCatches((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-45 overflow-hidden">
      <AnimatePresence>
        {isBugVisible && !isHelpHidden && (
          <HelpRequest onDismiss={() => setIsHelpHidden(true)} />
        )}
      </AnimatePresence>
      {isBugVisible && <Bug onCatch={handleCatch} onDone={handleBugDone} />}
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
