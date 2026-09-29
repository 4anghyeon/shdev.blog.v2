import { useState } from "react";
import { TegakiRenderer } from "tegaki/react";
import { ABOUT_GREETING, ABOUT_PARAGRAPHS } from "#/features/about/constant";
import eastSeaDokdo from "#/features/about/fonts/east-sea-dokdo/bundle";

const LINE_REVEAL_DURATION = 1.2;
const LINE_STAGGER = 0.5;
const PARAGRAPH_GAP = 0.4;

// 문단 사이에 약간의 쉼을 두고 한 줄씩 순서대로 나타나도록 지연 시간을 계산
const paragraphs = ABOUT_PARAGRAPHS.map((lines, paragraphIndex) => {
  const linesBefore = ABOUT_PARAGRAPHS.slice(0, paragraphIndex).flat().length;
  return lines.map((text, lineIndex) => ({
    text,
    delay:
      (linesBefore + lineIndex) * LINE_STAGGER + paragraphIndex * PARAGRAPH_GAP,
  }));
});
const lastLineDelay = paragraphs.flat().at(-1)?.delay ?? 0;
const sealDelay = lastLineDelay + LINE_REVEAL_DURATION;

export function AboutIntro() {
  const [isGreetingDone, setIsGreetingDone] = useState(false);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <TegakiRenderer
        font={eastSeaDokdo}
        text={ABOUT_GREETING}
        time={{ mode: "uncontrolled", duration: 1.5, delay: 0.4 }}
        effects={{ pressureWidth: { strength: 0.8 }, taper: true }}
        quality={{ smoothing: true, clipText: 3 }}
        onComplete={() => setIsGreetingDone(true)}
        className="w-full break-keep text-[36px] text-stone-800 leading-[1.2] md:text-[46px] dark:text-stone-200"
      />
      <div
        className="group flex items-end justify-between gap-6 break-keep text-[22px] text-stone-700 leading-[1.45] md:text-[26px] dark:text-stone-300"
        style={{ fontFamily: `'${eastSeaDokdo.family}'` }}
        data-revealed={isGreetingDone}
      >
        <div className="flex flex-col gap-4">
          {paragraphs.map((lines) => (
            <p key={lines[0].text}>
              {lines.map(({ text, delay }) => (
                <span
                  key={text}
                  className="block opacity-0 group-data-[revealed=true]:animate-reveal-ltr motion-reduce:group-data-[revealed=true]:animate-none motion-reduce:group-data-[revealed=true]:opacity-100"
                  style={{
                    animationDelay: `${delay}s`,
                    animationDuration: `${LINE_REVEAL_DURATION}s`,
                  }}
                >
                  {text}
                </span>
              ))}
            </p>
          ))}
        </div>
        <Seal delay={sealDelay} />
      </div>
    </div>
  );
}

function Seal({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-[3px] border-2 border-red-700/80 font-bold font-pretendard text-[11px] text-red-700/80 leading-none tracking-tighter opacity-0 [writing-mode:vertical-rl] group-data-[revealed=true]:animate-stamp motion-reduce:group-data-[revealed=true]:animate-none motion-reduce:group-data-[revealed=true]:opacity-100 dark:border-red-500/70 dark:text-red-500/70"
      style={{ animationDelay: `${delay}s` }}
    >
      相賢
    </span>
  );
}
