import type { IframeHTMLAttributes } from "react";

export const YoutubeIframe = ({ src, title }: IframeHTMLAttributes<string>) => {
  return (
    <iframe
      className="my-6"
      width="560"
      height="315"
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
};
