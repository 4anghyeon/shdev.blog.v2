import { useState } from "react";
import { TegakiRenderer } from "tegaki/react";
import { ABOUT_BODY, ABOUT_GREETING } from "#/features/about/constant";
import eastSeaDokdo from "#/features/about/fonts/east-sea-dokdo/bundle";

const WRITING_DELAY = 0.4;
const brushEffects = {
  pressureWidth: { strength: 0.8 },
  taper: true,
} as const;

export function AboutIntro() {
  const [isBodyDone, setIsBodyDone] = useState(false);

  // 인사말과 본문은 같은 delay로 동시에 쓰기 시작한다
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <TegakiRenderer
        font={eastSeaDokdo}
        text={ABOUT_GREETING}
        time={{ mode: "uncontrolled", duration: 1.5, delay: WRITING_DELAY }}
        effects={brushEffects}
        quality={{ smoothing: true, clipText: 3 }}
        className="w-full break-keep text-[36px] text-stone-800 leading-[1.2] md:text-[46px] dark:text-stone-200"
      />
      <div className="flex items-end justify-between gap-6">
        <TegakiRenderer
          font={eastSeaDokdo}
          text={ABOUT_BODY}
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

function Seal({ visible }: { visible: boolean }) {
  return (
    <img
      src="/images/seal.webp"
      alt="seal"
      width={32}
      height={32}
      className="size-8 shrink-0 opacity-0 data-[visible=true]:animate-stamp motion-reduce:animate-none motion-reduce:opacity-100"
      data-visible={visible}
    />
  );
}
