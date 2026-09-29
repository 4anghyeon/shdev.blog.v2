import { Clipboard, ClipboardCheck } from "lucide-react";
import { useCopy } from "#/shared/hooks/use-copy";

export function CodeCopyButton({ code }: { code: string }) {
  const { copied, copy, resetOnTransitionEnd } = useCopy();

  return (
    <button
      type="button"
      aria-label="코드 복사"
      className="absolute top-3 right-5.5 cursor-copy rounded-xs border border-line bg-background p-1 text-ink-faint opacity-0 transition-[opacity,color] duration-300 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      onClick={() => copy(code)}
      onTransitionEnd={resetOnTransitionEnd}
    >
      {copied ? (
        <>
          <span className="fade-in slide-in-from-bottom-2 absolute -top-5 left-1/2 origin-bottom -translate-x-1/2 animate-in break-keep bg-background text-ink-muted text-xs">
            복사됨
          </span>
          <ClipboardCheck size={20} />
        </>
      ) : (
        <Clipboard size={20} />
      )}
    </button>
  );
}
