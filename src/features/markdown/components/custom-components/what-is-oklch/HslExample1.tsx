const ColorBlock = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="h-8 w-8 rounded-md"
      style={{ backgroundColor: color }}
    ></div>
    <span className="mt-2 text-gray-700 text-xs">{label}</span>
  </div>
);

const ColorSection = ({ lightness }: { lightness: number }) => {
  const hue = 240; // Blue
  const saturations = [0, 50, 100];

  return (
    <div className="mb-2 flex items-center justify-between gap-x-4">
      <p className="text-sm">Lightness: {lightness}%</p>
      <div className="mt-4 flex gap-4">
        {saturations.map((sat) => {
          const colorValue = `hsl(${hue}, ${sat}%, ${lightness}%)`;
          const label = `S=${sat}%`;
          return <ColorBlock key={sat} color={colorValue} label={label} />;
        })}
      </div>
    </div>
  );
};

export const HslExample1 = () => {
  const lightnessLevels = [10, 50, 90];

  return (
    <div className="flex py-4">
      <div>
        <span className="font-semibold text-md">HSL - Blue (Hue: 240°)</span>
        {lightnessLevels.map((lightness) => (
          <ColorSection key={lightness} lightness={lightness} />
        ))}
      </div>
    </div>
  );
};
