import { motion } from "motion/react";

/** 날벌레가 나타나면 화면 우측 상단에 도움을 요청하는 토스트를 오른쪽에서 밀어 넣는다. 누르면 `onDismiss`를 부른다. */
export function HelpRequest({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.button
      type="button"
      className="pointer-events-auto absolute top-4 right-4 flex items-center gap-x-2.5 rounded-lg border border-line bg-paper-solid py-2 pr-4 pl-2 shadow-page"
      initial={{ x: "calc(100% + 1rem)" }}
      animate={{ x: 0 }}
      exit={{ x: "calc(100% + 1rem)" }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onClick={onDismiss}
    >
      <motion.img
        className="aspect-square size-8 shrink-0 rounded-full border border-line"
        alt="profile icon"
        src="/images/profile.webp"
        width={120}
        height={120}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.5,
        }}
      />
      <p className="text-ink-strong text-xs">버그가 발생했어요! 도와주세요!</p>
    </motion.button>
  );
}
