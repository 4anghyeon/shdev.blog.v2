import { Github, Linkedin, Mail } from "iconoir-react";
import { Link } from "#/shared/components/Link.tsx";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-y-4 border-gray-200 border-t py-10 sm:pb-20">
      <div className="flex gap-4 [&>a]:hover:animate-bounce">
        <Link
          className="hover:text-gray-500 dark:fill-primary"
          to={"https://github.com/4anghyeon" as string}
          aria-label="Github Link"
        >
          <Github />
        </Link>
        <Link
          className="hover:text-[#0A66C2] dark:fill-primary"
          to={"https://linkedin.com/in/4anghyeon" as string}
          aria-label="LinkedIn Link"
        >
          <Linkedin />
        </Link>
        <Link
          className="hover:text-yellow-500 dark:fill-primary"
          to={"mailto:uphyeon@kakao.com" as string}
          aria-label="email address"
        >
          <Mail />
        </Link>
      </div>
      <p className="font-minecraft text-xs">
        © 2026. Sanghyeon Lee All Rights Reserved.
      </p>
    </footer>
  );
}
