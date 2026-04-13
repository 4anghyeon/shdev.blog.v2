export const RgbExample2 = () => {
  return (
    <div className="flex flex-col gap-y-3 pb-4">
      <div className="flex gap-x-3">
        <div
          className="h-8 w-72 rounded-md"
          style={{
            background:
              "linear-gradient(90deg,rgba(255, 0, 0, 1) 0%, rgba(0, 0, 255, 1) 100%)",
          }}
        />
      </div>
    </div>
  );
};
