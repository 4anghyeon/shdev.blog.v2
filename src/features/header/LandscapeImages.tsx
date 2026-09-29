// 테마는 페인트 전에 <html>.dark로 결정되므로 isDark 상태 대신 dark: 클래스로 전환해야
// SSR 첫 화면에서 잘못된 이미지가 깜빡이지 않는다. 두 이미지를 겹쳐 두고 opacity로 교차 전환한다.
export function LandscapeImages() {
  return (
    <>
      <img
        src="/images/about-landscape-hero.webp"
        alt=""
        width={1500}
        height={336}
        className="absolute inset-0 size-full transition-opacity duration-700 dark:opacity-0"
      />
      <img
        src="/images/about-landscape-hero-dark.webp"
        alt=""
        width={1500}
        height={336}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-700 dark:opacity-100"
      />
    </>
  );
}
