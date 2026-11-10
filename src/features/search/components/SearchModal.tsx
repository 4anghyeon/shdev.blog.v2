import { cva } from "class-variance-authority";
import { Search as SearchIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  ModalOverlay,
  Modal as RACModal,
  TextField,
} from "react-aria-components";
import { usePopularPosts } from "#/features/post-views/hooks/use-popular-posts";
import { SearchContent } from "#/features/search/components/SearchContent";
import {
  type PagefindResult,
  usePagefind,
} from "#/features/search/hooks/use-pagefind";
import { DEFAULT_LANG } from "#/shared/constant/lang";

const overlayStyles = cva(
  "fixed top-0 left-0 isolate z-50 h-[100dvh] w-full bg-scrim text-center backdrop-blur-xs",
  {
    variants: {
      isEntering: { true: "fade-in animate-in duration-200 ease-out" },
      isExiting: { true: "fade-out animate-out duration-200 ease-in" },
    },
  },
);

const modalStyles = cva(
  "hanji max-h-[calc(var(--visual-viewport-height)*.9)] w-full max-w-[min(90vw,650px)] overflow-hidden rounded-xs border border-line bg-paper-raised bg-clip-padding text-left align-middle font-sans text-ink shadow-2xl backdrop-blur-xl dark:backdrop-blur-2xl",
  {
    variants: {
      isEntering: { true: "zoom-in-105 animate-in duration-200 ease-out" },
      isExiting: { true: "zoom-out-95 animate-out duration-200 ease-in" },
    },
  },
);

export function SearchModal() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const pagefind = usePagefind();
  const popularPosts = usePopularPosts();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const showPopularPosts = results.length === 0 && popularPosts.length > 0;

  const focusResult = (index: number) => {
    const links = resultsRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[index]?.focus();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    // 한글 조합 중에 포커스를 옮기면 조합 중이던 글자가 한 번 더 입력된다
    if (e.nativeEvent.isComposing) return;

    if (e.key === "ArrowDown" && (results.length > 0 || showPopularPosts)) {
      e.preventDefault();
      focusResult(0);
    }
  };

  const handleResultKeyDown = (e: React.KeyboardEvent, index: number) => {
    const links = resultsRef.current?.querySelectorAll<HTMLAnchorElement>("a");
    if (!links) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (index < links.length - 1) focusResult(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index > 0) focusResult(index - 1);
      else inputRef.current?.focus();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (!pagefind || value === "") {
      setResults([]);
      return;
    }

    const searchRes = await pagefind.search(value, {
      filters: {
        lang: DEFAULT_LANG,
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
    <ModalOverlay
      className={({ isEntering, isExiting }) =>
        overlayStyles({ isEntering, isExiting })
      }
      isDismissable
    >
      <div className="sticky top-0 left-0 box-border flex h-dvh w-full items-start justify-center p-4 pt-16">
        <RACModal
          className={({ isEntering, isExiting }) =>
            modalStyles({ isEntering, isExiting })
          }
        >
          <Dialog role="dialog" className="outline-hidden">
            {({ close }) => (
              <div className="flex flex-col">
                <div className="flex items-center border-line-subtle border-b px-4 py-3">
                  <SearchIcon className="mr-3 h-5 w-5 text-ink-faint" />
                  <TextField
                    autoFocus
                    aria-label="게시글 검색"
                    className="flex-1"
                    value={search}
                    onChange={handleSearch}
                  >
                    <Input
                      ref={inputRef}
                      placeholder="게시글 검색..."
                      className="w-full border-none bg-transparent text-ink-strong text-lg outline-hidden placeholder:text-ink-faint"
                      onKeyDown={handleInputKeyDown}
                    />
                  </TextField>
                  <Button
                    onPress={close}
                    className="ml-3 rounded-xs p-1 transition-colors hover:bg-paper-hover"
                  >
                    <X className="h-5 w-5 text-ink-faint" />
                  </Button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                  <SearchContent
                    search={search}
                    results={results}
                    popularPosts={popularPosts}
                    resultsRef={resultsRef}
                    onSelect={() => {
                      close();
                      setSearch("");
                      setResults([]);
                    }}
                    onResultKeyDown={handleResultKeyDown}
                  />
                </div>
              </div>
            )}
          </Dialog>
        </RACModal>
      </div>
    </ModalOverlay>
  );
}
