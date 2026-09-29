import { useEffect, useRef, useState } from "react";
import { Seal } from "#/shared/components/Seal";

export function PostEndSeal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRead(true);
          observer.disconnect();
        }
      },
      { threshold: 1 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-12 flex justify-end"
      data-pagefind-ignore="all"
    >
      <Seal visible={isRead} className="size-12" />
    </div>
  );
}
