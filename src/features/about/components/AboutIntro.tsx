import { useState } from "react";
import { TegakiRenderer } from "tegaki/react";
import eastSeaDokdo from "#/features/about/fonts/east-sea-dokdo/bundle";
import { Seal } from "#/shared/components/Seal";

const WRITING_DELAY = 0.4;
const brushEffects = {
  pressureWidth: { strength: 0.8 },
  taper: true,
} as const;

export function AboutIntro() {
  const [isBodyDone, setIsBodyDone] = useState(false);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <TegakiRenderer
        font={eastSeaDokdo}
        text={"안녕하세요. 프론트엔드 개발자 이상현입니다."}
        time={{ mode: "uncontrolled", duration: 1.5, delay: WRITING_DELAY }}
        effects={brushEffects}
        quality={{ smoothing: true, clipText: 3 }}
        className="w-full break-keep text-[36px] text-stone-800 leading-[1.2] md:text-[46px] dark:text-stone-200"
      />
      <div className="flex items-end justify-between gap-6">
        <TegakiRenderer
          font={eastSeaDokdo}
          text={
            "만들어가는 과정에서 배운 것들,\n쉬어가며 느낀 소소한 일상을 기록합니다."
          }
          time={{
            mode: "uncontrolled",
            duration: 2.5,
            delay: WRITING_DELAY + 1.3,
          }}
          effects={brushEffects}
          quality={{ smoothing: true, clipText: 2 }}
          onComplete={() => setIsBodyDone(true)}
          className="min-w-0 flex-1 break-keep text-[22px] text-stone-700 leading-[1.45] md:text-[26px] dark:text-stone-300"
        />
        <Seal visible={isBodyDone} />
      </div>
    </div>
  );
}
