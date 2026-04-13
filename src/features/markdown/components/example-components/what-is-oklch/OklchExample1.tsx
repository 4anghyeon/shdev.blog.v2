"use client";

export const OklchExample1 = () => {
  const colors = [
    { name: "빨강", rgb: "rgb(255, 0, 0)", oklch: "oklch(53% 0.27 29.2)" },
    { name: "노랑", rgb: "rgb(255, 255, 0)", oklch: "oklch(97% 0.22 110.0)" },
    { name: "초록", rgb: "rgb(0, 255, 0)", oklch: "oklch(87% 0.27 142.5)" },
    { name: "파랑", rgb: "rgb(0, 0, 255)", oklch: "oklch(45% 0.27 264.3)" },
    { name: "보라", rgb: "rgb(128, 0, 128)", oklch: "oklch(40% 0.23 328.5)" },
  ];

  // OKLCH 색상의 밝기를 동일하게 맞춘 버전
  const oklchUniform = [
    { name: "빨강", color: "oklch(60% 0.27 29.2)" },
    { name: "노랑", color: "oklch(60% 0.22 110.0)" },
    { name: "초록", color: "oklch(60% 0.27 142.5)" },
    { name: "파랑", color: "oklch(60% 0.27 264.3)" },
    { name: "보라", color: "oklch(60% 0.23 328.5)" },
  ];

  return (
    <div className="flex flex-col gap-y-3 py-4">
      <div className="flex flex-col">
        <span className="mb-1 font-medium text-sm">RGB</span>
        <div className="flex flex-wrap gap-x-2">
          {colors.map((color) => (
            <div key={`rgb-${color.name}`} className="text-center">
              <div
                style={{ backgroundColor: color.rgb }}
                className="h-8 w-8 rounded"
              ></div>
            </div>
          ))}
        </div>
        <span className="mt-1 block text-gray-600 text-xs">
          RGB에서 최대 채널 값이 같아도 (255) 실제 인지되는 밝기는 매우 다르다.
        </span>
      </div>
      <div className="flex flex-col">
        <span className="mb-1 font-medium text-sm">OKLCH</span>
        <div className="flex flex-wrap gap-x-2">
          {oklchUniform.map((color) => (
            <div key={`oklch-${color.name}`} className="text-center">
              <div
                style={{ backgroundColor: color.color }}
                className="h-8 w-8 rounded"
              ></div>
            </div>
          ))}
        </div>
        <span className="mt-1 block text-gray-600 text-xs">
          OKLCH에서는 L값만 동일하게 설정하면 모든 색상이 시각적으로 비슷한
          밝기로 인지된다.
        </span>
      </div>
    </div>
  );
};
