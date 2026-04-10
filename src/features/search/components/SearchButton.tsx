import { Search as SearchIcon } from "lucide-react";
import { Suspense } from "react";
import { Button, DialogTrigger } from "react-aria-components";
import { SearchModal } from "#/features/search/components/SearchModal.tsx";
export function SearchButton() {
  return (
    <DialogTrigger>
      <Button
        type="button"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Search"
      >
        <SearchIcon className="h-5 w-5 text-stone-700 dark:text-stone-300" />
      </Button>
      <Suspense>
        <SearchModal />
      </Suspense>
    </DialogTrigger>
  );
}
