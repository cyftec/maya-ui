import { dstring } from "@cyftech/signal";
import { component, m } from "@mufw/maya";

type GithubLinkProps = {
  classNames?: string;
  url: string;
  size?: number;
};

export const GithubLink = component<GithubLinkProps>(
  ({ classNames, url, size }) =>
    m.A({
      class: classNames,
      target: "_blank",
      href: url || "https://github.com",
      children: [
        m.Img({
          class: "ba b--none br-100",
          src: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          height: dstring`${() => size?.value || 32}`,
          width: dstring`${() => size?.value || 32}`,
        }),
      ],
    })
);
