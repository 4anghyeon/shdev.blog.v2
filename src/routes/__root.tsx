import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "#/composites/layout/Footer.tsx";
import { Navbar } from "#/composites/layout/Navbar.tsx";
import { ThemeProvider } from "#/features/theme/provider/ThemeProvider.tsx";
import { GoogleAnalyticsScript } from "#/shared/components/GoogleAnalyticsScript.tsx";
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
      {
        name: "naver-site-verification",
        content: "a525afa1b71b59077665f12a8a87b009d8c7b70b",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "production" && <GoogleAnalyticsScript />}
        <HeadContent />
      </head>
      <body className="flex min-h-svh flex-col bg-background font-pretendard text-text-default antialiased">
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
        {process.env.NODE_ENV === "production" && <Analytics />}
        <Scripts />
      </body>
    </html>
  );
}
