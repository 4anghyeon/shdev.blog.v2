import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useRef, useState } from "react";

const TICKER_SPEED = 20; // px/s

export function TitleTicker({ title }: { title: string }) {
  const xValue = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const hasEnteredRef = useRef(false);

  useAnimationFrame((_, delta) => {
    if (!innerRef.current || !isScrolling) return;
    const halfWidth = innerRef.current.scrollWidth / 2;
    if (halfWidth === 0) return;
    const next = xValue.get() - (delta / 1000) * TICKER_SPEED;
    xValue.set(next % -halfWidth);
  });

  const handleAnimationComplete = () => {
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      setIsScrolling(true);
    }
  };

  return (
    <motion.li
      className="glass-item glass-item-active relative flex max-w-25 overflow-hidden px-2 py-1 font-normal text-sky-600 hover:cursor-default md:max-w-50 dark:text-gray-300"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 200, opacity: 1 }}
      exit={{ width: 0, opacity: 0, paddingLeft: 0, paddingRight: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        ref={innerRef}
        className="flex whitespace-nowrap"
        style={{ x: xValue }}
      >
        <span className="pr-6">{title}</span>
        <span className="pr-6">{title}</span>
      </motion.div>
    </motion.li>
  );
}
