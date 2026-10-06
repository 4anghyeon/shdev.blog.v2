import type { ReactNode } from "react";
import { BrushDivider } from "#/shared/components/BrushDivider";
import { Link, type LinkProps } from "#/shared/components/Link";

export function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-dokdo text-9xl text-ink-strong leading-none">404</p>
      <BrushDivider className="mt-4 w-40" />
      <h1 className="mt-8 font-bold text-ink-strong text-xl">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-2 text-ink-muted text-sm">
        주소가 잘못되었거나, 삭제된 페이지예요.
      </p>
      <nav className="mt-10 flex gap-x-3">
        <NotFoundLink to="/">홈으로</NotFoundLink>
        <NotFoundLink to="/series">시리즈 보기</NotFoundLink>
      </nav>
    </main>
  );
}

function NotFoundLink({
  to,
  children,
}: {
  to: LinkProps["to"];
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="hanji rounded-xs border border-line bg-paper px-4 py-2 text-ink text-sm transition-colors hover:border-ink-faint hover:bg-paper-hover hover:text-ink-strong"
    >
      {children}
    </Link>
  );
}
