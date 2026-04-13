import { useState } from "react";

export const RgbQuiz = () => {
  const [isClick, setIsClick] = useState(false);

  return (
    <div className="flex justify-center py-4">
      <button
        type="button"
        className="cursor-pointer rounded-2xl border border-gray-300 px-3 py-1 text-sm text-white"
        style={{ background: isClick ? "rgb(128, 57, 198" : "gray" }}
        onClick={() => setIsClick((prev) => !prev)}
      >
        {isClick
          ? "rgb(128, 57, 198)"
          : "rgb(128, 57, 198)는 무슨 색깔일까요? 저를 눌러 보세요"}
      </button>
    </div>
  );
};
