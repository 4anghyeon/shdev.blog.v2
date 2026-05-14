import { AboutMeHeder } from "#/features/about/components/AboutMeHeder.tsx";
import { DrawingArrow } from "#/features/about/components/stickers/DrawingArrow.tsx";

export function RouteContainer() {
  return (
    <div className="grid h-full flex-1 grid-cols-9 px-12">
      <div className="col-span-3 font-daegwangyuri">
        <AboutMeHeder />
        <p className="font-semibold text-xl">
          기술 구현을 넘어 서비스의 가치를 고민하고, <br />
          사용자 경험과 개발 효율을 함께 생각합니다.
        </p>
        <div className="mt-1 flex items-center justify-center text-[#A2ADCB]">
          <DrawingArrow className="rotate-3" width={60} height={24} />
          <p className="-rotate-3 font-bold">
            Front-end Engineer
            <br />
            Creative Developer
          </p>
        </div>
      </div>
    </div>
  );
}
