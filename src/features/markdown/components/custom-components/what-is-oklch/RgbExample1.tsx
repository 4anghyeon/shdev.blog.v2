export const RgbExample1 = () => {
  return (
    <div className="flex flex-col items-center gap-y-3 py-4">
      <p className="text-gray-400 text-sm italic">
        어떤 색이 더 밝아 보이시나요?
      </p>
      <div className="flex gap-x-3">
        <div
          className="h-6 w-6 rounded-md"
          style={{
            background: "rgb(0, 0, 255)",
          }}
        />
        <div
          className="h-6 w-6 rounded-md"
          style={{
            background: "rgb(0, 255, 0)",
          }}
        />
      </div>
    </div>
  );
};
