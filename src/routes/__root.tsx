import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Footer } from "#/composites/layout/Footer.tsx";
import { Navbar } from "#/composites/layout/Navbar.tsx";
import { ThemeProvider } from "#/features/theme/provider/ThemeProvider.tsx";
import { BASE_URL } from "#/shared/constant/base.ts";
import appCss from "../styles.css?url";

const title = "shdev.blog";
const description =
  "A personal technology blog where I organize what I've learned and experienced.";
const ogDescription =
  "Personal tech blog sharing insights and experiences in technology, programming, and trends to inspire your tech journey.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: ogDescription },
      { property: "og:site_name", content: "shdev.blog" },
      { property: "og:image", content: `${BASE_URL}/images/main-og.webp` },
      { property: "og:url", content: BASE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: BASE_URL },
      { rel: "alternate", hrefLang: "x-default", href: BASE_URL },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <HeadContent />
        <title>shdev.blog</title>
      </head>
      <body className="flex min-h-svh flex-col bg-background font-sans text-text-default antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
