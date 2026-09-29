export function AboutHero() {
  return (
    <div className="w-full overflow-hidden">
      <img
        src="/images/about-landscape-hero.webp"
        alt=""
        width={1500}
        height={336}
        className="mask-[linear-gradient(to_bottom,black_70%,transparent)] aspect-1500/336 max-h-[40svh] w-full bg-stone-100 object-cover dark:bg-stone-900 [@media(max-height:820px)]:max-h-[28svh]"
      />
    </div>
  );
}
