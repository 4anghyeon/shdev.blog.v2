import { ChevronUp, Command, Search as SearchIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Button, DialogTrigger } from "react-aria-components";
import { SearchModal } from "#/features/search/components/SearchModal.tsx";
import { useUserAgent } from "#/shared/hooks/use-user-agent.ts";

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { os } = useUserAgent();

  const ShortcutIcon = os === "mac" ? Command : ChevronUp;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        type="button"
        className="flex cursor-pointer items-center gap-x-3 rounded-2xl border border-neutral-300 bg-neutral-100 p-1 px-2 text-neutral-500 text-xs hover:bg-neutral-300 hover:text-black dark:border-stone-200 dark:bg-stone-300 dark:hover:bg-stone-200"
        aria-label="Search"
      >
        <SearchIcon size={12} className="text-stone-700" />
        <span className="flex items-center gap-x-0.5">
          <ShortcutIcon size={12} /> K
        </span>
      </Button>
      <Suspense>
        <SearchModal />
      </Suspense>
    </DialogTrigger>
  );
}
