import { createLink, type LinkComponent } from "@tanstack/react-router";
import * as React from "react";

interface BasicLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return <a ref={ref} {...props} />;
  },
);

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const Link: LinkComponent<typeof BasicLinkComponent> = (props) => {
  const isExternal = (props.to as string)?.startsWith("http");

  return (
    <CreatedLinkComponent
      preload="intent"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer nofollow external" : undefined}
      {...props}
    />
  );
};
