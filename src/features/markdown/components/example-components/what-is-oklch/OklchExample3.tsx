export const OklchExample3 = () => {
  return (
    <div className="flex w-full flex-col gap-y-2 py-4">
      <div className="w-full max-w-xs">
        <span className="mb-1 font-medium text-sm">RGB</span>
        <div
          className="h-8 rounded-md"
          style={{
            background: "linear-gradient(to right, rgb(255,0,0), rgb(0,0,255))",
          }}
        />
      </div>
      <div className="w-full max-w-xs">
        <span className="mb-1 font-medium text-sm">OKLCH</span>
        <div
          className="h-8 rounded-md"
          style={{
            background:
              "linear-gradient(to right, oklch(53% 0.27 29.2), oklch(45% 0.27 264.3))",
          }}
        />
      </div>
    </div>
  );
};
