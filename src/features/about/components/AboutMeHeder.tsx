import { Underline } from "#/features/about/components/stickers/Underline.tsx";

export function AboutMeHeder() {
  return (
    <h1 className="relative mb-4 -rotate-3 font-light text-7xl">
      About me
      <Underline
        className="absolute -bottom-2.5 left-0 text-gray-900/80 dark:text-stone-100/80"
        width={280}
        height={30}
      />
    </h1>
  );
}
