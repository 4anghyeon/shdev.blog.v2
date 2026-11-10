const STAR_GROUPS = [
  {
    duration: 1.9,
    delay: 0,
    stars: [
      { x: "46.1%", y: "14.43%", width: "0.9%" },
      { x: "52.43%", y: "12.35%", width: "0.65%" },
      { x: "64.37%", y: "23.36%", width: "0.65%" },
      { x: "79.23%", y: "5.51%", width: "0.9%" },
      { x: "86.9%", y: "14.43%", width: "0.65%" },
      { x: "93.23%", y: "4.32%", width: "0.9%" },
    ],
  },
  {
    duration: 2.6,
    delay: -1.1,
    stars: [
      { x: "47.5%", y: "20.98%", width: "0.65%" },
      { x: "54.17%", y: "10.27%", width: "0.9%" },
      { x: "65.37%", y: "12.05%", width: "0.9%" },
      { x: "80.3%", y: "30.8%", width: "0.65%" },
      { x: "88.3%", y: "7.29%", width: "0.9%" },
      { x: "95.77%", y: "11.76%", width: "0.65%" },
    ],
  },
  {
    duration: 3.4,
    delay: -2.3,
    stars: [
      { x: "48.03%", y: "30.21%", width: "0.65%" },
      { x: "60.37%", y: "24.55%", width: "0.65%" },
      { x: "67.3%", y: "29.02%", width: "0.65%" },
      { x: "82.47%", y: "11.9%", width: "0.9%" },
      { x: "89.97%", y: "29.32%", width: "0.65%" },
      { x: "97.1%", y: "9.67%", width: "0.9%" },
    ],
  },
  {
    duration: 4.3,
    delay: -0.6,
    stars: [
      { x: "49.9%", y: "4.91%", width: "0.9%" },
      { x: "62.3%", y: "6.7%", width: "0.9%" },
      { x: "73.63%", y: "9.08%", width: "0.9%" },
      { x: "85.37%", y: "3.72%", width: "0.9%" },
      { x: "91.37%", y: "29.32%", width: "0.65%" },
    ],
  },
];

/**
 * 밤하늘에서 반짝이는 별. 배경에서 지운 별 자리에 그려 넣고, 그룹마다 다른 박자로 작아지며 흐려졌다 돌아온다.
 */
export function LandscapeStars() {
  return (
    <>
      {STAR_GROUPS.map((group) =>
        group.stars.map((star) => (
          <svg
            key={star.x}
            aria-hidden="true"
            viewBox="-10 -10 20 20"
            className="-translate-1/2 absolute fill-[#eef2ff] drop-shadow-[0_0_2px_rgb(255_255_255/0.9)] motion-safe:animate-star-twinkle"
            style={{
              left: star.x,
              top: star.y,
              width: star.width,
              animationDuration: `${group.duration}s`,
              animationDelay: `${group.delay}s`,
            }}
          >
            <path d="M0 -10Q1.2 -1.2 10 0Q1.2 1.2 0 10Q-1.2 1.2 -10 0Q-1.2 -1.2 0 -10Z" />
          </svg>
        )),
      )}
    </>
  );
}
