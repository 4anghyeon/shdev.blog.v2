import { Clipboard, ClipboardCheck } from "lucide-react";
import { useCopy } from "@/shared/hooks/useCopy";

const CodeCopyButton = ({ code }: { code: string }) => {
  const { copied, copy, resetOnTransitionEnd } = useCopy();

  return (
    <button
      type="button"
      className="absolute top-3 right-5.5 cursor-copy rounded-md border border-gray-200 bg-background p-1 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:border-gray-600"
      onClick={() => copy(code)}
      onTransitionEnd={resetOnTransitionEnd}
    >
      {copied ? (
        <>
          <span className="fade-in slide-in-from-bottom-2 absolute -top-5 left-1/2 origin-bottom -translate-x-1/2 transform animate-in break-keep bg-background text-gray-400 text-xs dark:text-gray-200">
            복사됨
          </span>
          <ClipboardCheck className="text-gray-400" size={20} />
        </>
      ) : (
        <Clipboard className="text-gray-400" size={20} />
      )}
    </button>
  );
};

export default CodeCopyButton;
