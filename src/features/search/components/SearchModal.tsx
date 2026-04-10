import { clsx } from "clsx";
import { Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  Input,
  ModalOverlay,
  Modal as RACModal,
  TextField,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { usePagefind } from "#/features/search/hooks/use-pagefind.ts";
import { Link } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface PagefindResult {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    image?: string;
  };
}

const overlayStyles = ({
  isEntering,
  isExiting,
}: {
  isEntering: boolean;
  isExiting: boolean;
}) =>
  cn(
    "fixed top-0 left-0 isolate z-50 h-[100dvh] w-full bg-black/50 text-center backdrop-blur-xs",
    isEntering && "fade-in animate-in duration-200 ease-out",
    isExiting && "fade-out animate-out duration-200 ease-in",
  );

const modalStyles = ({
  isEntering,
  isExiting,
}: {
  isEntering: boolean;
  isExiting: boolean;
}) =>
  twMerge(
    clsx(
      "max-h-[calc(var(--visual-viewport-height)*.9)] w-full max-w-[min(90vw,650px)] overflow-hidden rounded-2xl border border-black/10 bg-white bg-clip-padding text-left align-middle font-sans text-neutral-700 shadow-2xl dark:border-white/10 dark:bg-neutral-800/70 dark:text-neutral-300 dark:backdrop-blur-2xl dark:backdrop-saturate-200",
      isEntering && "zoom-in-105 animate-in duration-200 ease-out",
      isExiting && "zoom-out-95 animate-out duration-200 ease-in",
    ),
  );

export function SearchModal() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const pagefind = usePagefind();

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (!pagefind || value === "") {
      setResults([]);
      return;
    }

    const searchRes = await pagefind.search(value, {
      filters: {
        lang: "ko",
      },
    });
    const resultsData = await Promise.all(
      searchRes.results.slice(0, 10).map(async (r: any) => {
        const data = await r.data();
        return {
          ...data,
          url: data.url.replace(/^\/client/, ""),
        };
      }),
    );
    setResults(resultsData);
  };

  return (
    <ModalOverlay className={overlayStyles} isDismissable>
      <div className="sticky top-0 left-0 box-border flex h-dvh w-full items-start justify-center p-4 pt-16">
        <RACModal className={modalStyles}>
          <Dialog role="dialog" className="outline-hidden">
            {({ close }) => (
              <div className="flex flex-col">
                <div className="flex items-center border-stone-200 border-b px-4 py-3 dark:border-stone-800">
                  <SearchIcon className="mr-3 h-5 w-5 text-stone-400" />
                  <TextField
                    autoFocus
                    aria-label="게시글 검색"
                    className="flex-1"
                    value={search}
                    onChange={handleSearch}
                  >
                    <Input
                      placeholder="게시글 검색..."
                      className="w-full border-none bg-transparent text-lg text-stone-900 outline-hidden placeholder:text-stone-400 dark:text-stone-100"
                    />
                  </TextField>
                  <Button
                    onPress={close}
                    className="ml-3 rounded-md p-1 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <X className="h-5 w-5 text-stone-400" />
                  </Button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <Link
                          key={result.url}
                          to={result.url}
                          onClick={() => {
                            close();
                            setSearch("");
                            setResults([]);
                          }}
                          className="group flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                          <span className="font-semibold text-stone-900 transition-colors group-hover:text-primary dark:text-stone-100">
                            {result.meta.title}
                          </span>
                          <p
                            className="mt-1 line-clamp-2 text-sm text-stone-500 dark:text-stone-400"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        </Link>
                      ))}
                    </div>
                  ) : search !== "" ? (
                    <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                      "{search}"에 대한 결과가 없습니다
                    </div>
                  ) : (
                    <div className="py-12 text-center text-stone-500 dark:text-stone-400">
                      검색어를 입력하세요...
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dialog>
        </RACModal>
      </div>
    </ModalOverlay>
  );
}
