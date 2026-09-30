import { NacreLayer } from "#/features/glass-effect/components/NacreLayer";

interface GlassEffectProps {
  variant?: "plain" | "nacre";
}

export function GlassEffect({ variant = "plain" }: GlassEffectProps) {
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
      {variant === "nacre" && <NacreLayer />}
      <div className="glass-overlay" />
      <div className="glass-specular" />
    </>
  );
}
