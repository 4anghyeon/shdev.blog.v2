import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "#/composites/layout/Footer";
import { Navbar } from "#/composites/layout/Navbar";
import { ThemeProvider } from "#/features/theme/provider/ThemeProvider";
import { GoogleAnalyticsScript } from "#/shared/components/GoogleAnalyticsScript";
import { BlogMeta } from "#/shared/constant/metadata";
import ShikiCss from "#/styles/shiki.css?url";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: BlogMeta.title },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { name: "description", content: BlogMeta.description },
      { property: "og:title", content: BlogMeta.title },
      { property: "og:description", content: BlogMeta.description },
      { property: "og:site_name", content: BlogMeta.siteName },
      {
        property: "og:image",
        content: `${BlogMeta.baseUrl}images/main-og.webp`,
      },
      { property: "og:url", content: BlogMeta.baseUrl },
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
      {
        rel: "stylesheet",
        href: ShikiCss,
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
