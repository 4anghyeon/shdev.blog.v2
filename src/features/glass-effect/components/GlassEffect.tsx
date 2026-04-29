import "#/features/glass-effect/styles/glass-effect.css";

export function GlassEffect() {
  return (
    <>
      <svg style={{ display: "none" }}>
        <title>Glass Wrapper</title>
        <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves={2}
            seed={92}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={2} result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale={60}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="glass-filter" />
      <div className="glass-overlay" />
      <div className="glass-specular" />
    </>
  );
}
