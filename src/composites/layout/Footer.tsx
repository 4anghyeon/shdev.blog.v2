import { Github, Linkedin, Mail } from "iconoir-react";
import { Rss } from "lucide-react";
import { Link } from "#/shared/components/Link";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-y-4 border-gray-200 border-t pt-10 pb-20 dark:border-stone-600">
      <div className="flex gap-4 [&>a]:hover:animate-sway">
        <Link
          className="hover:text-gray-500"
          to={"https://github.com/4anghyeon" as string}
          aria-label="Github Link"
        >
          <Github />
        </Link>
        <Link
          className="hover:text-[#0A66C2]"
          to={"https://linkedin.com/in/4anghyeon" as string}
          aria-label="LinkedIn Link"
        >
          <Linkedin />
        </Link>
        <Link
          className="hover:text-yellow-500"
          to={"mailto:uphyeon@kakao.com" as string}
          aria-label="email address"
        >
          <Mail />
        </Link>
        <Link
          className="hover:text-stone-500"
          to="/rss.xml"
          aria-label="rss feed"
          reloadDocument
        >
          <Rss />
        </Link>
      </div>
      <p className="font-minecraft text-xs">
        © 2026. Sanghyeon Lee All Rights Reserved.
      </p>
    </footer>
  );
}
