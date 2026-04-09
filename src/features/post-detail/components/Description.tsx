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
    <div className="flex items-center gap-x-2">
      <img
        className="mr-2 aspect-square shrink-0 rounded-full border border-gray-300"
        alt="profile icon"
        src="/images/profile.webp"
        width={40}
        height={40}
      />
      <div className="relative min-h-fit w-full rounded-lg border border-gray-200 bg-white text-sm before:absolute before:top-1/2 before:-left-4 before:z-0 before:block before:-translate-y-1/2 before:border-8 before:border-t-transparent before:border-r-gray-200 before:border-b-transparent before:border-l-transparent before:border-solid before:content-[''] after:absolute after:top-1/2 after:left-[-13.5px] after:z-10 after:block after:-translate-y-1/2 after:border-[7px] after:border-t-transparent after:border-r-white after:border-b-transparent after:border-l-transparent after:border-solid after:content-[''] dark:border-stone-600 dark:bg-stone-800 dark:after:border-r-stone-800 dark:before:border-r-stone-600">
        <p className="absolute top-0 left-0 flex h-full items-center p-2">
          {description}
        </p>
        <p className="h-full p-2 opacity-0">{children}</p>
      </div>
    </div>
  );
}
