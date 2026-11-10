const BIRDS = [
  {
    restX: "77%",
    top: "11%",
    width: "2%",
    duration: 70,
    delay: -40,
    flapDelay: 0,
  },
  {
    restX: "80.5%",
    top: "15%",
    width: "1.8%",
    duration: 70,
    delay: -37.5,
    flapDelay: -0.7,
  },
  {
    restX: "85%",
    top: "8%",
    width: "1.5%",
    duration: 70,
    delay: -34,
    flapDelay: -1.2,
  },
  {
    restX: "92%",
    top: "20%",
    width: "1.2%",
    duration: 110,
    delay: -15,
    flapDelay: -0.4,
  },
];

interface WingProps {
  flapDelay: number;
}

function Wing({ flapDelay }: WingProps) {
  return (
    <path
      d="M0 0Q-4 -6 -12 -3"
      className="motion-safe:animate-bird-flap"
      style={{ animationDelay: `${flapDelay}s` }}
    />
  );
}

/**
 * 하늘을 왼쪽에서 오른쪽으로 가로지르는 새들. 선 색은 부모의 글자색을 따른다.
 */
export function LandscapeBirds() {
  return (
    <>
      {BIRDS.map((bird) => (
        // 모션을 줄인 환경에서는 애니메이션 없이 restX 위치에 멈춰 있는다
        <div
          key={bird.restX}
          className="absolute inset-0 motion-safe:animate-bird-cross"
          style={{
            translate: bird.restX,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="-13 -9 26 16"
            className="absolute left-0 overflow-visible fill-none stroke-[1.3] stroke-current motion-safe:animate-bird-bob"
            style={{
              top: bird.top,
              width: bird.width,
              animationDelay: `${bird.flapDelay * 3}s`,
            }}
            strokeLinecap="round"
          >
            <Wing flapDelay={bird.flapDelay} />
            <g transform="scale(-1 1)">
              <Wing flapDelay={bird.flapDelay} />
            </g>
          </svg>
        </div>
      ))}
    </>
  );
}
