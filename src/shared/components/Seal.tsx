import { cn } from "#/shared/lib/tailwind";

interface SealProps {
  visible: boolean;
  className?: string;
}

export function Seal({ visible, className }: SealProps) {
  return (
    <img
      src="/images/seal.webp"
      alt="seal"
      aria-hidden
      width={32}
      height={32}
      className={cn(
        "size-8 shrink-0 opacity-0 data-[visible=true]:animate-stamp motion-reduce:animate-none motion-reduce:opacity-100",
        className,
      )}
      data-visible={visible}
    />
  );
}
