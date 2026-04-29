import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function WorkInProgress() {
  return (
    <div className="flex w-full flex-1 items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <div className="flex">
          <DotLottieReact
            src="/lotties/under-construction.lottie"
            aria-label="Loading..."
            loop
            autoplay
          />
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-[11px] text-gray-400 uppercase tracking-[0.2em]">
            Work in progress
          </p>
          <h1 className="font-medium text-[28px] text-gray-900 leading-snug tracking-tight dark:text-gray-100">
            준비 중이에요
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            곧 만나볼 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
