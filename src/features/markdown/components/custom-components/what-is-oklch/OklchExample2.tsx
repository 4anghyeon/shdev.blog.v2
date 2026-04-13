"use client";

export const OklchExample2 = () => {
  return (
    <div className="flex flex-col gap-y-3 py-4">
      <div className="flex flex-col">
        <span className="mb-1 font-medium text-sm">HSL</span>
        <div className="flex flex-wrap gap-x-2">
          {[0, 20, 40, 60, 80, 100].map((sat) => (
            <div key={`hsl-${sat}`} className="text-center">
              <div
                style={{ backgroundColor: `hsl(240, ${sat}%, 50%)` }}
                className="h-8 w-8 rounded"
              ></div>
              <span className="mt-1 block text-gray-600 text-xs">{sat}%</span>
            </div>
          ))}
        </div>
        <span className="mt-1 block text-gray-600 text-xs">
          HSL에서는 채도를 조절할 때 밝기가 일정하게 유지되지 않는다.
        </span>
      </div>
      <div className="flex flex-col">
        <span className="mb-1 font-medium text-sm">OKLCH</span>
        <div className="flex flex-wrap gap-x-2">
          {[0, 0.05, 0.1, 0.15, 0.2, 0.25].map((chroma) => (
            <div key={`oklch-${chroma}`} className="text-center">
              <div
                style={{ backgroundColor: `oklch(60% ${chroma} 264.3)` }}
                className="h-8 w-8 rounded"
              ></div>
              <span className="mt-1 block text-gray-600 text-xs">{chroma}</span>
            </div>
          ))}
        </div>
        <span className="mt-1 block text-gray-600 text-xs">
          OKLCH에서는 채도(C)를 변경해도 밝기(L)는 일정하게 유지된다.
        </span>
      </div>
    </div>
  );
};
