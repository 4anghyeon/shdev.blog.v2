import { EchoText } from "echo-text";
import { type ReactNode, useEffect, useState } from "react";

interface DescriptionProps {
  children: ReactNode;
}

export function Description({ children }: DescriptionProps) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    const descriptionString = children?.toString();
    if (descriptionString) {
      const et = new EchoText(
        [descriptionString],
        1000 / descriptionString.length,
      );
      et.on("update", ({ text }) => {
        setDescription(text);
      });
      et.start();
    }
  }, [children?.toString]);

  return (
    <div className="flex items-center gap-x-4">
      <img
        className="aspect-square size-14 shrink-0 rounded-full border border-line"
        alt="profile icon"
        src="/images/profile.webp"
        width={120}
        height={120}
      />
      <div className="relative w-full rounded-xs border border-line bg-paper-solid bg-clip-padding text-ink text-sm leading-relaxed before:absolute before:top-1/2 before:-left-4 before:-translate-y-1/2 before:border-8 before:border-transparent before:border-r-line before:content-[''] after:absolute after:top-1/2 after:left-[-13.5px] after:-translate-y-1/2 after:border-[7px] after:border-transparent after:border-r-paper-solid after:content-['']">
        <p className="absolute inset-0 flex items-center px-3 py-2">
          {description}
        </p>
        <p className="px-3 py-2 opacity-0">{children}</p>
      </div>
    </div>
  );
}
