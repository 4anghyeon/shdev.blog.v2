export function ContainerQuerySolution() {
  return (
    <div className="my-12 w-full space-y-6">
      <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-gray-100/50 shadow-xl lg:flex-row">
        {/* 1. Main Area: 공간이 충분하므로 @container 쿼리에 의해 가로로 전환됨 */}
        <div className="@container flex-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="h-2 w-20 rounded-full bg-gray-100" />
          </div>

          {/* Card: 뷰포트가 아닌, 부모 컨테이너 너비가 400px 이상일 때만 가로(flex-row) 배치 */}
          <div className="flex @[400px]:flex-row flex-col gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-500">
            <div className="flex h-32 @[400px]:w-40 w-full shrink-0 items-center justify-center rounded-xl bg-blue-500 shadow-blue-100 shadow-lg">
              <svg
                className="h-8 w-8 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              <div className="space-y-2 text-gray-400">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sidebar Area: lg 너비가 되어도 부모 너비가 좁으므로 세로 형태 유지 */}
        <div className="@container flex-1 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="h-2 w-12 rounded-full bg-gray-100" />
            <div className="rounded bg-green-100 px-2 py-0.5 font-bold text-[10px] text-green-600 uppercase">
              Sidebar: OK
            </div>
          </div>

          {/* Card:
              뷰포트가 아무리 커져도(lg), 부모 컨테이너가 400px 미만이면
              flex-col을 유지하여 깨지지 않는 레이아웃을 제공함 */}
          <div className="flex @[400px]:flex-row flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-500">
            <div className="flex h-24 @[400px]:w-20 w-full shrink-0 items-center justify-center rounded-xl bg-gray-100 transition-colors">
              <svg
                className="h-6 w-6 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3 overflow-hidden py-1">
              <div className="h-4 w-full rounded-md bg-gray-100" />
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-gray-50" />
                <div className="h-2 w-3/4 rounded bg-gray-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
