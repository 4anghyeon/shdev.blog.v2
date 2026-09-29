import { ChevronUp, Command, Search as SearchIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Button, DialogTrigger } from "react-aria-components";
import { SearchModal } from "#/features/search/components/SearchModal";
import { useUserAgent } from "#/shared/hooks/use-user-agent";

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
        className="flex cursor-pointer items-center gap-x-3 rounded-xs border border-line bg-paper px-2 py-1 text-ink-muted text-xs tracking-wide backdrop-blur-sm transition-colors hover:border-ink-faint hover:bg-paper-hover hover:text-ink-strong"
        aria-label="Search"
      >
        <SearchIcon size={12} />
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
