import { useState } from "react";

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    });
  };

  const resetOnTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === "opacity") {
      setCopied(false);
    }
  };

  return { copied, copy, resetOnTransitionEnd };
}
