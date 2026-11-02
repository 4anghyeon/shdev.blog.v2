import { Github, Linkedin, Mail } from "iconoir-react";
import { Rss } from "lucide-react";
import { Link } from "#/shared/components/Link";
import { BlogMeta } from "#/shared/constant/metadata";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-y-4 border-gray-200 border-t pt-10 pb-20 dark:border-stone-600">
      <div className="flex gap-4 [&>a]:hover:animate-sway">
        <Link
          className="hover:text-gray-500"
          to={BlogMeta.social.github as string}
          rel="me noopener noreferrer"
          aria-label="Github Link"
        >
          <Github />
        </Link>
        <Link
          className="hover:text-[#0A66C2]"
          to={BlogMeta.social.linkedin as string}
          rel="me noopener noreferrer"
          aria-label="LinkedIn Link"
        >
          <Linkedin />
        </Link>
        <Link
          className="hover:text-yellow-500"
          to={`mailto:${BlogMeta.social.email}` as string}
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
