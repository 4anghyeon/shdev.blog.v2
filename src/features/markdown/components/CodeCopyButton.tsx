import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const CodeCopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
    });
  };

  // 버튼이 완전히 사라진 후 상태 초기화
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // opacity 트랜지션이 끝나고 버튼이 보이지 않을 때만 초기화
    if (e.propertyName === "opacity") {
      setCopied(false);
    }
  };

  return (
    <button
      className="absolute top-1 right-4 cursor-copy rounded-md border border-gray-200 bg-background p-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100"
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
    >
      {copied ? (
        <>
          <span className="fade-in slide-in-from-bottom-2 absolute -top-5 left-1/2 origin-bottom -translate-x-1/2 transform animate-in break-keep bg-white text-gray-400 text-xs">
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
