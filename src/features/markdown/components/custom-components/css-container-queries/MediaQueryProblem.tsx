import { useUserAgent } from "#/shared/hooks/use-user-agent.ts";

export function MediaQueryProblem() {
  const { isMobileDevice } = useUserAgent();

  return (
    <div className="my-12 w-full space-y-6">
      <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-gray-100/50 shadow-xl lg:flex-row">
        {isMobileDevice && (
          <span className="mb-4 text-gray-500 text-sm italic lg:hidden">
            데스크탑에서 확인해보세요
          </span>
        )}
        {/* 1. Main Area: 공간이 충분해 lg에서 가로로 변해도 예쁨 */}
        <div className="flex-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="h-2 w-20 rounded-full bg-gray-100" />
            {/* lg 이상일 때만 나타나는 상태 표시 */}
            <div className="hidden rounded bg-green-100 px-2 py-0.5 font-bold text-[10px] text-green-600 uppercase lg:block">
              Main: OK
            </div>
          </div>

          {/* Card: lg 미만(Normal) -> lg 이상(Horizontal) */}
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-500 lg:flex-row">
            <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-blue-100 shadow-lg lg:w-40">
              <svg
                className="h-8 w-8 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor font-bold"
              >
                <title>Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3 py-2">
              <div className="h-5 w-2/3 rounded-md bg-blue-100" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sidebar Area: lg 이전에는 세로라 괜찮다가 lg에서 깨짐 */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="h-2 w-12 rounded-full bg-gray-100" />
            {/* lg 이상일 때만 나타나는 경고 표시 */}
            <div className="hidden animate-pulse rounded bg-red-100 px-2 py-0.5 font-bold text-[10px] text-red-600 uppercase lg:block">
              Sidebar: Broken
            </div>
          </div>

          {/* Card:
              lg 미만: flex-col (모두에게 평화로움)
              lg 이상: flex-row (좁은 사이드바에서 억지로 가로 배치 시도) */}
          <div className="flex flex-col gap-4 rounded-2xl border-2 border-transparent bg-white p-5 transition-all duration-500 lg:flex-row lg:border-red-200 lg:bg-red-50/30">
            <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl bg-gray-200 shadow-sm transition-colors lg:h-20 lg:w-20 lg:bg-red-400">
              <span className="px-2 text-center font-bold text-gray-400 text-xs uppercase italic tracking-tighter opacity-50 lg:hidden">
                브라우저 크기를 늘려보세요.
              </span>
              <svg
                className="hidden h-6 w-6 animate-bounce text-white lg:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Resize Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3 overflow-hidden py-1">
              <div className="h-4 w-full rounded-md bg-gray-200 transition-colors lg:w-full lg:bg-red-200" />
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-gray-100" />
                <div className="hidden h-2 w-full rounded bg-gray-100 opacity-50 lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
